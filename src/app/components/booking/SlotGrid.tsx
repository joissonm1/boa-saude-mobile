import type { Slot } from '@/types';

interface SlotGridProps {
  slots: Slot[];
  selectedSlot: Slot | null;
  onSelect: (slot: Slot) => void;
  isLoading?: boolean;
}

export function SlotGrid({ slots, selectedSlot, onSelect, isLoading = false }: SlotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-12 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum horário disponível para esta data.</p>
        <p className="text-sm mt-1">Tente selecionar outra data.</p>
      </div>
    );
  }

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isAvailable = slot.status === 'available';
        const isSelected = selectedSlot?.slotId === slot.slotId;
        const isBooked = slot.status === 'booked';
        const isReserved = slot.status === 'reserved';

        return (
          <button
            key={slot.slotId}
            onClick={() => isAvailable && onSelect(slot)}
            disabled={!isAvailable}
            className={`
              py-3 px-2 rounded-xl font-medium text-sm transition-all
              ${isSelected
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : isAvailable
                  ? 'bg-card border-2 border-border hover:border-primary hover:bg-primary/5 text-foreground'
                  : isBooked
                    ? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed line-through'
                    : isReserved
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 cursor-not-allowed'
                      : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
              }
            `}
          >
            {formatTime(slot.datetime)}
          </button>
        );
      })}
    </div>
  );
}
