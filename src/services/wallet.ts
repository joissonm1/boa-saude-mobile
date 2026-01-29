// Wallet Service
// Handles all wallet-related API calls

import type { Wallet, Transaction, TopUpRequest, TopUpResponse } from '@/types';
import { mockWallet } from '@/lib/mock-data';

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const walletService = {
  /**
   * Get user's wallet information
   */
  getWallet: async (): Promise<Wallet> => {
    await delay(500);
    // In production: return await api.get('/wallet').then(r => r.data)
    return mockWallet;
  },

  /**
   * Top up wallet balance
   */
  topUp: async (request: TopUpRequest): Promise<TopUpResponse> => {
    await delay(2000);

    // In production:
    // return await api.post('/wallet/topup', request).then(r => r.data)

    const response: TopUpResponse = {
      paymentId: `pay-${Date.now()}`,
      status: 'completed',
    };

    if (request.method === 'reference') {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      response.referenceCode = `REF-${timestamp}-${random}`;
      response.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    return response;
  },

  /**
   * Get transaction history
   */
  getTransactions: async (page = 1, limit = 20): Promise<{
    transactions: Transaction[];
    total: number;
    hasMore: boolean;
  }> => {
    await delay(500);

    const start = (page - 1) * limit;
    const transactions = mockWallet.transactions.slice(start, start + limit);

    return {
      transactions,
      total: mockWallet.transactions.length,
      hasMore: start + limit < mockWallet.transactions.length,
    };
  },

  /**
   * Charge wallet for a payment
   */
  charge: async (
    amount: number,
    description: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; transactionId: string }> => {
    await delay(1000);

    // In production: return await api.post('/wallet/charge', { amount, description, metadata })

    return {
      success: true,
      transactionId: `txn-${Date.now()}`,
    };
  },
};
