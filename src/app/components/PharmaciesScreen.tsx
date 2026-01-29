import { ArrowLeft, MapPin, Phone, Clock, Navigation, Pill } from 'lucide-react';
import { useState } from 'react';
import { MapView } from './MapView';

interface PharmaciesScreenProps {
  onBack: () => void;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  services: string[];
  lat: number;
  lng: number;
}

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'Farmácia Popular',
    address: 'Rua do Comércio, 45, Luanda',
    distance: '0.8 km',
    phone: '+244 923 555 111',
    hours: 'Seg-Sáb: 8h-20h',
    services: ['Medicamentos', 'Vacinas', 'Teste COVID'],
    lat: -8.8180,
    lng: 13.2350,
  },
  {
    id: '2',
    name: 'Farmácia Saúde+',
    address: 'Av. Brasil, 234, Luanda',
    distance: '1.5 km',
    phone: '+244 923 666 222',
    hours: '24 horas',
    services: ['Medicamentos', 'Manipulação', 'Dermocosméticos'],
    lat: -8.8100,
    lng: 13.2280,
  },
  {
    id: '3',
    name: 'Farmácia Central',
    address: 'Rua Major Kanhangulo, 78, Luanda',
    distance: '2.1 km',
    phone: '+244 923 777 333',
    hours: 'Seg-Sex: 7h-21h, Sáb: 8h-14h',
    services: ['Medicamentos', 'Produtos Naturais', 'Ortopedia'],
    lat: -8.8220,
    lng: 13.2320,
  },
];

export function PharmaciesScreen({ onBack }: PharmaciesScreenProps) {
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [showMap, setShowMap] = useState(true);

  const handleCallPharmacy = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (pharmacy: Pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Farmácias Próximas</h1>
            <p className="text-primary-foreground/80 text-sm">Encontre medicamentos perto de você</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Map Section */}
        <div className="bg-card rounded-2xl shadow-md overflow-hidden border border-border">
          <div className="p-4 flex justify-between items-center border-b border-border">
            <h2 className="text-lg font-bold text-foreground">Mapa</h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-primary text-sm font-medium"
            >
              {showMap ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showMap && (
            <div className="h-64">
              <MapView />
            </div>
          )}
        </div>

        {/* Pharmacies List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Lista de Farmácias</h3>
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl">
                    <Pill className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{pharmacy.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pharmacy.distance}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2">{pharmacy.address}</p>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <Clock className="w-4 h-4" />
                {pharmacy.hours}
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {pharmacy.services.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCallPharmacy(pharmacy.phone)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Ligar
                </button>
                <button
                  onClick={() => handleGetDirections(pharmacy)}
                  className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2.5 rounded-xl font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Direções
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
