import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Prescriptions } from './components/Prescriptions';
import { Profile } from './components/Profile';
import { AppointmentModal } from './components/AppointmentModal';
import { Chatbot } from './components/Chatbot';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { WalletScreen } from './components/WalletScreen';
import { WalletHistory } from './components/WalletHistory';
import { BookingFlow } from './components/BookingFlow';
import { PrescriptionsScreen } from './components/PrescriptionsScreen';
import { VideocallScreen } from './components/VideocallScreen';
import { ClinicsScreen } from './components/ClinicsScreen';
import { PharmaciesScreen } from './components/PharmaciesScreen';
import '@/styles/leaflet.css';

type Screen = 
  | 'splash'
  | 'onboarding'
  | 'login' 
  | 'home' 
  | 'prescriptions'
  | 'prescriptions-new'
  | 'profile'
  | 'wallet'
  | 'wallet-history'
  | 'booking'
  | 'videocall'
  | 'clinics'
  | 'pharmacies';

type AppointmentType = 'virtual' | 'physical' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [appointmentModal, setAppointmentModal] = useState<AppointmentType>(null);
  const [hue, setHue] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-hue');
      return saved ? parseInt(saved, 10) : 235;
    }
    return 235;
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--hue', hue.toString());
    localStorage.setItem('theme-hue', hue.toString());
  }, [hue]);

  const handleSplashFinish = (destination: 'onboarding' | 'login' | 'home') => {
    setCurrentScreen(destination);
  };

  const handleOnboardingFinish = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    // Simular login - salvar token
    localStorage.setItem('authToken', 'mock-token-123');
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleShowAppointmentModal = (type: 'virtual' | 'physical') => {
    if (type === 'virtual') {
      setCurrentScreen('videocall');
    } else {
      setCurrentScreen('clinics');
    }
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModal(null);
  };

  const handleBookingSuccess = (appointmentId: string) => {
    setCurrentScreen('home');
  };

  return (
    <div className="relative">
      {/* Mobile container */}
      <div className="max-w-md mx-auto bg-background min-h-screen shadow-2xl relative">
        {/* Splash Screen */}
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={handleSplashFinish} />
        )}

        {/* Onboarding */}
        {currentScreen === 'onboarding' && (
          <Onboarding onFinish={handleOnboardingFinish} />
        )}

        {/* Login */}
        {currentScreen === 'login' && <Login onLogin={handleLogin} />}
        
        {/* Home */}
        {currentScreen === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onShowAppointmentModal={handleShowAppointmentModal}
          />
        )}
        
        {/* Old Prescriptions (keeping for compatibility) */}
        {currentScreen === 'prescriptions' && (
          <Prescriptions onBack={() => setCurrentScreen('home')} />
        )}

        {/* New Prescriptions Screen */}
        {currentScreen === 'prescriptions-new' && (
          <PrescriptionsScreen onBack={() => setCurrentScreen('home')} />
        )}
        
        {/* Profile */}
        {currentScreen === 'profile' && (
          <Profile
            onBack={() => setCurrentScreen('home')}
            onLogout={handleLogout}
            hue={hue}
            onHueChange={setHue}
          />
        )}

        {/* Wallet */}
        {currentScreen === 'wallet' && (
          <WalletScreen
            onBack={() => setCurrentScreen('home')}
            onViewHistory={() => setCurrentScreen('wallet-history')}
          />
        )}

        {/* Wallet History */}
        {currentScreen === 'wallet-history' && (
          <WalletHistory onBack={() => setCurrentScreen('wallet')} />
        )}

        {/* Booking Flow */}
        {currentScreen === 'booking' && (
          <BookingFlow
            onBack={() => setCurrentScreen('home')}
            onSuccess={handleBookingSuccess}
          />
        )}

        {/* Videocall Screen */}
        {currentScreen === 'videocall' && (
          <VideocallScreen onBack={() => setCurrentScreen('home')} />
        )}

        {/* Clinics Screen */}
        {currentScreen === 'clinics' && (
          <ClinicsScreen onBack={() => setCurrentScreen('home')} />
        )}

        {/* Pharmacies Screen */}
        {currentScreen === 'pharmacies' && (
          <PharmaciesScreen onBack={() => setCurrentScreen('home')} />
        )}

        {/* Legacy Appointment Modal */}
        {appointmentModal && (
          <AppointmentModal
            type={appointmentModal}
            onClose={handleCloseAppointmentModal}
          />
        )}
      </div>
      {/* Show chatbot only when not on splash/onboarding */}
      {currentScreen !== 'splash' && currentScreen !== 'onboarding' && <Chatbot />}
    </div>
  );
}
