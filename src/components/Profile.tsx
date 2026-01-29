'use client';

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
  Edit,
  Palette,
  Moon,
  Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProfileProps {
  onBack: () => void;
  onLogout: () => void;
  hue: number;
  onHueChange: (hue: number) => void;
}

export function Profile({ onBack, onLogout, hue, onHueChange }: ProfileProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">Gerencie suas informações</p>
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center text-5xl shadow-lg border-2 border-primary-foreground/20">
              👤
            </div>
            <button className="absolute bottom-0 right-0 bg-secondary text-secondary-foreground p-2 rounded-full shadow-lg hover:bg-secondary/90 border border-border">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold mt-4 text-primary-foreground">João da Silva</h2>
          <p className="text-primary-foreground/80 text-sm">Paciente ID: #12345</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme Settings */}
        <div className="bg-card rounded-2xl shadow-md p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Personalização
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <span className="text-sm font-medium text-foreground">Modo Escuro</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDark ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-3 bg-muted/30 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Tom Principal (Hue: {hue})</span>
                <div 
                  className="w-6 h-6 rounded-full border border-border shadow-sm" 
                  style={{ backgroundColor: `oklch(0.62 0.18 ${hue})` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => onHueChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>90</span>
                <span>180</span>
                <span>270</span>
                <span>360</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card rounded-2xl shadow-md p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informações Pessoais
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">joao.silva@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium text-foreground">+244 923 456 789</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Endereço</p>
                <p className="text-sm font-medium text-foreground">Av. Principal, 123 - Luanda</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Data de Nascimento</p>
                <p className="text-sm font-medium text-foreground">15/03/1990</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 bg-secondary text-secondary-foreground py-3 rounded-xl font-semibold hover:bg-secondary/80 transition-colors">
            Editar Informações
          </button>
        </div>

        {/* Health Info */}
        <div className="bg-card rounded-2xl shadow-md p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-destructive" />
            Informações de Saúde
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <p className="text-xs text-destructive mb-1 font-medium">Tipo Sanguíneo</p>
              <p className="text-sm font-bold text-foreground">O+</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <p className="text-xs text-primary mb-1 font-medium">Alergias</p>
              <p className="text-sm font-bold text-foreground">Penicilina</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-card rounded-2xl shadow-md p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary rounded-xl p-4 text-primary-foreground shadow-md">
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm opacity-90">Consultas</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 text-secondary-foreground shadow-md">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm opacity-90">Receitas</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card rounded-2xl shadow-md p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Configurações</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-primary" />
              <span className="flex-1 text-left text-foreground">Notificações</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 rounded-xl transition-colors">
              <Lock className="w-5 h-5 text-primary" />
              <span className="flex-1 text-left text-foreground">Privacidade e Segurança</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 hover:bg-destructive/10 rounded-xl transition-colors text-destructive"
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
