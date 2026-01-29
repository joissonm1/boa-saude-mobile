import { ArrowLeft, Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { mockWallet } from '@/lib/mock-data';
import { TransactionList } from './wallet/TransactionList';
import type { Transaction } from '@/types';

interface WalletHistoryProps {
  onBack: () => void;
}

type FilterType = 'all' | 'topup' | 'payment' | 'refund';

export function WalletHistory({ onBack }: WalletHistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTransactions = (transactions: Transaction[]): Transaction[] => {
    let filtered = transactions;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter((t) => t.type === filter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.metadata?.doctorName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions(mockWallet.transactions);

  // Group by month
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(transaction);
    
    return groups;
  }, {} as Record<string, Transaction[]>);

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'topup', label: 'Recargas' },
    { value: 'payment', label: 'Pagamentos' },
    { value: 'refund', label: 'Reembolsos' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Extrato</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Histórico de transações</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar transação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Transactions grouped by month */}
        {Object.entries(groupedTransactions).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([monthYear, transactions]) => (
            <div key={monthYear} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground capitalize">{monthYear}</h3>
              </div>
              <div className="p-4">
                <TransactionList transactions={transactions} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
