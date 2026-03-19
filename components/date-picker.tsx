'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  taskCounts: { [dateStr: string]: { total: number; completed: number } };
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export function DatePicker({ selectedDate, onDateChange, taskCounts }: DatePickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDateRange = () => {
    const dates: Date[] = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    onDateChange(newDate);
  };

  const getDateStr = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{formatMonth(selectedDate)}</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate(-7)}
            className="h-8 w-8"
            aria-label="前の週"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(today)}
            className="text-xs"
          >
            今日
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate(7)}
            className="h-8 w-8"
            aria-label="次の週"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-1">
        {getDateRange().map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dateStr = getDateStr(date);
          const counts = taskCounts[dateStr];
          const hasIncomplete = counts && counts.total > counts.completed;

          return (
            <button
              key={dateStr}
              onClick={() => onDateChange(date)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl p-2 transition-all',
                'hover:bg-secondary',
                isSelected && 'bg-primary text-primary-foreground hover:bg-primary',
                !isSelected && isToday && 'ring-1 ring-primary'
              )}
            >
              <span className={cn(
                'text-xs',
                isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {WEEKDAYS[date.getDay()]}
              </span>
              <span className={cn(
                'text-lg font-semibold',
                !isSelected && isToday && 'text-primary'
              )}>
                {date.getDate()}
              </span>
              <div className={cn(
                'h-1.5 w-1.5 rounded-full',
                hasIncomplete
                  ? isSelected ? 'bg-primary-foreground' : 'bg-primary'
                  : 'bg-transparent'
              )} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
