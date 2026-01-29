// Payment Service
// Handles all payment-related API calls

import type { PaymentRequest, PaymentResult } from '@/types';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentService = {
  /**
   * Process a payment
   */
  processPayment: async (request: PaymentRequest): Promise<PaymentResult> => {
    await delay(2000);

    // In production:
    // return await api.post('/payments/charge', request)

    const result: PaymentResult = {
      paymentId: `pay-${Date.now()}`,
      status: 'success',
      transactionId: `txn-${Date.now()}`,
    };

    return result;
  },

  /**
   * Check payment status (for PIX and async payments)
   */
  checkPaymentStatus: async (paymentId: string): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'expired';
    completedAt?: string;
  }> => {
    await delay(500);

    // In production:
    // return await api.get(`/payments/${paymentId}/status`)

    // Mock - always return completed for demo
    return {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
  },

  /**
   * Request a refund
   */
  requestRefund: async (
    paymentId: string,
    reason: string
  ): Promise<{
    refundId: string;
    status: string;
    estimatedDate: string;
  }> => {
    await delay(1000);

    // In production:
    // return await api.post(`/payments/${paymentId}/refund`, { reason })

    return {
      refundId: `ref-${Date.now()}`,
      status: 'processing',
      estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
  },

  /**
   * Get payment methods for user
   */
  getPaymentMethods: async (): Promise<{
    id: string;
    type: 'card' | 'pix' | 'wallet';
    label: string;
    details?: { last4?: string; brand?: string };
  }[]> => {
    await delay(300);

    // In production:
    // return await api.get('/payments/methods')

    return [
      {
        id: 'wallet',
        type: 'wallet',
        label: 'Carteira Boa Saúde',
      },
      {
        id: 'pix',
        type: 'pix',
        label: 'PIX',
      },
      {
        id: 'card-1',
        type: 'card',
        label: 'Cartão •••• 4242',
        details: { last4: '4242', brand: 'visa' },
      },
    ];
  },

  /**
   * Add a new card
   */
  addCard: async (cardDetails: {
    number: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    name: string;
  }): Promise<{ id: string; last4: string; brand: string }> => {
    await delay(1500);

    // In production, this would integrate with Stripe/payment processor
    // return await api.post('/payments/cards', cardDetails)

    return {
      id: `card-${Date.now()}`,
      last4: cardDetails.number.slice(-4),
      brand: 'visa',
    };
  },

  /**
   * Remove a saved card
   */
  removeCard: async (cardId: string): Promise<void> => {
    await delay(500);
    // In production: await api.delete(`/payments/cards/${cardId}`)
  },
};
