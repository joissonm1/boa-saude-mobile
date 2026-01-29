import { useState } from 'react';
import { ArrowLeft, FileText, Calendar, User, Download, Search, Filter, X, Pill, ClipboardList, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { mockPrescriptions } from '@/lib/mock-data';
import { StatusBadge } from './common/StatusBadge';
import { PriceDisplay } from './common/PriceDisplay';
import { PrescriptionDetailModal } from './prescription/PrescriptionDetailModal';
import { DispensationFlow } from './prescription/DispensationFlow';
import type { Prescription } from '@/types';
import type { LucideIcon } from 'lucide-react';

interface PrescriptionsScreenProps {
  onBack: () => void;
}

type FilterType = 'all' | 'pending' | 'dispensed' | 'partial' | 'expired';

export function PrescriptionsScreen({ onBack }: PrescriptionsScreenProps) {
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDispensation, setShowDispensation] = useState(false);

  const filters: { value: FilterType; label: string; icon: LucideIcon }[] = [
    { value: 'all', label: 'Todas', icon: ClipboardList },
    { value: 'pending', label: 'Pendentes', icon: Clock },
    { value: 'dispensed', label: 'Dispensadas', icon: CheckCircle2 },
    { value: 'partial', label: 'Parciais', icon: Circle },
    { value: 'expired', label: 'Vencidas', icon: AlertCircle },
  ];

  const filteredPrescriptions = prescriptions.filter((p) => {
    // Filter by status
    if (filter !== 'all' && p.status !== filter) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.doctorName.toLowerCase().includes(query) ||
        p.number.includes(query) ||
        p.medications.some((m) => m.name.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

  const handleRequestDispensation = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDispensation(true);
  };

  const handleDispensationComplete = () => {
    setShowDispensation(false);
    setSelectedPrescription(null);
    // In a real app, refresh prescriptions here
  };

  if (showDispensation && selectedPrescription) {
    return (
      <DispensationFlow
        prescription={selectedPrescription}
        onBack={() => {
          setShowDispensation(false);
          setSelectedPrescription(null);
        }}
        onComplete={handleDispensationComplete}
      />
    );
  }

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
            <h1 className="text-2xl font-bold">Minhas Receitas</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">
              {filteredPrescriptions.length} receita(s) encontrada(s)
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar receita, médico ou medicamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
              >
                <Icon size={16} />
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prescriptions List */}
        {filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma receita encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-card rounded-2xl shadow-md overflow-hidden border border-border"
              >
                {/* Header */}
                <div className="bg-primary/5 p-4 border-b border-border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {prescription.doctorName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          CRM: {prescription.doctorCRM}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={prescription.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(prescription.issuedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Receita #{prescription.number}</span>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Medicamentos ({prescription.medications.length})
                  </h4>

                  <div className="space-y-2">
                    {prescription.medications.slice(0, 2).map((med) => (
                      <div
                        key={med.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          med.dispensed
                            ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                            : 'bg-muted/30 border border-border'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${med.dispensed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {med.name} {med.dosage}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {med.instructions} • {med.duration}
                          </p>
                        </div>
                        {med.dispensed && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                            ✓ Dispensado
                          </span>
                        )}
                      </div>
                    ))}
                    {prescription.medications.length > 2 && (
                      <p className="text-sm text-muted-foreground text-center py-1">
                        + {prescription.medications.length - 2} medicamento(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {prescription.estimatedPrice && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Estimado: </span>
                        <PriceDisplay amount={prescription.estimatedPrice} size="sm" />
                      </div>
                    )}
                    {prescription.pharmacyName && (
                      <span className="text-sm text-muted-foreground">
                        • {prescription.pharmacyName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleViewDetails(prescription)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-border text-foreground font-semibold hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    Ver Detalhes
                  </button>
                  {(prescription.status === 'pending' || prescription.status === 'partial') && (
                    <button
                      onClick={() => handleRequestDispensation(prescription)}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                    >
                      Solicitar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <PrescriptionDetailModal
          prescription={selectedPrescription}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPrescription(null);
          }}
          onRequestDispensation={() => {
            setShowDetailModal(false);
            setShowDispensation(true);
          }}
        />
      )}
    </div>
  );
}
