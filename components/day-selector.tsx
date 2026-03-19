'use client';

import { cn } from '@/lib/utils';
import { DAYS_OF_WEEK, type DayOfWeek } from '@/lib/types';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  disabled?: boolean;
}

export function DaySelector({ selectedDays, onChange, disabled }: DaySelectorProps) {
  const toggleDay = (day: DayOfWeek) => {
    if (disabled) return;
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <div className="flex gap-1.5">
      {DAYS_OF_WEEK.map((day) => (
        <button
          key={day.key}
          type="button"
          onClick={() => toggleDay(day.key)}
          disabled={disabled}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all',
            'border border-border',
            'hover:border-primary/50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            selectedDays.includes(day.key)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground',
            disabled && 'opacity-50 cursor-not-allowed hover:border-border'
          )}
          aria-label={day.label}
          aria-pressed={selectedDays.includes(day.key)}
        >
          {day.short}
        </button>
      ))}
    </div>
  );
}
