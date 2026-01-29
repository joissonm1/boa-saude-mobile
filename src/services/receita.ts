// Receita (Prescription) Service
// Handles all prescription-related API calls

import type { Prescription, Pharmacy, PharmacyQuote, DispensationRequest, DispensationOrder } from '@/types';
import { mockPrescriptions, mockPharmacies, generateMockQuote } from '@/lib/mock-data';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface PrescriptionFilters {
  status?: 'pending' | 'dispensed' | 'partial' | 'expired';
  search?: string;
  page?: number;
  limit?: number;
}

export const receitaService = {
  /**
   * Get user's prescriptions
   */
  getPrescriptions: async (filters?: PrescriptionFilters): Promise<{
    prescriptions: Prescription[];
    total: number;
    hasMore: boolean;
  }> => {
    await delay(500);

    let result = mockPrescriptions;

    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter((p) =>
        p.doctorName.toLowerCase().includes(search) ||
        p.number.includes(search) ||
        p.medications.some((m) => m.name.toLowerCase().includes(search))
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const start = (page - 1) * limit;
    const paged = result.slice(start, start + limit);

    return {
      prescriptions: paged,
      total: result.length,
      hasMore: start + limit < result.length,
    };
  },

  /**
   * Get prescription detail by ID
   */
  getPrescriptionDetail: async (id: string): Promise<Prescription | null> => {
    await delay(300);
    return mockPrescriptions.find((p) => p.id === id) || null;
  },

  /**
   * Get nearby pharmacies that can fulfill a prescription
   */
  getNearbyPharmacies: async (
    lat: number,
    lng: number,
    prescriptionId: string
  ): Promise<Pharmacy[]> => {
    await delay(800);

    // In production:
    // return await api.get('/pharmacies/nearby', { params: { lat, lng, prescriptionId } })

    // Sort by distance
    return [...mockPharmacies].sort((a, b) => a.distance - b.distance);
  },

  /**
   * Get price quote from a pharmacy for a prescription
   */
  getPharmacyQuote: async (
    prescriptionId: string,
    pharmacyId: string
  ): Promise<PharmacyQuote> => {
    await delay(1000);

    // In production:
    // return await api.post('/prescriptions/quote', { prescriptionId, pharmacyId })

    return generateMockQuote(prescriptionId, pharmacyId);
  },

  /**
   * Request dispensation of prescription medications
   */
  requestDispensation: async (request: DispensationRequest): Promise<DispensationOrder> => {
    await delay(2000);

    const pharmacy = mockPharmacies.find((p) => p.id === request.pharmacyId);
    const quote = generateMockQuote(request.prescriptionId, request.pharmacyId);

    // In production:
    // return await api.post('/prescriptions/dispense', request)

    return {
      id: `disp-${Date.now()}`,
      prescriptionId: request.prescriptionId,
      pharmacyId: request.pharmacyId,
      pharmacyName: pharmacy?.name || 'Farmácia',
      status: 'pending',
      deliveryMethod: request.deliveryMethod,
      total: quote.total + (request.deliveryMethod === 'delivery' ? (pharmacy?.deliveryFee || 0) : 0),
      createdAt: new Date().toISOString(),
      estimatedReadyAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      qrCode: request.deliveryMethod === 'pickup' ? `QR-${Date.now()}` : undefined,
    };
  },

  /**
   * Download prescription as PDF
   */
  downloadPDF: async (prescriptionId: string): Promise<Blob> => {
    await delay(1000);

    // In production:
    // const response = await api.get(`/prescriptions/${prescriptionId}/pdf`, { responseType: 'blob' })
    // return response.data

    // Mock PDF blob
    return new Blob(['Mock PDF content for prescription ' + prescriptionId], {
      type: 'application/pdf',
    });
  },

  /**
   * Get dispensation order status
   */
  getDispensationStatus: async (orderId: string): Promise<DispensationOrder | null> => {
    await delay(300);

    // In production:
    // return await api.get(`/dispensations/${orderId}`)

    // Mock - return null for now
    return null;
  },
};
