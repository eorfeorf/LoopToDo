'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DaySelector } from './day-selector';
import { REPEAT_OPTIONS, type RepeatType, type DayOfWeek } from '@/lib/types';

interface TaskFormProps {
  onSubmit: (title: string, repeatType: RepeatType, customDays?: DayOfWeek[]) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [repeatType, setRepeatType] = useState<RepeatType>('daily');
  const [customDays, setCustomDays] = useState<DayOfWeek[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (repeatType === 'custom' && customDays.length === 0) return;

    onSubmit(title.trim(), repeatType, customDays);
    setTitle('');
    setRepeatType('daily');
    setCustomDays([]);
    setIsExpanded(false);
  };

  const isValid = title.trim() && (repeatType !== 'custom' || customDays.length > 0);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm">新しいタスクを追加...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="task-title">タスク名</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 朝のジョギング"
              className="bg-secondary border-border"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <Label>繰り返し設定</Label>
            <RadioGroup
              value={repeatType}
              onValueChange={(value) => setRepeatType(value as RepeatType)}
              className="grid grid-cols-2 gap-2"
            >
              {REPEAT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all
                    ${repeatType === option.value 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                    }
                  `}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {repeatType === 'custom' && (
            <div className="space-y-3">
              <Label>曜日を選択</Label>
              <DaySelector selectedDays={customDays} onChange={setCustomDays} />
              {customDays.length === 0 && (
                <p className="text-xs text-destructive">少なくとも1つの曜日を選択してください</p>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setRepeatType('daily');
                setCustomDays([]);
              }}
            >
              キャンセル
            </Button>
            <Button type="submit" className="flex-1" disabled={!isValid}>
              追加
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
