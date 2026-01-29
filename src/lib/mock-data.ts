import type {
  Wallet,
  Transaction,
  Doctor,
  Slot,
  Prescription,
  Pharmacy,
  PharmacyQuote,
  Appointment,
  OnboardingStep,
  Clinic,
} from '@/types';

// ==========================================
// ONBOARDING STEPS
// ==========================================

export const mockOnboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Bem-vindo ao Boa Saúde',
    description: 'Sua saúde na palma da mão. Cuide de você e da sua família de forma simples e prática.',
    icon: 'Heart',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 2,
    title: 'Agende Consultas',
    description: 'Consultas online ou presenciais com os melhores médicos. Escolha o horário que melhor se encaixa na sua rotina.',
    icon: 'Calendar',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    title: 'Carteira Digital',
    description: 'Pague suas consultas e medicamentos de forma segura e rápida. Acompanhe todos os seus gastos.',
    icon: 'Wallet',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 4,
    title: 'Receitas e Medicamentos',
    description: 'Acesse suas prescrições a qualquer momento. Solicite dispensação nas farmácias parceiras.',
    icon: 'Pill',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 5,
    title: 'Locais Próximos',
    description: 'Encontre hospitais, clínicas e farmácias perto de você com facilidade.',
    icon: 'MapPin',
    color: 'from-cyan-500 to-blue-600',
  },
];

// ==========================================
// WALLET / CARTEIRA
// ==========================================

export const mockWallet: Wallet = {
  balance: 250.0,
  currency: 'BRL',
  userId: 'mock-user-123',
  transactions: [
    {
      id: 'txn-1',
      type: 'payment',
      amount: -150.0,
      description: 'Consulta - Dr. João Silva',
      date: '2026-01-28T10:00:00Z',
      status: 'completed',
      metadata: {
        appointmentId: 'apt-123',
        doctorName: 'Dr. João Silva',
      },
    },
    {
      id: 'txn-2',
      type: 'topup',
      amount: 200.0,
      description: 'Recarga via Referência Bancária',
      date: '2026-01-25T15:30:00Z',
      status: 'completed',
      metadata: {
        method: 'reference',
      },
    },
    {
      id: 'txn-3',
      type: 'payment',
      amount: -45.0,
      description: 'Medicamentos - Farmácia Popular',
      date: '2026-01-22T09:15:00Z',
      status: 'completed',
      metadata: {
        prescriptionId: 'presc-1',
      },
    },
    {
      id: 'txn-4',
      type: 'topup',
      amount: 100.0,
      description: 'Recarga via Cartão',
      date: '2026-01-20T14:00:00Z',
      status: 'completed',
      metadata: {
        method: 'card',
      },
    },
    {
      id: 'txn-5',
      type: 'refund',
      amount: 80.0,
      description: 'Reembolso - Consulta cancelada',
      date: '2026-01-18T11:30:00Z',
      status: 'completed',
      metadata: {
        appointmentId: 'apt-120',
      },
    },
  ],
};

// ==========================================
// DOCTORS / MÉDICOS
// ==========================================

export const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologia',
    crm: '12345-SP',
    avatar: '',
    rating: 4.9,
    reviewCount: 234,
    basePrice: 150.0,
    availableToday: true,
    bio: 'Especialista em cardiologia com mais de 15 anos de experiência.',
  },
  {
    id: 'doc-2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologia',
    crm: '23456-SP',
    avatar: '',
    rating: 4.8,
    reviewCount: 189,
    basePrice: 180.0,
    availableToday: true,
    bio: 'Dermatologista especializada em tratamentos estéticos e clínicos.',
  },
  {
    id: 'doc-3',
    name: 'Dr. Pedro Costa',
    specialty: 'Ortopedia',
    crm: '34567-SP',
    avatar: '',
    rating: 4.7,
    reviewCount: 156,
    basePrice: 200.0,
    availableToday: false,
    bio: 'Ortopedista com foco em lesões esportivas e reabilitação.',
  },
  {
    id: 'doc-4',
    name: 'Dra. Ana Oliveira',
    specialty: 'Pediatria',
    crm: '45678-SP',
    avatar: '',
    rating: 4.9,
    reviewCount: 312,
    basePrice: 120.0,
    availableToday: true,
    bio: 'Pediatra dedicada ao cuidado integral da saúde infantil.',
  },
  {
    id: 'doc-5',
    name: 'Dr. Carlos Mendes',
    specialty: 'Clínico Geral',
    crm: '56789-SP',
    avatar: '',
    rating: 4.6,
    reviewCount: 278,
    basePrice: 100.0,
    availableToday: true,
    bio: 'Clínico geral com abordagem humanizada e preventiva.',
  },
];

// ==========================================
// SLOTS / HORÁRIOS
// ==========================================

export const generateMockSlots = (doctorId: string, date: string, type: 'online' | 'presencial'): Slot[] => {
  const basePrice = mockDoctors.find((d) => d.id === doctorId)?.basePrice || 150;
  const times = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return times.map((time, index) => {
    // Simular alguns slots ocupados aleatoriamente
    const random = Math.random();
    let status: 'available' | 'booked' | 'reserved' = 'available';
    if (random < 0.2) status = 'booked';
    else if (random < 0.3) status = 'reserved';

    return {
      slotId: `slot-${doctorId}-${date}-${time}`,
      datetime: `${date}T${time}:00Z`,
      type,
      status,
      price: type === 'presencial' ? basePrice * 1.2 : basePrice,
      clinicId: type === 'presencial' ? 'clinic-1' : undefined,
      clinicName: type === 'presencial' ? 'Hospital Central' : undefined,
    };
  });
};

export const mockSlots: Slot[] = [
  {
    slotId: 'slot-1',
    datetime: '2026-02-10T09:00:00Z',
    type: 'online',
    status: 'available',
    price: 150.0,
  },
  {
    slotId: 'slot-2',
    datetime: '2026-02-10T10:00:00Z',
    type: 'online',
    status: 'available',
    price: 150.0,
  },
  {
    slotId: 'slot-3',
    datetime: '2026-02-10T11:00:00Z',
    type: 'online',
    status: 'booked',
    price: 150.0,
  },
  {
    slotId: 'slot-4',
    datetime: '2026-02-10T14:00:00Z',
    type: 'online',
    status: 'available',
    price: 150.0,
  },
  {
    slotId: 'slot-5',
    datetime: '2026-02-10T15:00:00Z',
    type: 'online',
    status: 'reserved',
    price: 150.0,
  },
  {
    slotId: 'slot-6',
    datetime: '2026-02-10T16:00:00Z',
    type: 'online',
    status: 'available',
    price: 150.0,
  },
];

// ==========================================
// PRESCRIPTIONS / RECEITAS
// ==========================================

export const mockPrescriptions: Prescription[] = [
  {
    id: 'presc-1',
    number: '1234',
    doctorId: 'doc-1',
    doctorName: 'Dr. João Silva',
    doctorCRM: '12345-SP',
    patientId: 'pat-1',
    issuedAt: '2026-01-28T10:00:00Z',
    expiresAt: '2026-02-28T23:59:59Z',
    status: 'pending',
    medications: [
      {
        id: 'med-1',
        name: 'Paracetamol',
        dosage: '500mg',
        quantity: 21,
        unit: 'comprimidos',
        instructions: '1 comprimido a cada 8h',
        duration: '7 dias',
        dispensed: false,
      },
      {
        id: 'med-2',
        name: 'Ibuprofeno',
        dosage: '400mg',
        quantity: 15,
        unit: 'comprimidos',
        instructions: '1 comprimido a cada 8h',
        duration: '5 dias',
        dispensed: false,
      },
    ],
    observations: 'Tomar após refeições. Evitar álcool durante o tratamento.',
    estimatedPrice: 45.0,
  },
  {
    id: 'presc-2',
    number: '1235',
    doctorId: 'doc-2',
    doctorName: 'Dra. Maria Santos',
    doctorCRM: '23456-SP',
    patientId: 'pat-1',
    issuedAt: '2026-01-20T14:30:00Z',
    expiresAt: '2026-02-20T23:59:59Z',
    status: 'dispensed',
    medications: [
      {
        id: 'med-3',
        name: 'Cetoconazol Creme',
        dosage: '20mg/g',
        quantity: 1,
        unit: 'bisnaga 30g',
        instructions: 'Aplicar 2x ao dia na região afetada',
        duration: '14 dias',
        dispensed: true,
      },
    ],
    observations: 'Manter a região limpa e seca.',
    pharmacyId: 'pharm-1',
    pharmacyName: 'Farmácia Popular',
    estimatedPrice: 28.0,
  },
  {
    id: 'presc-3',
    number: '1236',
    doctorId: 'doc-3',
    doctorName: 'Dr. Pedro Costa',
    doctorCRM: '34567-SP',
    patientId: 'pat-1',
    issuedAt: '2026-01-15T09:00:00Z',
    expiresAt: '2026-02-15T23:59:59Z',
    status: 'partial',
    medications: [
      {
        id: 'med-4',
        name: 'Dipirona',
        dosage: '500mg',
        quantity: 20,
        unit: 'comprimidos',
        instructions: '1 comprimido a cada 6h se dor',
        duration: '5 dias',
        dispensed: true,
      },
      {
        id: 'med-5',
        name: 'Relaxante Muscular',
        dosage: '10mg',
        quantity: 10,
        unit: 'comprimidos',
        instructions: '1 comprimido à noite',
        duration: '10 dias',
        dispensed: false,
      },
    ],
    observations: 'Repouso recomendado. Aplicar gelo nas primeiras 48h.',
    estimatedPrice: 65.0,
  },
  {
    id: 'presc-4',
    number: '1230',
    doctorId: 'doc-1',
    doctorName: 'Dr. João Silva',
    doctorCRM: '12345-SP',
    patientId: 'pat-1',
    issuedAt: '2025-12-01T10:00:00Z',
    expiresAt: '2026-01-01T23:59:59Z',
    status: 'expired',
    medications: [
      {
        id: 'med-6',
        name: 'Losartana',
        dosage: '50mg',
        quantity: 30,
        unit: 'comprimidos',
        instructions: '1 comprimido pela manhã',
        duration: '30 dias',
        dispensed: false,
      },
    ],
    observations: 'Controle de pressão arterial.',
    estimatedPrice: 35.0,
  },
];

// ==========================================
// PHARMACIES / FARMÁCIAS
// ==========================================

export const mockPharmacies: Pharmacy[] = [
  {
    id: 'pharm-1',
    name: 'Farmácia Popular',
    address: 'Av. Principal, 123 - Centro',
    distance: 0.8,
    lat: -23.5505,
    lng: -46.6333,
    phone: '(11) 3456-7890',
    openNow: true,
    preparationTime: '15 min',
    deliveryAvailable: true,
    deliveryFee: 8.0,
  },
  {
    id: 'pharm-2',
    name: 'Drogaria Saúde+',
    address: 'Rua das Flores, 456 - Jardim',
    distance: 1.2,
    lat: -23.5515,
    lng: -46.6343,
    phone: '(11) 3456-7891',
    openNow: true,
    preparationTime: '20 min',
    deliveryAvailable: true,
    deliveryFee: 10.0,
  },
  {
    id: 'pharm-3',
    name: 'Farmácia 24h',
    address: 'Av. Secundária, 789 - Vila Nova',
    distance: 2.5,
    lat: -23.5525,
    lng: -46.6353,
    phone: '(11) 3456-7892',
    openNow: true,
    preparationTime: '10 min',
    deliveryAvailable: false,
    deliveryFee: 0,
  },
];

// ==========================================
// PHARMACY QUOTES / ORÇAMENTOS
// ==========================================

export const generateMockQuote = (prescriptionId: string, pharmacyId: string): PharmacyQuote => {
  const prescription = mockPrescriptions.find((p) => p.id === prescriptionId);
  const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);

  if (!prescription || !pharmacy) {
    throw new Error('Prescription or pharmacy not found');
  }

  const items = prescription.medications.map((med) => ({
    medicationId: med.id,
    medicationName: `${med.name} ${med.dosage}`,
    price: Math.random() * 30 + 10, // Preço aleatório entre 10 e 40
    available: Math.random() > 0.1, // 90% de chance de estar disponível
  }));

  const subtotal = items.reduce((acc, item) => acc + (item.available ? item.price : 0), 0);
  const dispensationFee = 5.0;

  return {
    pharmacyId,
    pharmacyName: pharmacy.name,
    items,
    dispensationFee,
    total: subtotal + dispensationFee,
    preparationTime: pharmacy.preparationTime,
  };
};

// ==========================================
// APPOINTMENTS / CONSULTAS AGENDADAS
// ==========================================

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. João Silva',
    doctorSpecialty: 'Cardiologia',
    patientId: 'pat-1',
    datetime: '2026-01-29T14:00:00Z',
    type: 'online',
    status: 'scheduled',
    price: 150.0,
    paymentId: 'pay-1',
    videoCallLink: 'https://meet.boasaude.com/apt-1',
  },
  {
    id: 'apt-2',
    doctorId: 'doc-2',
    doctorName: 'Dra. Maria Santos',
    doctorSpecialty: 'Dermatologia',
    patientId: 'pat-1',
    datetime: '2026-02-02T10:30:00Z',
    type: 'presencial',
    status: 'scheduled',
    price: 216.0,
    paymentId: 'pay-2',
    clinicId: 'clinic-1',
    clinicName: 'Hospital Central',
  },
];

// ==========================================
// CLINICS / CLÍNICAS
// ==========================================

export const mockClinics: Clinic[] = [
  {
    id: 'clinic-1',
    name: 'Hospital Central',
    address: 'Av. Principal, 123 - Centro',
    lat: -23.5505,
    lng: -46.6333,
    phone: '(11) 3456-7890',
    distance: 2.5,
  },
  {
    id: 'clinic-2',
    name: 'Clínica Boa Vida',
    address: 'Rua das Flores, 456 - Jardim',
    lat: -23.5515,
    lng: -46.6343,
    phone: '(11) 3456-7891',
    distance: 3.8,
  },
  {
    id: 'clinic-3',
    name: 'Hospital Geral',
    address: 'Av. Secundária, 789 - Vila Nova',
    lat: -23.5525,
    lng: -46.6353,
    phone: '(11) 3456-7892',
    distance: 1.2,
  },
];

// ==========================================
// REFERENCE CODE GENERATOR
// ==========================================

export const generateMockReferenceCode = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `REF-${timestamp}-${random}`;
};
