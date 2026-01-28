import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Bell,
  Lock,
  LogOut,
  Edit
} from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
}

export function Profile({ onBack, onLogout }: ProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <p className="text-teal-100 text-sm mt-1">Gerencie suas informações</p>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
              👤
            </div>
            <button className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-700">
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-4">João da Silva</h2>
          <p className="text-teal-100 text-sm">Paciente ID: #12345</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            Informações Pessoais
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">joao.silva@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="text-sm font-medium text-gray-800">+244 923 456 789</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Endereço</p>
                <p className="text-sm font-medium text-gray-800">Av. Principal, 123 - Luanda</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-500">Data de Nascimento</p>
                <p className="text-sm font-medium text-gray-800">15/03/1990</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-teal-50 text-teal-600 py-3 rounded-xl font-semibold hover:bg-teal-100 transition-colors">
            Editar Informações
          </button>
        </div>

        {/* Health Info */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Informações de Saúde
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-xs text-red-600 mb-1">Tipo Sanguíneo</p>
              <p className="text-sm font-semibold text-red-700">O+</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <p className="text-xs text-orange-600 mb-1">Alergias</p>
              <p className="text-sm font-semibold text-orange-700">Penicilina</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-600 mb-1">Condições Crônicas</p>
              <p className="text-sm font-semibold text-blue-700">Hipertensão</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-purple-100">Consultas</p>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl p-4 text-white">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-teal-100">Receitas</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Configurações</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="flex-1 text-left text-gray-700">Notificações</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="flex-1 text-left text-gray-700">Privacidade e Segurança</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left font-semibold">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
