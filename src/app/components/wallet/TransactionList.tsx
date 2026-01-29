import type { Transaction } from '@/types';
import { PriceDisplay } from '../common/PriceDisplay';
import { CreditCard, Plus, RotateCcw, Pill, Stethoscope } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  compact?: boolean;
}

export function TransactionList({ transactions, compact = false }: TransactionListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const getIcon = (transaction: Transaction) => {
    if (transaction.type === 'topup') {
      return <Plus className="w-4 h-4" />;
    }
    if (transaction.type === 'refund') {
      return <RotateCcw className="w-4 h-4" />;
    }
    if (transaction.metadata?.prescriptionId) {
      return <Pill className="w-4 h-4" />;
    }
    if (transaction.metadata?.appointmentId) {
      return <Stethoscope className="w-4 h-4" />;
    }
    return <CreditCard className="w-4 h-4" />;
  };

  const getIconBg = (transaction: Transaction) => {
    if (transaction.type === 'topup' || transaction.type === 'refund') {
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className={`space-y-${compact ? '2' : '3'}`}>
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`flex items-center gap-3 ${compact ? 'py-2' : 'p-3 bg-muted/20 rounded-xl'}`}
        >
          {/* Icon */}
          <div className={`p-2 rounded-xl ${getIconBg(transaction)}`}>
            {getIcon(transaction)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {transaction.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(transaction.date)}
            </p>
          </div>

          {/* Amount */}
          <PriceDisplay
            amount={transaction.amount}
            showSign
            size={compact ? 'sm' : 'md'}
          />
        </div>
      ))}
    </div>
  );
}
