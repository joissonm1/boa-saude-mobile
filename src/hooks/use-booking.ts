import { useState, useCallback } from 'react';
import { mockDoctors, generateMockSlots } from '@/lib/mock-data';
import type { Doctor, Slot, Reservation, Appointment, BookingState } from '@/types';

export function useBooking() {
  const [bookingState, setBookingState] = useState<BookingState>({
    type: null,
    doctor: null,
    selectedDate: null,
    selectedSlot: null,
    reservation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDoctors = useCallback(async (specialty?: string): Promise<Doctor[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let doctors = mockDoctors;
      if (specialty) {
        doctors = doctors.filter((d) => 
          d.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
      }
      
      return doctors;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAvailability = useCallback(async (
    doctorId: string,
    date: string,
    type: 'online' | 'presencial'
  ): Promise<Slot[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return generateMockSlots(doctorId, date, type);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reserveSlot = useCallback(async (
    doctorId: string,
    slotId: string,
    patientId: string,
    type: 'online' | 'presencial'
  ): Promise<Reservation> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const doctor = mockDoctors.find((d) => d.id === doctorId);
      if (!doctor) {
        throw new Error('Médico não encontrado');
      }

      const slot = generateMockSlots(doctorId, new Date().toISOString().split('T')[0], type)
        .find((s) => s.slotId === slotId);

      const reservation: Reservation = {
        reservationId: `res-${Date.now()}`,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        price: slot?.price || doctor.basePrice,
        slotId,
        doctorId,
        doctorName: doctor.name,
        datetime: slot?.datetime || new Date().toISOString(),
        type,
      };

      setBookingState((prev) => ({
        ...prev,
        reservation,
      }));

      // Store in session for recovery
      sessionStorage.setItem('currentBooking', JSON.stringify({
        ...bookingState,
        reservation,
      }));

      return reservation;
    } catch (err) {
      setError('Erro ao reservar horário');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [bookingState]);

  const confirmAppointment = useCallback(async (
    reservationId: string,
    paymentId: string
  ): Promise<Appointment> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const reservation = bookingState.reservation;
      if (!reservation || reservation.reservationId !== reservationId) {
        throw new Error('Reserva não encontrada ou expirada');
      }

      const appointment: Appointment = {
        id: `apt-${Date.now()}`,
        doctorId: reservation.doctorId,
        doctorName: reservation.doctorName,
        doctorSpecialty: mockDoctors.find((d) => d.id === reservation.doctorId)?.specialty || '',
        patientId: 'current-user',
        datetime: reservation.datetime,
        type: reservation.type,
        status: 'scheduled',
        price: reservation.price,
        paymentId,
        videoCallLink: reservation.type === 'online' ? `https://meet.boasaude.com/${reservationId}` : undefined,
      };

      // Clear booking state
      setBookingState({
        type: null,
        doctor: null,
        selectedDate: null,
        selectedSlot: null,
        reservation: null,
      });
      sessionStorage.removeItem('currentBooking');

      return appointment;
    } catch (err) {
      setError('Erro ao confirmar agendamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [bookingState.reservation]);

  const cancelReservation = useCallback(async (reservationId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBookingState((prev) => ({
        ...prev,
        reservation: null,
        selectedSlot: null,
      }));
      sessionStorage.removeItem('currentBooking');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateBookingState = useCallback((updates: Partial<BookingState>) => {
    setBookingState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingState({
      type: null,
      doctor: null,
      selectedDate: null,
      selectedSlot: null,
      reservation: null,
    });
    sessionStorage.removeItem('currentBooking');
  }, []);

  // Recover booking from session
  const recoverBooking = useCallback(() => {
    const saved = sessionStorage.getItem('currentBooking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if reservation is still valid
        if (parsed.reservation) {
          const expiresAt = new Date(parsed.reservation.expiresAt).getTime();
          if (expiresAt > Date.now()) {
            setBookingState(parsed);
            return true;
          }
        }
      } catch (e) {
        console.error('Error recovering booking:', e);
      }
    }
    return false;
  }, []);

  return {
    bookingState,
    isLoading,
    error,
    getDoctors,
    getAvailability,
    reserveSlot,
    confirmAppointment,
    cancelReservation,
    updateBookingState,
    resetBooking,
    recoverBooking,
  };
}
