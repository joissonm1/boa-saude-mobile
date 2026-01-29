'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
}

interface MapContentProps {
  locations: Location[];
  onLocationSelect?: (location: Location) => void;
}

export default function MapContent({ locations, onLocationSelect }: MapContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Prevent double initialization
    if (mapRef.current || !containerRef.current) return;

    // Create map instance
    const map = L.map(containerRef.current).setView([-8.8137, 13.2302], 13);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add markers
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]).addTo(map);
      
      const popupContent = `
        <div class="p-2">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold">${location.name}</h3>
          </div>
          <p class="text-sm text-gray-500">
            ${location.type === 'hospital' ? 'Hospital' : 'Farmácia'}
          </p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        onLocationSelect?.(location);
      });
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations, onLocationSelect]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <div 
        ref={containerRef} 
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
}
