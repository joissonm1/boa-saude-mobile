import { ArrowLeft, FileText, Calendar, User, Download, MapPin } from 'lucide-react';

interface PrescriptionsProps {
  onBack: () => void;
}

const prescriptions = [
  {
    id: 1,
    doctor: 'Dr. João Silva',
    specialty: 'Cardiologia',
    date: '20 Jan, 2026',
    medications: [
      { name: 'Losartana 50mg', dosage: '1 comprimido/dia', duration: '30 dias' },
      { name: 'Atorvastatina 20mg', dosage: '1 comprimido/noite', duration: '30 dias' },
    ],
    pharmacy: 'Farmácia Popular',
    status: 'dispensed',
  },
  {
    id: 2,
    doctor: 'Dra. Maria Santos',
    specialty: 'Dermatologia',
    date: '15 Jan, 2026',
    medications: [
      { name: 'Cetoconazol Creme', dosage: '2x ao dia', duration: '14 dias' },
    ],
    pharmacy: 'Farmácia Saúde+',
    status: 'dispensed',
  },
  {
    id: 3,
    doctor: 'Dr. Pedro Costa',
    specialty: 'Ortopedia',
    date: '28 Jan, 2026',
    medications: [
      { name: 'Ibuprofeno 600mg', dosage: '1 comprimido 8/8h', duration: '7 dias' },
      { name: 'Omeprazol 20mg', dosage: '1 comprimido/dia', duration: '7 dias' },
    ],
    status: 'pending',
  },
];

export function Prescriptions({ onBack }: PrescriptionsProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Minhas Receitas</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Histórico de prescrições médicas</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="bg-card rounded-2xl shadow-md overflow-hidden border border-border"
          >
            {/* Prescription Header */}
            <div className="bg-primary/5 p-4 border-b border-border">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {prescription.doctor}
                    </h3>
                    <p className="text-sm text-muted-foreground">{prescription.specialty}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  prescription.status === 'dispensed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {prescription.status === 'dispensed' ? 'Dispensado' : 'Pendente'}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{prescription.date}</span>
              </div>
            </div>

            {/* Medications */}
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Medicamentos
              </h4>
              {prescription.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-muted/30 rounded-xl p-3 border border-border"
                >
                  <h5 className="font-semibold text-foreground">{med.name}</h5>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>💊 Dosagem: {med.dosage}</p>
                    <p>⏰ Duração: {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pharmacy Info */}
            {prescription.pharmacy && (
              <div className="p-4 bg-primary/5 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Retirado em: <span className="font-semibold">{prescription.pharmacy}</span></span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 bg-muted/20 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap overflow-hidden">
                <Download className="w-4 h-4 flex-shrink-0" />
                <span>Download PDF</span>
              </button>
              <button className="flex-1 py-2 border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-muted/30 transition-colors whitespace-nowrap overflow-hidden">
                Ver QR Code
              </button>
            </div>
          </div>
        ))}

        <div className="bg-primary/10 rounded-2xl p-6 text-center border-2 border-dashed border-primary/30">
          <p className="text-primary font-medium">Tem uma receita física?</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">Escaneie para adicionar ao seu histórico digital</p>
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
            Escanear Receita
          </button>
        </div>
      </div>
    </div>
  );
}
