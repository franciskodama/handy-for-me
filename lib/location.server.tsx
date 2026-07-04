import { headers } from 'next/headers';

export const getUserLocation = async () => {
  try {
    const headersList = await headers();
    const city = headersList.get('x-vercel-ip-city');
    const region = headersList.get('x-vercel-ip-country-region');
    const country = headersList.get('x-vercel-ip-country');

    if (city && country) {
      return { city, region: region || '', country };
    }

    // Fallback for local development or non-Vercel environments where headers are not present.
    // In local development, this server-side fetch routes through the local network (and VPN),
    // correctly returning the user's VPN location.
    const response = await fetch('https://ipinfo.io/json');
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    return {
      city: data.city,
      region: data.region,
      country: data.country
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};

