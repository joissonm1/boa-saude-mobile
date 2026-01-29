import { X, Download, Share2, Calendar, User, Clock, FileText, Pill, Hospital, ClipboardList } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import type { Prescription } from '@/types';

interface PrescriptionDetailModalProps {
  prescription: Prescription;
  onClose: () => void;
  onRequestDispensation: () => void;
}

export function PrescriptionDetailModal({
  prescription,
  onClose,
  onRequestDispensation,
}: PrescriptionDetailModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const calculateDaysUntilExpiry = () => {
    const now = new Date();
    const expiry = new Date(prescription.expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysUntilExpiry = calculateDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry <= 0;

  const handleDownloadPDF = () => {
    // Simulate PDF download
    alert('Download de PDF iniciado (simulação)');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Receita #${prescription.number}`,
        text: `Receita médica de ${prescription.doctorName}`,
      });
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto border border-border/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex justify-between items-start shadow-lg sm:rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5" />
              <span className="text-sm text-primary-foreground/80">Receita #{prescription.number}</span>
            </div>
            <h2 className="text-xl font-bold">Detalhes da Receita</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            <StatusBadge status={prescription.status} />
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                title="Baixar PDF"
              >
                <Download className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{prescription.doctorName}</h3>
                <p className="text-sm text-muted-foreground">CRM: {prescription.doctorCRM}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Emissão</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(prescription.issuedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Validade</p>
                  <p className={`text-sm font-medium ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-yellow-500' : 'text-foreground'}`}>
                    {isExpired ? 'Vencida' : `${daysUntilExpiry} dias`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Pill className="w-6 h-6 text-primary" />
              Medicamentos
            </h3>

            <div className="space-y-3">
              {prescription.medications.map((med, index) => (
                <div
                  key={med.id}
                  className={`p-4 rounded-xl border-2 ${
                    med.dispensed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-foreground">
                        {index + 1}. {med.name} {med.dosage}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {med.quantity} {med.unit}
                      </p>
                    </div>
                    {med.dispensed && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Dispensado
                      </span>
                    )}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 mt-2">
                    <p className="text-sm text-foreground">
                      <strong>Posologia:</strong> {med.instructions}
                    </p>
                    <p className="text-sm text-foreground mt-1">
                      <strong>Duração:</strong> {med.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observations */}
          {prescription.observations && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Observações
              </h4>
              <p className="text-sm text-foreground">{prescription.observations}</p>
            </div>
          )}

          {/* Pharmacy Info (if dispensed) */}
          {prescription.pharmacyName && (
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Hospital className="w-4 h-4 inline" /> Farmácia
              </h4>
              <p className="text-foreground">{prescription.pharmacyName}</p>
            </div>
          )}

          {/* Actions */}
          {(prescription.status === 'pending' || prescription.status === 'partial') && !isExpired && (
            <button
              onClick={onRequestDispensation}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Solicitar Dispensação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
