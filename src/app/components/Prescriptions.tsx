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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Minhas Receitas</h1>
            <p className="text-teal-100 text-sm mt-1">Histórico de prescrições médicas</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Prescription Header */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-b-2 border-teal-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="bg-teal-100 p-2 rounded-xl">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {prescription.doctor}
                    </h3>
                    <p className="text-sm text-gray-500">{prescription.specialty}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  prescription.status === 'dispensed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {prescription.status === 'dispensed' ? 'Dispensado' : 'Pendente'}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{prescription.date}</span>
              </div>
            </div>

            {/* Medications */}
            <div className="p-4 space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Medicamentos
              </h4>
              {prescription.medications.map((med, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-3 border-2 border-gray-100"
                >
                  <h5 className="font-semibold text-gray-800">{med.name}</h5>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>💊 Dosagem: {med.dosage}</p>
                    <p>⏰ Duração: {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pharmacy Info */}
            {prescription.pharmacy && (
              <div className="p-4 bg-green-50 border-t-2 border-green-100">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    Dispensado em: <span className="font-semibold">{prescription.pharmacy}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 border-t-2 border-gray-100 flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              {prescription.status === 'pending' && (
                <button className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                  Buscar na Farmácia
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty State or Summary */}
        {prescriptions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhuma receita encontrada
            </h3>
            <p className="text-gray-500">
              Suas receitas médicas aparecerão aqui após as consultas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
