'use client';

import dynamic from 'next/dynamic';

const hospitals = [
  { id: 1, name: 'Hospital Central', lat: -8.8137, lng: 13.2302, type: 'hospital' },
  { id: 2, name: 'Clínica Boa Vida', lat: -8.8200, lng: 13.2400, type: 'hospital' },
  { id: 3, name: 'Hospital Geral', lat: -8.8050, lng: 13.2250, type: 'hospital' },
];

const pharmacies = [
  { id: 4, name: 'Farmácia Popular', lat: -8.8180, lng: 13.2350, type: 'pharmacy' },
  { id: 5, name: 'Farmácia Saúde+', lat: -8.8100, lng: 13.2280, type: 'pharmacy' },
  { id: 6, name: 'Farmácia Central', lat: -8.8220, lng: 13.2320, type: 'pharmacy' },
];

const locations = [...hospitals, ...pharmacies];

interface MapViewProps {
  onLocationSelect?: (location: any) => void;
}

// Dynamically import the map component with no SSR
const MapContent = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg bg-muted flex items-center justify-center">
      <span className="text-muted-foreground">Carregando mapa...</span>
    </div>
  ),
});

export function MapView({ onLocationSelect }: MapViewProps) {
  return (
    <MapContent locations={locations} onLocationSelect={onLocationSelect} />
  );
}
