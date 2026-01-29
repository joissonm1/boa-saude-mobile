import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: (destination: 'onboarding' | 'login' | 'home') => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setFadeIn(true), 200);

    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    const isLoggedIn = localStorage.getItem('authToken');

    const displayDuration = 2800;
    const fadeOutDuration = 800;

    // Start fade-out before finish
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, displayDuration);

    // Navigate after fade-out completes
    const finishTimer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        onFinish('onboarding');
      } else if (isLoggedIn) {
        onFinish('home');
      } else {
        onFinish('login');
      }
    }, displayDuration + fadeOutDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent flex flex-col items-center justify-center p-4 overflow-hidden">
      <div
        className={`flex flex-col items-center transition-all duration-1000 ease-out ${
          fadeOut
            ? 'opacity-0 scale-95 -translate-y-8'
            : fadeIn
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-8 scale-95'
        }`}
      >
        {/* Logo */}
        <div className="relative w-40 h-40 mb-8">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white/95 rounded-full p-6 shadow-2xl backdrop-blur-sm border-4 border-white/30">
            <Image
              src="/logo/logo.png"
              alt="Boa Saúde Logo"
              width={112}
              height={112}
              className="object-contain"
              priority
            />
          </div>
          {/* Floating icons */}
          <Sparkles className="absolute -bottom-2 -left-2 w-7 h-7 text-white/80 animate-pulse" />
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3 drop-shadow-lg">
          Boa Saúde
        </h1>
        <p className="text-white/90 text-xl font-medium tracking-wide">
          Cuidando da sua saúde
        </p>

        {/* Loading indicator */}
        <div className="mt-16 flex gap-3">
          <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
          <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
          <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-5 w-16 h-16 bg-white/5 rounded-full blur-xl" />
    </div>
  );
}
