import { ArrowLeft, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { useState } from 'react';
import { MapView } from './MapView';

interface ClinicsScreenProps {
  onBack: () => void;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  specialties: string[];
  lat: number;
  lng: number;
}

const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Hospital Central',
    address: 'Rua Principal, 123, Luanda',
    distance: '1.2 km',
    phone: '+244 923 456 789',
    hours: 'Seg-Sex: 8h-18h, Sáb: 8h-12h',
    specialties: ['Cardiologia', 'Dermatologia', 'Pediatria'],
    lat: -8.8137,
    lng: 13.2302,
  },
  {
    id: '2',
    name: 'Clínica Boa Vida',
    address: 'Av. 4 de Fevereiro, 456, Luanda',
    distance: '2.5 km',
    phone: '+244 923 111 222',
    hours: 'Seg-Sex: 7h-19h',
    specialties: ['Clínico Geral', 'Ortopedia'],
    lat: -8.8200,
    lng: 13.2400,
  },
  {
    id: '3',
    name: 'Hospital Geral',
    address: 'Rua da Saúde, 789, Luanda',
    distance: '3.8 km',
    phone: '+244 923 333 444',
    hours: '24 horas',
    specialties: ['Emergência', 'Cirurgia', 'Pediatria'],
    lat: -8.8050,
    lng: 13.2250,
  },
];

export function ClinicsScreen({ onBack }: ClinicsScreenProps) {
  const [clinics] = useState<Clinic[]>(mockClinics);
  const [showMap, setShowMap] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const handleCallClinic = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (clinic: Clinic) => {
    // Abrir Google Maps ou Waze com as coordenadas
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;
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
            <h1 className="text-2xl font-bold">Clínicas Próximas</h1>
            <p className="text-primary-foreground/80 text-sm">Encontre o local mais perto de você</p>
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

        {/* Clinics List */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">
            {clinics.length} clínica{clinics.length !== 1 ? 's' : ''} próxima{clinics.length !== 1 ? 's' : ''}
          </h2>
          
          <div className="space-y-3">
            {clinics.map((clinic) => (
              <div
                key={clinic.id}
                className={`bg-card border-2 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  selectedClinic?.id === clinic.id ? 'border-primary' : 'border-border'
                }`}
                onClick={() => setSelectedClinic(clinic.id === selectedClinic?.id ? null : clinic)}
              >
                {/* Clinic Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg mb-1">{clinic.name}</h3>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{clinic.address}</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold ml-2">
                    {clinic.distance}
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {clinic.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Hours */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{clinic.hours}</span>
                </div>

                {/* Expanded Details */}
                {selectedClinic?.id === clinic.id && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <button
                      onClick={() => handleCallClinic(clinic.phone)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Ligar para Clínica
                    </button>
                    
                    <button
                      onClick={() => handleGetDirections(clinic)}
                      className="w-full bg-primary hover:opacity-90 text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity"
                    >
                      <Navigation className="w-5 h-5" />
                      Como Chegar
                    </button>

                    <div className="bg-muted/50 p-3 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong className="text-foreground">Telefone:</strong> {clinic.phone}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        Ligue para agendar uma consulta presencial nesta clínica
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Como agendar consulta presencial
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Para marcar uma consulta presencial, ligue diretamente para a clínica de sua preferência. 
            Nossa equipe terá prazer em atendê-lo!
          </p>
        </div>
      </div>
    </div>
  );
}
