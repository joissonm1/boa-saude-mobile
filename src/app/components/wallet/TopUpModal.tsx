import { useState } from 'react';
import { X, CreditCard, Building2, Copy, Check } from 'lucide-react';
import { PriceDisplay } from '../common/PriceDisplay';

interface TopUpModalProps {
  onClose: () => void;
  onConfirm: (amount: number) => void;
  initialAmount?: number | null;
}

type PaymentMethod = 'card' | 'reference';

const presetAmounts = [20, 50, 100, 200, 500];

export function TopUpModal({ onClose, onConfirm, initialAmount }: TopUpModalProps) {
  const [amount, setAmount] = useState<number>(initialAmount || 50);
  const [customAmount, setCustomAmount] = useState<string>(initialAmount?.toString() || '');
  const [method, setMethod] = useState<PaymentMethod>('reference');
  const [step, setStep] = useState<'amount' | 'payment' | 'processing'>('amount');
  const [referenceCode, setReferenceCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setCustomAmount(value);
    setAmount(numValue);
  };

  const handleContinue = () => {
    const parsedAmount = parseFloat(customAmount);
    if (parsedAmount < 10) {
      alert('Valor mínimo: Kz 10,00');
      return;
    }
    if (parsedAmount > 1000) {
      alert('Valor máximo: Kz 1.000,00');
      return;
    }
    
    if (method === 'reference') {
      // Gerar código de referência único
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      setReferenceCode(`REF-${timestamp}-${random}`);
    }
    setStep('payment');
  };

  const handleCopyReferenceCode = () => {
    navigator.clipboard.writeText(referenceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    // Simular processamento
    setTimeout(() => {
      onConfirm(amount);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex justify-between items-center shadow-lg sm:rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold">Recarregar Carteira</h2>
            <p className="text-sm text-primary-foreground/80">
              {step === 'amount' && 'Escolha o valor'}
              {step === 'payment' && 'Realize o pagamento'}
              {step === 'processing' && 'Processando...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Amount Selection */}
          {step === 'amount' && (
            <div className="space-y-6">
              {/* Preset amounts */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Valores sugeridos
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleAmountSelect(preset)}
                      className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                        amount === preset && !customAmount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      Kz {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ou digite um valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    Kz
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="0,00"
                    min={10}
                    max={1000}
                    className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors bg-background text-foreground text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo Kz 10,00 • Máximo Kz 1.000,00
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Método de pagamento
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setMethod('reference')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      method === 'reference'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${method === 'reference' ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Building2 className={`w-5 h-5 ${method === 'reference' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Referência Bancária</p>
                      <p className="text-sm text-muted-foreground">Pagamento via banco</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === 'reference' ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {method === 'reference' && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setMethod('card')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                      method === 'card'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${method === 'card' ? 'bg-primary/10' : 'bg-muted'}`}>
                      <CreditCard className={`w-5 h-5 ${method === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Elo</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === 'card' ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {method === 'card' && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor da recarga</span>
                  <PriceDisplay amount={amount} size="lg" />
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={amount < 10}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && method === 'reference' && (
            <div className="space-y-6">
              {/* Reference Code */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6 text-center">
                <div className="mb-4">
                  <Building2 className="w-16 h-16 text-primary mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-foreground">Código de Referência</h3>
                </div>
                
                <div className="bg-white dark:bg-card p-4 rounded-xl mb-4">
                  <p className="text-3xl font-bold text-primary tracking-wider font-mono">
                    {referenceCode}
                  </p>
                </div>

                <button
                  onClick={handleCopyReferenceCode}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-medium transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Código
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3">Como pagar:</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Acesse o app ou site do seu banco</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Vá para a opção de pagamento por referência</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Insira o código de referência acima</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Confirme o pagamento</span>
                  </li>
                </ol>
              </div>

              {/* Amount */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Valor a pagar</span>
                  <PriceDisplay amount={amount} size="lg" className="text-primary" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Após o pagamento, seu saldo será atualizado em até 24 horas úteis.
              </p>

              {/* Simular confirmação para demo */}
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Simular Pagamento (Demo)
              </button>

              <button
                onClick={() => setStep('amount')}
                className="w-full py-3 text-muted-foreground font-medium"
              >
                Voltar
              </button>
            </div>
          )}

          {/* Step 2: Card Payment */}
          {step === 'payment' && method === 'card' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Validade
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    placeholder="NOME SOBRENOME"
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none bg-background uppercase"
                  />
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Valor a pagar</span>
                  <PriceDisplay amount={amount} size="lg" className="text-primary" />
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Pagar
              </button>

              <button
                onClick={() => setStep('amount')}
                className="w-full py-3 text-muted-foreground font-medium"
              >
                Voltar
              </button>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-2">Processando...</h3>
              <p className="text-muted-foreground text-center">
                Aguarde enquanto confirmamos seu pagamento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
