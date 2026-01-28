import { useState } from 'react';
import { X, Video, Hospital, Calendar, Clock, MapPin } from 'lucide-react';
import { MapView } from './MapView';

interface AppointmentModalProps {
  type: 'virtual' | 'physical';
  onClose: () => void;
}

const doctors = [
  { id: 1, name: 'Dr. João Silva', specialty: 'Cardiologia', image: '👨‍⚕️' },
  { id: 2, name: 'Dra. Maria Santos', specialty: 'Dermatologia', image: '👩‍⚕️' },
  { id: 3, name: 'Dr. Pedro Costa', specialty: 'Ortopedia', image: '👨‍⚕️' },
];

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '14:00', '15:00', '16:00', '17:00'
];

const hospitals = [
  { id: 1, name: 'Hospital Central', address: 'Av. Principal, 123', distance: '2.5 km' },
  { id: 2, name: 'Clínica Boa Vida', address: 'Rua das Flores, 456', distance: '3.8 km' },
  { id: 3, name: 'Hospital Geral', address: 'Av. Secundária, 789', distance: '1.2 km' },
];

export function AppointmentModal({ type, onClose }: AppointmentModalProps) {
  const [step, setStep] = useState<'select' | 'schedule' | 'map'>('select');
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<number | null>(null);

  const handleConfirm = () => {
    alert('Consulta agendada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {type === 'virtual' ? (
              <Video className="w-6 h-6" />
            ) : (
              <Hospital className="w-6 h-6" />
            )}
            <div>
              <h2 className="text-xl font-bold">
                Consulta {type === 'virtual' ? 'Virtual' : 'Presencial'}
              </h2>
              <p className="text-sm text-teal-100">
                {step === 'select' && 'Escolha um médico'}
                {step === 'schedule' && 'Escolha data e horário'}
                {step === 'map' && 'Escolha o hospital'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Select Doctor */}
          {step === 'select' && (
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor.id);
                    if (type === 'physical') {
                      setStep('map');
                    } else {
                      setStep('schedule');
                    }
                  }}
                  className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 hover:border-teal-500 transition-colors ${
                    selectedDoctor === doctor.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-4xl">{doctor.image}</div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                  <div className="bg-teal-100 text-teal-600 px-3 py-1 rounded-lg text-sm font-medium">
                    Disponível
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Show Map for Physical */}
          {step === 'map' && type === 'physical' && (
            <div className="space-y-4">
              <div className="h-64 rounded-2xl overflow-hidden">
                <MapView />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Hospitais Próximos</h3>
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => {
                      setSelectedHospital(hospital.id);
                      setStep('schedule');
                    }}
                    className={`w-full p-4 border-2 rounded-xl text-left hover:border-teal-500 transition-colors ${
                      selectedHospital === hospital.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{hospital.address}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{hospital.distance}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Schedule Date and Time */}
          {step === 'schedule' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Selecione a Data
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Selecione o Horário
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedTime === time
                          ? 'border-teal-500 bg-teal-50 text-teal-600 font-semibold'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {type === 'virtual' && selectedDate && selectedTime && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    Link da Consulta Virtual
                  </h4>
                  <p className="text-sm text-purple-600">
                    O link da videochamada será enviado por email e SMS 1 hora antes da consulta.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => type === 'physical' ? setStep('map') : setStep('select')}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Voltar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
