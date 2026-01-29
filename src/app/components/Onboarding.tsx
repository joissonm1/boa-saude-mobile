import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Calendar, Wallet, Pill, MapPin } from 'lucide-react';
import { mockOnboardingSteps } from '@/lib/mock-data';

interface OnboardingProps {
  onFinish: () => void;
}

// Map icon names to actual icon components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Calendar,
  Wallet,
  Pill,
  MapPin,
};

export function Onboarding({ onFinish }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = mockOnboardingSteps;
  const isLastStep = currentStep === steps.length - 1;

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onFinish();
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    onFinish();
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < steps.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentStep > 0) {
      handlePrev();
    }
  };

  const currentStepData = steps[currentStep];
  const IconComponent = iconMap[currentStepData.icon];

  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Skip button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-4 py-2"
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        {/* Icon with animated background */}
        <div className="relative mb-10">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentStepData.color} rounded-full blur-3xl opacity-20 scale-150 animate-pulse`} />
          <div className={`relative w-36 h-36 bg-gradient-to-br ${currentStepData.color} rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-700 hover:scale-105`}>
            {IconComponent && (
              <IconComponent className="w-20 h-20 text-white drop-shadow-lg" />
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground text-center mb-5 transition-all duration-500 px-4">
          {currentStepData.title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-center text-base leading-relaxed max-w-sm transition-all duration-500 px-4">
          {currentStepData.description}
        </p>
      </div>

      {/* Bottom navigation */}
      <div className="px-8 pb-12">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-4 px-6 rounded-xl border-2 border-border text-foreground font-semibold transition-all hover:bg-muted flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
          )}
          
          <button
            onClick={isLastStep ? handleFinish : handleNext}
            className={`flex-1 py-4 px-6 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-lg ${
              currentStep === 0 ? 'w-full' : ''
            }`}
          >
            {isLastStep ? 'Começar' : 'Próximo'}
            {!isLastStep && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Swipe hint */}
        <p className="text-center text-muted-foreground/60 text-sm mt-4">
          Deslize para navegar
        </p>
      </div>
    </div>
  );
}
