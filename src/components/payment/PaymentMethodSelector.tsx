import { Wallet, CreditCard, Smartphone } from 'lucide-react';

type PaymentMethodType = 'wallet' | 'card' | 'pix';

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType | null;
  onChange: (method: PaymentMethodType) => void;
  walletBalance?: number;
  amount?: number;
  disabled?: boolean;
}

const paymentMethods: { type: PaymentMethodType; label: string; description: string }[] = [
  {
    type: 'wallet',
    label: 'Carteira',
    description: 'Pague com saldo disponível',
  },
  {
    type: 'card',
    label: 'Cartão de Crédito',
    description: 'Visa, Mastercard, Elo',
  },
  {
    type: 'pix',
    label: 'PIX',
    description: 'Pagamento instantâneo',
  },
];

export function PaymentMethodSelector({
  selected,
  onChange,
  walletBalance = 0,
  amount = 0,
  disabled = false,
}: PaymentMethodSelectorProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      case 'card':
        return <CreditCard className="w-6 h-6" />;
      case 'pix':
        return <Smartphone className="w-6 h-6" />;
    }
  };

  const isWalletInsufficient = amount > walletBalance;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Forma de Pagamento</h3>
      
      <div className="space-y-2">
        {paymentMethods.map((method) => {
          const isDisabled = disabled || (method.type === 'wallet' && isWalletInsufficient);
          const isSelected = selected === method.type;

          return (
            <button
              key={method.type}
              onClick={() => !isDisabled && onChange(method.type)}
              disabled={isDisabled}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : isDisabled
                    ? 'border-border/50 bg-muted/30 opacity-50 cursor-not-allowed'
                    : 'border-border hover:border-primary/50 bg-card'
              }`}
            >
              {/* Radio */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary' : 'border-muted-foreground/30'
                }`}
              >
                {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>

              {/* Icon */}
              <div className={`${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                {getIcon(method.type)}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                    {method.label}
                  </span>
                  {method.type === 'wallet' && (
                    <span className="text-sm text-muted-foreground">
                      ({formatCurrency(walletBalance)})
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                {method.type === 'wallet' && isWalletInsufficient && (
                  <p className="text-xs text-red-500 mt-1">Saldo insuficiente</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
