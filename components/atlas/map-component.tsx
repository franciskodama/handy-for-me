'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';

interface Place {
  id: string;
  city: string;
  state: string | null;
  country: string;
  lat: number;
  lng: number;
  notes: string | null;
  visitDate: Date | null;
}

interface MapComponentProps {
  places: Place[];
  onDeletePlace: (id: string) => void;
}

export default function MapComponent({ places, onDeletePlace }: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const { resolvedTheme } = useTheme();

  // Handle map initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 1.0
    });

    mapRef.current = map;

    // Add Tile Layer
    const isDark = resolvedTheme === 'dark';
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Initialize Markers Group
    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (!tileLayerRef.current) return;

    const isDark = resolvedTheme === 'dark';
    const newTileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    tileLayerRef.current.setUrl(newTileUrl);
  }, [resolvedTheme]);

  // Handle markers updating
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;

    if (!map || !markersGroup) return;

    // Clear old markers
    markersGroup.clearLayers();

    if (places.length === 0) return;

    // Custom glowing marker icon
    const customMarkerIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-6 w-6 rounded-full bg-red-500 opacity-40 animate-ping"></span>
          <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border border-white shadow-md"></span>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: customMarkerIcon });

      const dateStr = place.visitDate
        ? new Date(place.visitDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Date not specified';

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 text-foreground';

      // Title/Location
      const title = document.createElement('h3');
      title.className = 'font-bold text-sm text-slate-900 dark:text-slate-100';
      title.textContent = place.city + (place.state ? `, ${place.state}` : '') + `, ${place.country}`;
      popupContent.appendChild(title);

      // Date
      const date = document.createElement('p');
      date.className = 'text-xs text-muted-foreground mt-1';
      date.textContent = `📅 ${dateStr}`;
      popupContent.appendChild(date);

      // Notes (if any)
      if (place.notes) {
        const notes = document.createElement('p');
        notes.className = 'text-xs italic bg-muted p-1.5 rounded mt-2 text-slate-700 dark:text-slate-300 max-w-[200px] break-words';
        notes.textContent = place.notes;
        popupContent.appendChild(notes);
      }

      // Delete action button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 rounded transition-colors';
      deleteBtn.textContent = 'Remove Pin';
      deleteBtn.onclick = () => {
        if (confirm(`Are you sure you want to remove "${place.city}"?`)) {
          map.closePopup();
          onDeletePlace(place.id);
        }
      };
      popupContent.appendChild(deleteBtn);

      marker.bindPopup(popupContent);
      markersGroup.addLayer(marker);
    });

    // Fit map bounds to show all markers
    try {
      const bounds = markersGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    } catch (e) {
      console.error('Error fitting bounds:', e);
    }
  }, [places, onDeletePlace]);

  return (
    <div className="relative w-full h-[500px] rounded-lg border bg-card overflow-hidden shadow-inner z-10">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
