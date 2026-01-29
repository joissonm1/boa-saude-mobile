import { useState, useCallback } from 'react';
import { mockPrescriptions, mockPharmacies, generateMockQuote } from '@/lib/mock-data';
import type { Prescription, Pharmacy, PharmacyQuote, DispensationOrder } from '@/types';

interface PrescriptionFilters {
  status?: 'pending' | 'dispensed' | 'partial' | 'expired';
  search?: string;
}

export function useReceitas() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrescriptions = useCallback(async (filters?: PrescriptionFilters): Promise<Prescription[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      let result = prescriptions;

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

      return result;
    } catch (err) {
      setError('Erro ao carregar receitas');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [prescriptions]);

  const getPrescriptionDetail = useCallback(async (id: string): Promise<Prescription | null> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return prescriptions.find((p) => p.id === id) || null;
    } finally {
      setIsLoading(false);
    }
  }, [prescriptions]);

  const getNearbyPharmacies = useCallback(async (
    lat: number,
    lng: number,
    prescriptionId: string
  ): Promise<Pharmacy[]> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Sort by distance
      return [...mockPharmacies].sort((a, b) => a.distance - b.distance);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPharmacyQuote = useCallback(async (
    prescriptionId: string,
    pharmacyId: string
  ): Promise<PharmacyQuote> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return generateMockQuote(prescriptionId, pharmacyId);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestDispensation = useCallback(async (
    prescriptionId: string,
    pharmacyId: string,
    deliveryMethod: 'pickup' | 'delivery',
    paymentMethod: 'wallet' | 'card' | 'pix',
    deliveryAddress?: string
  ): Promise<DispensationOrder> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pharmacy = mockPharmacies.find((p) => p.id === pharmacyId);
      const quote = generateMockQuote(prescriptionId, pharmacyId);

      const order: DispensationOrder = {
        id: `disp-${Date.now()}`,
        prescriptionId,
        pharmacyId,
        pharmacyName: pharmacy?.name || 'Farmácia',
        status: 'pending',
        deliveryMethod,
        total: quote.total + (deliveryMethod === 'delivery' ? (pharmacy?.deliveryFee || 0) : 0),
        createdAt: new Date().toISOString(),
        estimatedReadyAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        qrCode: deliveryMethod === 'pickup' ? `QR-${Date.now()}` : undefined,
      };

      // Update prescription status
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === prescriptionId
            ? {
                ...p,
                status: 'dispensed',
                pharmacyId,
                pharmacyName: pharmacy?.name,
              }
            : p
        )
      );

      return order;
    } catch (err) {
      setError('Erro ao solicitar dispensação');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadPDF = useCallback(async (prescriptionId: string): Promise<Blob> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, this would return a PDF blob
      // For now, return a mock blob
      return new Blob(['Mock PDF content'], { type: 'application/pdf' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, this would fetch fresh data
      setPrescriptions(mockPrescriptions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    prescriptions,
    isLoading,
    error,
    getPrescriptions,
    getPrescriptionDetail,
    getNearbyPharmacies,
    getPharmacyQuote,
    requestDispensation,
    downloadPDF,
    refetch,
  };
}
