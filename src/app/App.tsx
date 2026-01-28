import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Prescriptions } from './components/Prescriptions';
import { Profile } from './components/Profile';
import { AppointmentModal } from './components/AppointmentModal';
import { Chatbot } from './components/Chatbot';
import '@/styles/leaflet.css';

type Screen = 'login' | 'home' | 'prescriptions' | 'profile';
type AppointmentType = 'virtual' | 'physical' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [appointmentModal, setAppointmentModal] = useState<AppointmentType>(null);
  const [hue, setHue] = useState<number>(() => {
    const saved = localStorage.getItem('theme-hue');
    return saved ? parseInt(saved, 10) : 235;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', hue.toString());
    localStorage.setItem('theme-hue', hue.toString());
  }, [hue]);

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleShowAppointmentModal = (type: 'virtual' | 'physical') => {
    setAppointmentModal(type);
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModal(null);
  };

  return (
    <div className="relative">
      {/* Mobile container */}
      <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl relative">
        {currentScreen === 'login' && <Login onLogin={handleLogin} />}
        
        {currentScreen === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onShowAppointmentModal={handleShowAppointmentModal}
          />
        )}
        
        {currentScreen === 'prescriptions' && (
          <Prescriptions onBack={() => setCurrentScreen('home')} />
        )}
        
        {currentScreen === 'profile' && (
          <Profile
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
            hue={hue}
            onHueChange={setHue}
          />
        )}

        {/* Appointment Modal */}
        {appointmentModal && (
          <AppointmentModal
            type={appointmentModal}
            onClose={handleCloseAppointmentModal}
          />
        )}
      </div>
      <Chatbot />
    </div>
  );
}
