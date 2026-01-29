import { useState } from 'react';
import { ArrowLeft, Video, Hospital, Search, Star, Clock, User, MapPin, Phone, Navigation } from 'lucide-react';
import { mockDoctors, generateMockSlots, mockWallet } from '@/lib/mock-data';
import { PriceDisplay } from './common/PriceDisplay';
import { SlotGrid } from './booking/SlotGrid';
import { PaymentMethodSelector } from './payment/PaymentMethodSelector';
import { CountdownTimer } from './common/CountdownTimer';
import { MapView } from './MapView';
import type { Doctor, Slot, Reservation, BookingState } from '@/types';

interface BookingFlowProps {
  onBack: () => void;
  onSuccess: (appointmentId: string) => void;
}

type BookingStep = 'type' | 'doctor' | 'datetime' | 'summary' | 'success' | 'hospitals';
type ConsultationType = 'online' | 'presencial';
type PaymentMethod = 'wallet' | 'card';

// Mock hospitals for presencial view
const mockHospitals = [
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

export function BookingFlow({ onBack, onSuccess }: BookingFlowProps) {
  const [step, setStep] = useState<BookingStep>('type');
  const [consultationType, setConsultationType] = useState<ConsultationType | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter doctors based on search
  const filteredDoctors = mockDoctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate available dates (next 14 days)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  // Get slots for selected date
  const slots = selectedDoctor && selectedDate && consultationType
    ? generateMockSlots(selectedDoctor.id, selectedDate, consultationType)
    : [];

  const handleSelectType = (type: ConsultationType) => {
    setConsultationType(type);
    if (type === 'presencial') {
      setStep('hospitals');
    } else {
      setStep('doctor');
    }
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep('datetime');
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    // Create temporary reservation
    const newReservation: Reservation = {
      reservationId: `res-${Date.now()}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      price: slot.price,
      slotId: slot.slotId,
      doctorId: selectedDoctor!.id,
      doctorName: selectedDoctor!.name,
      datetime: slot.datetime,
      type: consultationType!,
    };
    setReservation(newReservation);
    setStep('summary');
  };

  const handleReservationExpire = () => {
    setReservation(null);
    setSelectedSlot(null);
    setStep('datetime');
    alert('Tempo de reserva expirado. Por favor, selecione novamente.');
  };

  const handleConfirmBooking = async () => {
    if (!paymentMethod || !reservation) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setStep('success');
  };

  const handleGoBack = () => {
    switch (step) {
      case 'type':
        onBack();
        break;
      case 'doctor':
        setStep('type');
        setConsultationType(null);
        break;
      case 'hospitals':
        setStep('type');
        setConsultationType(null);
        break;
      case 'datetime':
        setStep('doctor');
        setSelectedDoctor(null);
        setSelectedDate('');
        break;
      case 'summary':
        setStep('datetime');
        setSelectedSlot(null);
        setReservation(null);
        break;
      default:
        onBack();
    }
  };

  const handleCallHospital = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {step === 'type' && 'Agendar Consulta'}
              {step === 'doctor' && 'Escolher Médico'}
              {step === 'hospitals' && 'Hospitais Próximos'}
              {step === 'datetime' && 'Data e Horário'}
              {step === 'summary' && 'Confirmar'}
              {step === 'success' && 'Sucesso!'}
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {step === 'type' && 'Como prefere sua consulta?'}
              {step === 'doctor' && `Consulta ${consultationType === 'online' ? 'online' : 'presencial'}`}
              {step === 'hospitals' && 'Ligue para agendar sua consulta'}
              {step === 'datetime' && selectedDoctor?.name}
              {step === 'summary' && 'Revise os detalhes'}
              {step === 'success' && 'Consulta agendada'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Select Type */}
        {step === 'type' && (
          <div className="space-y-4">
            <button
              onClick={() => handleSelectType('online')}
              className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-6 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Consulta Online</h3>
                  <p className="text-muted-foreground mb-3">
                    Atendimento por videochamada, do conforto da sua casa
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <span>A partir de</span>
                    <PriceDisplay amount={80} />
                  </div>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectType('presencial')}
              className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-6 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Hospital className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">Consulta Presencial</h3>
                  <p className="text-muted-foreground mb-3">
                    Veja os hospitais e clínicas próximos para agendar
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Ver locais disponíveis</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step: Hospitals Map (for presencial) */}
        {step === 'hospitals' && (
          <div className="space-y-4">
            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Como agendar consulta presencial
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Para consultas presenciais, entre em contato diretamente com a clínica ou hospital de sua preferência através do telefone. Você também pode ir presencialmente ao local.
              </p>
            </div>

            {/* Map Section */}
            <div className="bg-card rounded-2xl shadow-md overflow-hidden border border-border">
              <div className="p-4 flex justify-between items-center border-b border-border">
                <h2 className="text-lg font-bold text-foreground">Mapa</h2>
              </div>
              <div className="h-56">
                <MapView />
              </div>
            </div>

            {/* Hospitals List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Lista de Hospitais</h3>
              {mockHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-card border border-border rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <Hospital className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{hospital.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hospital.distance}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{hospital.address}</p>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4" />
                    {hospital.hours}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {hospital.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCallHospital(hospital.phone)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Ligar
                    </button>
                    <button
                      onClick={() => handleGetDirections(hospital.lat, hospital.lng)}
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
        )}

        {/* Step 2: Select Doctor */}
        {step === 'doctor' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar médico ou especialidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none bg-card text-foreground"
              />
            </div>

            {/* Doctor List */}
            <div className="space-y-3">
              {filteredDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => handleSelectDoctor(doctor)}
                  className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-4 transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                      {doctor.avatar ? (
                        <span className="text-3xl">{doctor.avatar}</span>
                      ) : (
                        <User className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground">{doctor.name}</h3>
                        {doctor.availableToday && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            Disponível hoje
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-muted-foreground text-xs">({doctor.reviewCount})</span>
                        </div>
                        <PriceDisplay amount={consultationType === 'presencial' ? doctor.basePrice * 1.2 : doctor.basePrice} size="sm" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date and Time */}
        {step === 'datetime' && selectedDoctor && (
          <div className="space-y-6">
            {/* Doctor info */}
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                {selectedDoctor.avatar ? (
                  <span className="text-2xl">{selectedDoctor.avatar}</span>
                ) : (
                  <User className="w-7 h-7 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground">{selectedDoctor.name}</h3>
                <p className="text-muted-foreground text-sm">{selectedDoctor.specialty}</p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Selecione a Data
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleSelectDate(date)}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${
                      selectedDate === date
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border hover:border-primary'
                    }`}
                  >
                    <span className="text-sm font-medium block">{formatDate(date)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horários Disponíveis
                </h3>
                <SlotGrid
                  slots={slots}
                  selectedSlot={selectedSlot}
                  onSelect={handleSelectSlot}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Summary and Payment */}
        {step === 'summary' && reservation && selectedDoctor && (
          <div className="space-y-6">
            {/* Countdown */}
            <div className="flex items-center justify-center">
              <CountdownTimer
                expiresAt={reservation.expiresAt}
                onExpire={handleReservationExpire}
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
              <h3 className="font-semibold text-foreground">Resumo da Consulta</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                  {selectedDoctor.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedDoctor.name}</h4>
                  <p className="text-muted-foreground text-sm">{selectedDoctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data e Hora</span>
                  <span className="font-medium text-foreground">{formatDateTime(reservation.datetime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium text-foreground flex items-center gap-2">
                    {reservation.type === 'online' ? (
                      <><Video className="w-4 h-4" /> Online</>
                    ) : (
                      <><Hospital className="w-4 h-4" /> Presencial</>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium text-foreground">30 minutos</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <PriceDisplay amount={reservation.price} size="lg" className="text-primary" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
              walletBalance={mockWallet.balance}
              amount={reservation.price}
            />

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={!paymentMethod || isProcessing}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && reservation && selectedDoctor && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Consulta Confirmada!</h2>
            <p className="text-muted-foreground mb-8">
              Sua consulta foi agendada com sucesso.
            </p>

            <div className="bg-card border border-border rounded-2xl p-4 text-left mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                  {selectedDoctor.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedDoctor.name}</h4>
                  <p className="text-muted-foreground text-sm">{selectedDoctor.specialty}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data e Hora</span>
                  <span className="font-medium text-foreground">{formatDateTime(reservation.datetime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium text-foreground flex items-center gap-2">
                    {reservation.type === 'online' ? (
                      <><Video className="w-4 h-4" /> Online</>
                    ) : (
                      <><Hospital className="w-4 h-4" /> Presencial</>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onSuccess(reservation.reservationId)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
