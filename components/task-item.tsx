'use client';

import { Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DAYS_OF_WEEK, REPEAT_OPTIONS, type Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, isCompleted, onToggle, onDelete }: TaskItemProps) {
  const repeatLabel = REPEAT_OPTIONS.find(opt => opt.value === task.repeatType)?.label || '';
  
  const getDaysLabel = () => {
    if (task.repeatType !== 'custom') return null;
    const dayLabels = task.selectedDays
      .map(day => DAYS_OF_WEEK.find(d => d.key === day)?.short)
      .filter(Boolean);
    return dayLabels.join('・');
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all',
        isCompleted && 'opacity-60'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
        )}
        aria-label={isCompleted ? 'タスクを未完了に戻す' : 'タスクを完了にする'}
      >
        {isCompleted && <Check className="h-3.5 w-3.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          isCompleted && 'line-through text-muted-foreground'
        )}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{repeatLabel}</span>
          {task.repeatType === 'custom' && (
            <>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-primary">{getDaysLabel()}</span>
            </>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        aria-label="タスクを削除"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
