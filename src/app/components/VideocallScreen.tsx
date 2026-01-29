import { ArrowLeft, Video, Clock, User, Calendar, Phone } from 'lucide-react';
import { useState } from 'react';

interface VideocallScreenProps {
  onBack: () => void;
}

interface ScheduledCall {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'waiting' | 'ready' | 'completed';
  roomUrl: string;
}

const mockScheduledCalls: ScheduledCall[] = [
  {
    id: '1',
    doctorName: 'Dr. João Silva',
    specialty: 'Cardiologia',
    date: '29 Jan, 2026',
    time: '14:00',
    status: 'ready',
    roomUrl: 'https://meet.boasaude.ao/room/abc123',
  },
  {
    id: '2',
    doctorName: 'Dra. Maria Santos',
    specialty: 'Dermatologia',
    date: '30 Jan, 2026',
    time: '10:30',
    status: 'waiting',
    roomUrl: 'https://meet.boasaude.ao/room/def456',
  },
  {
    id: '3',
    doctorName: 'Dr. Pedro Costa',
    specialty: 'Clínico Geral',
    date: '28 Jan, 2026',
    time: '16:00',
    status: 'completed',
    roomUrl: 'https://meet.boasaude.ao/room/ghi789',
  },
];

export function VideocallScreen({ onBack }: VideocallScreenProps) {
  const [calls] = useState<ScheduledCall[]>(mockScheduledCalls);

  const handleJoinRoom = (call: ScheduledCall) => {
    if (call.status === 'ready') {
      // Abrir a sala de videochamada
      window.open(call.roomUrl, '_blank');
    }
  };

  const getStatusBadge = (status: ScheduledCall['status']) => {
    switch (status) {
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            Disponível
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="w-3 h-3" />
            Aguardando
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            Concluída
          </span>
        );
    }
  };

  const activeCalls = calls.filter(c => c.status !== 'completed');
  const completedCalls = calls.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Teleconsultas</h1>
            <p className="text-primary-foreground/80 text-sm">Suas consultas virtuais agendadas</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Active Calls */}
        {activeCalls.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Consultas Ativas</h2>
            <div className="space-y-3">
              {activeCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{call.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{call.specialty}</p>
                      </div>
                    </div>
                    {getStatusBadge(call.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{call.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{call.time}</span>
                    </div>
                  </div>

                  {call.status === 'ready' && (
                    <button
                      onClick={() => handleJoinRoom(call)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Video className="w-5 h-5" />
                      Entrar na Sala
                    </button>
                  )}

                  {call.status === 'waiting' && (
                    <div className="w-full bg-muted py-3 rounded-xl text-center text-muted-foreground text-sm">
                      Aguardando horário da consulta
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Calls */}
        {completedCalls.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Histórico</h2>
            <div className="space-y-3">
              {completedCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-card border border-border rounded-2xl p-4 opacity-60"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{call.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{call.specialty}</p>
                      </div>
                    </div>
                    {getStatusBadge(call.status)}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{call.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{call.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {calls.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Video className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma teleconsulta agendada
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Agende uma consulta online para aparecer aqui
            </p>
            <button
              onClick={onBack}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Agendar Consulta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
