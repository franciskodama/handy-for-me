'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Helper to get authenticated user details
async function getAuthenticatedUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { uid: email } });
}

export async function addVisitedPlace({
  uid,
  city,
  state,
  country,
  notes,
  visitDate
}: {
  uid: string;
  city: string;
  state?: string;
  country: string;
  notes?: string;
  visitDate?: string | null;
}) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      console.warn('Unauthorized attempt to add visited place');
      return { success: false, error: 'Unauthorized' };
    }

    // Input Validation
    if (!city.trim() || !country.trim()) {
      return { success: false, error: 'City and Country are required.' };
    }

    // Format the query for OSM Nominatim geocoding
    const queryParts = [city.trim()];
    if (state?.trim()) {
      queryParts.push(state.trim());
    }
    queryParts.push(country.trim());
    const query = queryParts.join(', ');

    // Geocoding request
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'HandyForMe-Atlas/1.0 (contact: support@handyforme.local)'
      }
    });

    if (!res.ok) {
      return { success: false, error: 'Geocoding service unavailable. Please try again later.' };
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      return { success: false, error: `Could not find coordinates for "${query}". Please check spelling.` };
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (isNaN(lat) || isNaN(lng)) {
      return { success: false, error: 'Invalid coordinates returned from search.' };
    }

    let parsedVisitDate: Date | null = null;
    if (visitDate) {
      const d = new Date(visitDate);
      if (isNaN(d.getTime())) {
        return { success: false, error: 'Invalid visit date format.' };
      }
      const year = d.getFullYear();
      if (year < 1000 || year > 9999) {
        return { success: false, error: 'Visit date year must be a 4-digit year.' };
      }
      parsedVisitDate = d;
    }

    // Save to database
    const newPlace = await prisma.visitedPlace.create({
      data: {
        id: v4(),
        createdAt: new Date(),
        uid,
        city: city.trim(),
        state: state?.trim() || null,
        country: country.trim(),
        lat,
        lng,
        notes: notes?.trim() || null,
        visitDate: parsedVisitDate
      }
    });

    return { success: true, data: newPlace };
  } catch (error) {
    console.error('Error adding visited place:', error);
    return { success: false, error: 'An unexpected error occurred while adding the place.' };
  }
}

export async function getVisitedPlaces(uid: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.uid !== uid) {
      return { success: false, error: 'Unauthorized' };
    }

    const places = await prisma.visitedPlace.findMany({
      where: { uid },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: places };
  } catch (error) {
    console.error('Error getting visited places:', error);
    return { success: false, error: 'Failed to fetch visited places.' };
  }
}

export async function deleteVisitedPlace(id: string) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, error: 'Unauthorized' };

    const place = await prisma.visitedPlace.findUnique({
      where: { id }
    });

    if (!place) return { success: false, error: 'Place not found' };

    if (place.uid !== user.uid) {
      console.warn('Unauthorized delete attempt of visited place');
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.visitedPlace.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting visited place:', error);
    return { success: false, error: 'Failed to delete visited place.' };
  }
}

let citiesCache: Array<{ n: string; c: string; s: string }> | null = null;

export async function searchCities(
  query: string
): Promise<Array<{ name: string; country: string; state: string }>> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchLower = query.trim().toLowerCase();

    // Lazy load the cities JSON file and cache it in memory
    if (!citiesCache) {
      const filePath = path.join(process.cwd(), 'lib/data/cities.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      citiesCache = JSON.parse(fileContent);
    }

    if (!citiesCache) return [];

    const matches: Array<{ name: string; country: string; state: string }> = [];

    // First pass: Match by prefix (starts with) to show best matches first
    for (const city of citiesCache) {
      if (city.n.toLowerCase().startsWith(searchLower)) {
        matches.push({
          name: city.n,
          country: city.c,
          state: city.s
        });
      }
      if (matches.length >= 10) {
        break;
      }
    }

    // Second pass: If we have less than 10 matches, do substring match (excluding duplicates)
    if (matches.length < 10) {
      for (const city of citiesCache) {
        const nameLower = city.n.toLowerCase();
        if (!nameLower.startsWith(searchLower) && nameLower.includes(searchLower)) {
          const alreadyAdded = matches.some(
            (m) =>
              m.name.toLowerCase() === city.n.toLowerCase() &&
              m.country.toLowerCase() === city.c.toLowerCase() &&
              m.state.toLowerCase() === city.s.toLowerCase()
          );
          if (!alreadyAdded) {
            matches.push({
              name: city.n,
              country: city.c,
              state: city.s
            });
          }
        }
        if (matches.length >= 10) {
          break;
        }
      }
    }

    return matches;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

