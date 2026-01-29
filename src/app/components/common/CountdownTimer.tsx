import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  expiresAt: string;
  onExpire: () => void;
  className?: string;
}

export function CountdownTimer({ expiresAt, onExpire, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const expiry = new Date(expiresAt).getTime();
      return Math.max(0, expiry - now);
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  // Color based on time remaining
  const getColorClass = () => {
    if (minutes >= 5) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (minutes >= 2) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse';
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${getColorClass()} ${className}`}>
      <span className="text-lg">⏳</span>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
