import { Clock, CheckCircle2, XCircle, Ban, Calendar, AlertCircle, Circle, Hourglass, Package } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type StatusType = 
  | 'pending' 
  | 'completed' 
  | 'failed' 
  | 'cancelled' 
  | 'scheduled' 
  | 'expired' 
  | 'partial'
  | 'available'
  | 'booked'
  | 'reserved'
  | 'dispensed'
  | 'preparing'
  | 'ready'
  | 'delivered';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; classes: string; icon: LucideIcon }> = {
  pending: {
    label: 'Pendente',
    classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: Clock,
  },
  completed: {
    label: 'Concluído',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Falhou',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
  cancelled: {
    label: 'Cancelado',
    classes: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    icon: Ban,
  },
  scheduled: {
    label: 'Agendado',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Calendar,
  },
  expired: {
    label: 'Vencida',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: AlertCircle,
  },
  partial: {
    label: 'Parcial',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: Circle,
  },
  available: {
    label: 'Disponível',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  booked: {
    label: 'Ocupado',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: XCircle,
  },
  reserved: {
    label: 'Reservado',
    classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    icon: Clock,
  },
  dispensed: {
    label: 'Dispensado',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  preparing: {
    label: 'Preparando',
    classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: Hourglass,
  },
  ready: {
    label: 'Pronto',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: CheckCircle2,
  },
  delivered: {
    label: 'Entregue',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: Package,
  },
};

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      <Icon size={iconSize} />
      <span>{config.label}</span>
    </span>
  );
}
