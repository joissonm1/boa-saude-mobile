import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Truck, Store, Check, Pill, Smartphone } from 'lucide-react';
import { mockPharmacies, generateMockQuote, mockWallet } from '@/lib/mock-data';
import { PriceDisplay } from '../common/PriceDisplay';
import { PaymentMethodSelector } from '../payment/PaymentMethodSelector';
import type { Prescription, Pharmacy, PharmacyQuote } from '@/types';

interface DispensationFlowProps {
  prescription: Prescription;
  onBack: () => void;
  onComplete: () => void;
}

type Step = 'pharmacy' | 'quote' | 'delivery' | 'payment' | 'success';
type DeliveryMethod = 'pickup' | 'delivery';
type PaymentMethod = 'wallet' | 'card';

export function DispensationFlow({ prescription, onBack, onComplete }: DispensationFlowProps) {
  const [step, setStep] = useState<Step>('pharmacy');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [quote, setQuote] = useState<PharmacyQuote | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingMedications = prescription.medications.filter((m) => !m.dispensed);

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    // Generate quote
    const newQuote = generateMockQuote(prescription.id, pharmacy.id);
    setQuote(newQuote);
    setStep('quote');
  };

  const handleConfirmQuote = () => {
    setStep('delivery');
  };

  const handleSelectDelivery = (method: DeliveryMethod) => {
    setDeliveryMethod(method);
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
  };

  const handleGoBack = () => {
    switch (step) {
      case 'pharmacy':
        onBack();
        break;
      case 'quote':
        setStep('pharmacy');
        setSelectedPharmacy(null);
        setQuote(null);
        break;
      case 'delivery':
        setStep('quote');
        break;
      case 'payment':
        setStep('delivery');
        setDeliveryMethod(null);
        break;
      default:
        onBack();
    }
  };

  const getTotal = () => {
    if (!quote) return 0;
    let total = quote.total;
    if (deliveryMethod === 'delivery' && selectedPharmacy) {
      total += selectedPharmacy.deliveryFee;
    }
    return total;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {step === 'pharmacy' && 'Escolher Farmácia'}
              {step === 'quote' && 'Orçamento'}
              {step === 'delivery' && 'Entrega'}
              {step === 'payment' && 'Pagamento'}
              {step === 'success' && 'Sucesso!'}
            </h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Receita #{prescription.number}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Step 1: Select Pharmacy */}
        {step === 'pharmacy' && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 mb-4">
              <h3 className="font-semibold text-foreground mb-2">
                Medicamentos a dispensar ({pendingMedications.length})
              </h3>
              <div className="space-y-2">
                {pendingMedications.map((med) => (
                  <div key={med.id} className="flex items-center gap-2 text-sm">
                    <Pill className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{med.name} {med.dosage}</span>
                    <span className="text-muted-foreground">({med.quantity} {med.unit})</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Farmácias Próximas
            </h3>

            <div className="space-y-3">
              {mockPharmacies.map((pharmacy) => (
                <button
                  key={pharmacy.id}
                  onClick={() => handleSelectPharmacy(pharmacy)}
                  className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-4 transition-all text-left"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">{pharmacy.name}</h4>
                      <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      pharmacy.openNow
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {pharmacy.openNow ? 'Aberto' : 'Fechado'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{pharmacy.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pharmacy.preparationTime}</span>
                    </div>
                    {pharmacy.deliveryAvailable && (
                      <div className="flex items-center gap-1 text-primary">
                        <Truck className="w-4 h-4" />
                        <span>Entrega</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Quote */}
        {step === 'quote' && quote && selectedPharmacy && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{selectedPharmacy.name}</h4>
                  <p className="text-sm text-muted-foreground">Preparo em {selectedPharmacy.preparationTime}</p>
                </div>
              </div>

              <h4 className="font-semibold text-foreground mb-3">Itens do Orçamento</h4>

              <div className="space-y-3">
                {quote.items.map((item) => (
                  <div
                    key={item.medicationId}
                    className={`flex justify-between items-center p-3 rounded-xl ${
                      item.available
                        ? 'bg-muted/30'
                        : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.available ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="text-red-500">✗</span>
                      )}
                      <span className={item.available ? 'text-foreground' : 'text-red-500 line-through'}>
                        {item.medicationName}
                      </span>
                    </div>
                    {item.available && <PriceDisplay amount={item.price} size="sm" />}
                    {!item.available && (
                      <span className="text-xs text-red-500">Indisponível</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceDisplay amount={quote.total - quote.dispensationFee} size="sm" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de dispensação</span>
                  <PriceDisplay amount={quote.dispensationFee} size="sm" />
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <PriceDisplay amount={quote.total} size="lg" className="text-primary" />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmQuote}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Delivery Method */}
        {step === 'delivery' && selectedPharmacy && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Como deseja receber?</h3>

            <button
              onClick={() => handleSelectDelivery('pickup')}
              className={`w-full bg-card border-2 rounded-2xl p-4 transition-all text-left ${
                deliveryMethod === 'pickup' ? 'border-primary' : 'border-border hover:border-primary'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">Retirar na Farmácia</h4>
                  <p className="text-sm text-muted-foreground">
                    Pronto em {selectedPharmacy.preparationTime}
                  </p>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">Grátis</span>
              </div>
            </button>

            {selectedPharmacy.deliveryAvailable && (
              <button
                onClick={() => handleSelectDelivery('delivery')}
                className={`w-full bg-card border-2 rounded-2xl p-4 transition-all text-left ${
                  deliveryMethod === 'delivery' ? 'border-primary' : 'border-border hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">Entrega em Casa</h4>
                    <p className="text-sm text-muted-foreground">Estimativa: 1-2 horas</p>
                  </div>
                  <PriceDisplay amount={selectedPharmacy.deliveryFee} size="sm" />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 'payment' && quote && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-semibold text-foreground mb-4">Resumo do Pedido</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medicamentos</span>
                  <PriceDisplay amount={quote.total - quote.dispensationFee} size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa de dispensação</span>
                  <PriceDisplay amount={quote.dispensationFee} size="sm" />
                </div>
                {deliveryMethod === 'delivery' && selectedPharmacy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega</span>
                    <PriceDisplay amount={selectedPharmacy.deliveryFee} size="sm" />
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <PriceDisplay amount={getTotal()} size="lg" className="text-primary" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <PaymentMethodSelector
              selected={paymentMethod}
              onChange={setPaymentMethod}
              walletBalance={mockWallet.balance}
              amount={getTotal()}
            />

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={!paymentMethod || isProcessing}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </button>
          </div>
        )}

        {/* Step 5: Success */}
        {step === 'success' && selectedPharmacy && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pedido Confirmado!</h2>
            <p className="text-muted-foreground mb-8">
              {deliveryMethod === 'pickup'
                ? `Retire seus medicamentos em ${selectedPharmacy.name}`
                : 'Seus medicamentos serão entregues em breve'}
            </p>

            <div className="bg-card border border-border rounded-2xl p-4 text-left mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Farmácia</span>
                  <span className="font-medium text-foreground">{selectedPharmacy.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    {deliveryMethod === 'pickup' ? (
                      <><Store className="w-4 h-4" /> Retirada</>
                    ) : (
                      <><Truck className="w-4 h-4" /> Entrega</>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Previsão</span>
                  <span className="font-medium text-foreground">
                    {deliveryMethod === 'pickup' ? selectedPharmacy.preparationTime : '1-2 horas'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total pago</span>
                  <PriceDisplay amount={getTotal()} className="text-primary" />
                </div>
              </div>
            </div>

            {deliveryMethod === 'pickup' && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-foreground mb-2">QR Code para Retirada</h4>
                <div className="bg-white p-4 rounded-xl inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-12 h-12 text-gray-600" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Apresente este código na farmácia
                </p>
              </div>
            )}

            <button
              onClick={onComplete}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Voltar às Receitas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
