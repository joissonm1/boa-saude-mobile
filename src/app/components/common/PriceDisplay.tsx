interface PriceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  className?: string;
}

export function PriceDisplay({
  amount,
  currency = 'AOA',
  size = 'md',
  showSign = false,
  className = '',
}: PriceDisplayProps) {
  const formatPrice = (value: number): string => {
    return `Kz ${Math.abs(value).toFixed(2).replace('.', ',')}`;
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-3xl',
  };

  const isNegative = amount < 0;
  const signClass = isNegative 
    ? 'text-red-600 dark:text-red-400' 
    : amount > 0 
      ? 'text-green-600 dark:text-green-400' 
      : '';

  return (
    <span className={`font-bold ${sizeClasses[size]} ${showSign ? signClass : ''} ${className}`}>
      {showSign && amount > 0 && '+'}
      {showSign && isNegative && '-'}
      {formatPrice(amount)}
    </span>
  );
}
