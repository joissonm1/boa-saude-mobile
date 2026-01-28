import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Hospital, Pill } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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

export function MapView({ onLocationSelect }: MapViewProps) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[-8.8137, 13.2302]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => onLocationSelect?.(location),
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  {location.type === 'hospital' ? (
                    <Hospital className="w-5 h-5 text-teal-600" />
                  ) : (
                    <Pill className="w-5 h-5 text-cyan-600" />
                  )}
                  <h3 className="font-semibold">{location.name}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  {location.type === 'hospital' ? 'Hospital' : 'Farmácia'}
                </p>
                <button
                  onClick={() => onLocationSelect?.(location)}
                  className="mt-2 w-full bg-teal-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-teal-600"
                >
                  Ver Detalhes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
