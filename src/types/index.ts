// ==========================================
// TIPOS BASE
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

// ==========================================
// CARTEIRA DIGITAL
// ==========================================

export interface Wallet {
  balance: number;
  currency: string;
  userId: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  metadata?: {
    appointmentId?: string;
    doctorName?: string;
    method?: string;
    prescriptionId?: string;
  };
}

export interface TopUpRequest {
  amount: number;
  method: 'card' | 'reference' | 'mercadopago';
  paymentDetails?: any;
}

export interface TopUpResponse {
  paymentId: string;
  status: string;
  referenceCode?: string;
  expiresAt?: string;
}

// ==========================================
// AGENDAMENTO / CONSULTAS
// ==========================================

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  crm: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  basePrice: number;
  availableToday: boolean;
  bio?: string;
}

export interface Slot {
  slotId: string;
  datetime: string;
  type: 'online' | 'presencial';
  status: 'available' | 'booked' | 'reserved';
  price: number;
  clinicId?: string;
  clinicName?: string;
}

export interface Reservation {
  reservationId: string;
  expiresAt: string;
  price: number;
  slotId: string;
  doctorId: string;
  doctorName: string;
  datetime: string;
  type: 'online' | 'presencial';
}

export interface ReserveSlotRequest {
  doctorId: string;
  slotId: string;
  patientId: string;
  type: 'online' | 'presencial';
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientId: string;
  datetime: string;
  type: 'online' | 'presencial';
  status: 'scheduled' | 'completed' | 'cancelled';
  price: number;
  paymentId: string;
  clinicId?: string;
  clinicName?: string;
  videoCallLink?: string;
}

// ==========================================
// RECEITAS E DISPENSAÇÃO
// ==========================================

export interface Prescription {
  id: string;
  number: string;
  doctorId: string;
  doctorName: string;
  doctorCRM: string;
  patientId: string;
  issuedAt: string;
  expiresAt: string;
  status: 'pending' | 'dispensed' | 'partial' | 'expired';
  medications: Medication[];
  observations?: string;
  pharmacyId?: string;
  pharmacyName?: string;
  estimatedPrice?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  unit: string;
  instructions: string;
  duration: string;
  dispensed: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  lat: number;
  lng: number;
  phone: string;
  openNow: boolean;
  preparationTime: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
}

export interface PharmacyQuote {
  pharmacyId: string;
  pharmacyName: string;
  items: {
    medicationId: string;
    medicationName: string;
    price: number;
    available: boolean;
  }[];
  dispensationFee: number;
  total: number;
  preparationTime: string;
}

export interface DispensationRequest {
  prescriptionId: string;
  pharmacyId: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  paymentMethod: 'wallet' | 'card';
  paymentDetails?: any;
}

export interface DispensationOrder {
  id: string;
  prescriptionId: string;
  pharmacyId: string;
  pharmacyName: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryMethod: 'pickup' | 'delivery';
  total: number;
  createdAt: string;
  estimatedReadyAt?: string;
  qrCode?: string;
}

// ==========================================
// PAGAMENTOS
// ==========================================

export interface PaymentMethod {
  id: string;
  type: 'wallet' | 'card';
  label: string;
  icon: string;
  details?: {
    last4?: string;
    brand?: string;
  };
}

export interface PaymentRequest {
  amount: number;
  method: 'wallet' | 'card';
  description: string;
  metadata?: {
    appointmentId?: string;
    prescriptionId?: string;
    dispensationId?: string;
  };
}

export interface PaymentResult {
  paymentId: string;
  status: 'success' | 'pending' | 'failed';
  transactionId?: string;
  referenceCode?: string;
  expiresAt?: string;
}

// ==========================================
// CLÍNICAS / HOSPITAIS
// ==========================================

export interface Clinic {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  distance?: number;
}

// ==========================================
// ONBOARDING
// ==========================================

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ==========================================
// APP STATE
// ==========================================

export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'home'
  | 'wallet'
  | 'wallet-history'
  | 'booking'
  | 'booking-doctor'
  | 'booking-datetime'
  | 'booking-summary'
  | 'booking-success'
  | 'prescriptions'
  | 'prescription-detail'
  | 'dispensation'
  | 'profile';

export type AppointmentType = 'virtual' | 'physical' | null;

export interface BookingState {
  type: 'online' | 'presencial' | null;
  doctor: Doctor | null;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  reservation: Reservation | null;
}
