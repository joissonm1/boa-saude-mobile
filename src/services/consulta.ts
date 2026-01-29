// Consulta (Appointment) Service
// Handles all appointment/booking related API calls

import type { Doctor, Slot, Reservation, Appointment, ReserveSlotRequest } from '@/types';
import { mockDoctors, generateMockSlots, mockAppointments } from '@/lib/mock-data';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const consultaService = {
  /**
   * Get list of doctors
   */
  getDoctors: async (filters?: {
    specialty?: string;
    name?: string;
    availableToday?: boolean;
  }): Promise<Doctor[]> => {
    await delay(500);

    let doctors = mockDoctors;

    if (filters?.specialty) {
      doctors = doctors.filter((d) =>
        d.specialty.toLowerCase().includes(filters.specialty!.toLowerCase())
      );
    }

    if (filters?.name) {
      doctors = doctors.filter((d) =>
        d.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters?.availableToday) {
      doctors = doctors.filter((d) => d.availableToday);
    }

    return doctors;
  },

  /**
   * Get doctor by ID
   */
  getDoctor: async (doctorId: string): Promise<Doctor | null> => {
    await delay(300);
    return mockDoctors.find((d) => d.id === doctorId) || null;
  },

  /**
   * Get doctor availability for a specific date
   */
  getAvailability: async (
    doctorId: string,
    date: string,
    type: 'online' | 'presencial'
  ): Promise<Slot[]> => {
    await delay(800);

    // In production: 
    // return await api.get(`/doctors/${doctorId}/availability`, { params: { date, type } })

    return generateMockSlots(doctorId, date, type);
  },

  /**
   * Reserve a time slot (creates temporary reservation)
   */
  reserveSlot: async (request: ReserveSlotRequest): Promise<Reservation> => {
    await delay(1000);

    const doctor = mockDoctors.find((d) => d.id === request.doctorId);
    if (!doctor) {
      throw new Error('Médico não encontrado');
    }

    const slots = generateMockSlots(
      request.doctorId,
      new Date().toISOString().split('T')[0],
      request.type
    );
    const slot = slots.find((s) => s.slotId === request.slotId);

    // In production: return await api.post('/appointments/reserve', request)

    return {
      reservationId: `res-${Date.now()}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      price: slot?.price || doctor.basePrice,
      slotId: request.slotId,
      doctorId: request.doctorId,
      doctorName: doctor.name,
      datetime: slot?.datetime || new Date().toISOString(),
      type: request.type,
    };
  },

  /**
   * Confirm appointment after payment
   */
  confirmAppointment: async (
    reservationId: string,
    paymentId: string
  ): Promise<Appointment> => {
    await delay(1500);

    // In production:
    // return await api.post('/appointments/confirm', { reservationId, paymentId })

    return {
      id: `apt-${Date.now()}`,
      doctorId: 'doc-1',
      doctorName: 'Dr. João Silva',
      doctorSpecialty: 'Cardiologia',
      patientId: 'current-user',
      datetime: new Date().toISOString(),
      type: 'online',
      status: 'scheduled',
      price: 150,
      paymentId,
      videoCallLink: `https://meet.boasaude.com/${reservationId}`,
    };
  },

  /**
   * Cancel a reservation
   */
  cancelReservation: async (reservationId: string): Promise<void> => {
    await delay(500);
    // In production: await api.delete(`/appointments/reserve/${reservationId}`)
  },

  /**
   * Get user's appointments
   */
  getAppointments: async (filters?: {
    status?: 'scheduled' | 'completed' | 'cancelled';
    upcoming?: boolean;
  }): Promise<Appointment[]> => {
    await delay(500);

    let appointments = mockAppointments;

    if (filters?.status) {
      appointments = appointments.filter((a) => a.status === filters.status);
    }

    if (filters?.upcoming) {
      const now = new Date();
      appointments = appointments.filter((a) => new Date(a.datetime) > now);
    }

    return appointments;
  },

  /**
   * Cancel an appointment
   */
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    await delay(1000);
    // In production: await api.post(`/appointments/${appointmentId}/cancel`)
  },
};
