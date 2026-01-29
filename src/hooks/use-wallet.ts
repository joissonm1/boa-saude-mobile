import { useState, useCallback } from 'react';
import { mockWallet } from '@/lib/mock-data';
import type { Wallet, Transaction, TopUpResponse } from '@/types';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(mockWallet);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, this would fetch from the API
      // const response = await api.get('/wallet');
      // setWallet(response.data);
    } catch (err) {
      setError('Erro ao carregar carteira');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const topUp = useCallback(async (
    amount: number,
    method: 'card' | 'reference' | 'mercadopago',
    paymentDetails?: any
  ): Promise<TopUpResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create mock response
      const response: TopUpResponse = {
        paymentId: `pay-${Date.now()}`,
        status: 'completed',
      };

      if (method === 'reference') {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        response.referenceCode = `REF-${timestamp}-${random}`;
        response.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }

      // Update wallet balance
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'topup',
        amount,
        description: `Recarga via ${method === 'reference' ? 'Referência Bancária' : method === 'card' ? 'Cartão' : 'MercadoPago'}`,
        date: new Date().toISOString(),
        status: 'completed',
        metadata: { method },
      };

      setWallet((prev) => ({
        ...prev,
        balance: prev.balance + amount,
        transactions: [newTransaction, ...prev.transactions],
      }));

      return response;
    } catch (err) {
      setError('Erro ao processar recarga');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const charge = useCallback(async (
    amount: number,
    description: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; transactionId: string }> => {
    if (wallet.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'payment',
        amount: -amount,
        description,
        date: new Date().toISOString(),
        status: 'completed',
        metadata,
      };

      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTransaction, ...prev.transactions],
      }));

      return { success: true, transactionId: newTransaction.id };
    } catch (err) {
      setError('Erro ao processar pagamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet.balance]);

  const getTransactions = useCallback((page = 1, limit = 20): Transaction[] => {
    const start = (page - 1) * limit;
    return wallet.transactions.slice(start, start + limit);
  }, [wallet.transactions]);

  return {
    wallet,
    isLoading,
    error,
    refetch,
    topUp,
    charge,
    getTransactions,
  };
}
