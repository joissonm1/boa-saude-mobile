import { ArrowLeft, Plus, History, Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import { mockWallet } from '@/lib/mock-data';
import { PriceDisplay } from './common/PriceDisplay';
import { TopUpModal } from './wallet/TopUpModal';
import { TransactionList } from './wallet/TransactionList';

interface WalletScreenProps {
  onBack: () => void;
  onViewHistory: () => void;
}

const quickTopUpAmounts = [20, 50, 100, 200];

export function WalletScreen({ onBack, onViewHistory }: WalletScreenProps) {
  const [wallet, setWallet] = useState(mockWallet);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleTopUp = (amount: number) => {
    // Simular recarga
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [
        {
          id: `txn-${Date.now()}`,
          type: 'topup',
          amount,
          description: 'Recarga via Referência Bancária',
          date: new Date().toISOString(),
          status: 'completed',
          metadata: { method: 'reference' },
        },
        ...prev.transactions,
      ],
    }));
    setShowTopUpModal(false);
    setSelectedAmount(null);
  };

  const handleQuickTopUp = (amount: number) => {
    setSelectedAmount(amount);
    setShowTopUpModal(true);
  };

  // Calcular totais do mês
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = wallet.transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Carteira</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Gerencie seu saldo</p>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-primary-foreground/80 text-sm">Saldo Disponível</span>
          </div>
          <PriceDisplay
            amount={wallet.balance}
            size="xl"
            className="text-white block mb-4"
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="flex-1 bg-white text-primary py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Recarregar
            </button>
            <button
              onClick={onViewHistory}
              className="flex-1 bg-white/20 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            >
              <History className="w-5 h-5" />
              Extrato
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Monthly Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-muted-foreground">Entradas</span>
            </div>
            <PriceDisplay amount={monthlyIncome} className="text-green-600 dark:text-green-400" />
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </div>

          <div className="bg-card rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm text-muted-foreground">Saídas</span>
            </div>
            <PriceDisplay amount={monthlyExpense} className="text-red-600 dark:text-red-400" />
            <p className="text-xs text-muted-foreground mt-1">Este mês</p>
          </div>
        </div>

        {/* Quick Top Up */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3">Recarga Rápida</h3>
          <div className="grid grid-cols-4 gap-2">
            {quickTopUpAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickTopUp(amount)}
                className="py-3 px-2 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-center"
              >
                <span className="text-sm font-semibold text-foreground">Kz {amount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Transações Recentes</h3>
            <button
              onClick={onViewHistory}
              className="text-primary text-sm font-medium"
            >
              Ver Todas
            </button>
          </div>
          <TransactionList
            transactions={wallet.transactions.slice(0, 5)}
            compact
          />
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <TopUpModal
          onClose={() => {
            setShowTopUpModal(false);
            setSelectedAmount(null);
          }}
          onConfirm={handleTopUp}
          initialAmount={selectedAmount}
        />
      )}
    </div>
  );
}
