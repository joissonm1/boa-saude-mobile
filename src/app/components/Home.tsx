import { useState } from 'react';
import { MapView } from './MapView';
import { 
  Calendar, 
  Video, 
  Hospital, 
  FileText, 
  User, 
  Bell,
  MapPin,
  Clock,
  Lightbulb,
  MessageSquare,
  Plus
} from 'lucide-react';
import { Chatbot } from './Chatbot';

interface HomeProps {
  onNavigate: (screen: string) => void;
  onShowAppointmentModal: (type: 'virtual' | 'physical') => void;
}

const upcomingAppointments = [
  {
    id: 1,
    type: 'virtual',
    doctor: 'Dr. João Silva',
    specialty: 'Cardiologia',
    date: '29 Jan, 2026',
    time: '14:00',
  },
  {
    id: 2,
    type: 'physical',
    doctor: 'Dra. Maria Santos',
    specialty: 'Dermatologia',
    date: '02 Fev, 2026',
    time: '10:30',
    location: 'Hospital Central',
  },
];

export function Home({ onNavigate, onShowAppointmentModal }: HomeProps) {
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-white/90" />
            <div>
              <h1 className="text-2xl font-bold">Olá, Paciente!</h1>
              <p className="text-teal-100 text-sm mt-1">Como está sua saúde hoje?</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <button 
            onClick={() => onShowAppointmentModal('virtual')}
            className="bg-white/20 backdrop-blur-lg p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
          >
            <Video className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs block">Virtual</span>
          </button>
          <button 
            onClick={() => onShowAppointmentModal('physical')}
            className="bg-white/20 backdrop-blur-lg p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
          >
            <Hospital className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs block">Presencial</span>
          </button>
          <button 
            onClick={() => onNavigate('prescriptions')}
            className="bg-white/20 backdrop-blur-lg p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
          >
            <FileText className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs block">Receitas</span>
          </button>
          <button className="bg-white/20 backdrop-blur-lg p-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105">
            <MapPin className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs block">Locais</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold text-gray-800">Locais Próximos</h2>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-teal-600 text-sm font-medium"
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

        {/* Appointments Section */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Próximas Consultas</h2>
            <button className="text-teal-600 text-sm font-medium">
              Ver Todas
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border-2 border-gray-100 rounded-xl p-4 hover:border-teal-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-xl ${
                      appointment.type === 'virtual' 
                        ? 'bg-purple-100' 
                        : 'bg-teal-100'
                    }`}>
                      {appointment.type === 'virtual' ? (
                        <Video className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Hospital className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {appointment.doctor}
                      </h3>
                      <p className="text-sm text-gray-500">{appointment.specialty}</p>
                      {appointment.location && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {appointment.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onShowAppointmentModal('virtual')}
            className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nova Consulta
          </button>
        </div>

        {/* Health Tips */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Dica de Saúde
          </h3>
          <p className="text-sm text-purple-100">
            Beber pelo menos 2 litros de água por dia ajuda a manter seu corpo hidratado e 
            melhora o funcionamento de todos os órgãos!
          </p>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
