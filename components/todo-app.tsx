'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, ListChecks, Settings2 } from 'lucide-react';
import { useTasks } from '@/hooks/use-tasks';
import { TaskForm } from './task-form';
import { TaskList } from './task-list';
import { DatePicker } from './date-picker';
import { DaySelector } from './day-selector';
import { DAYS_OF_WEEK, REPEAT_OPTIONS, type Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ViewMode = 'today' | 'all';

export function TodoApp() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [viewMode, setViewMode] = useState<ViewMode>('today');

  const {
    tasks,
    isLoaded,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    isTaskCompletedForDate,
    getTasksForDate,
  } = useTasks();

  const tasksForSelectedDate = useMemo(() => {
    return getTasksForDate(selectedDate);
  }, [getTasksForDate, selectedDate]);

  // Calculate task counts for the date picker
  const taskCounts = useMemo(() => {
    const counts: { [dateStr: string]: { total: number; completed: number } } = {};
    
    // Calculate for a range of dates around the selected date
    for (let i = -7; i <= 7; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const tasksForDay = getTasksForDate(date);
      const completed = tasksForDay.filter(task => isTaskCompletedForDate(task, date)).length;
      counts[dateStr] = { total: tasksForDay.length, completed };
    }
    
    return counts;
  }, [selectedDate, getTasksForDate, isTaskCompletedForDate]);

  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateNormalized = new Date(date);
    selectedDateNormalized.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round(
      (selectedDateNormalized.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const completedCount = tasksForSelectedDate.filter(task => 
    isTaskCompletedForDate(task, selectedDate)
  ).length;

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">繰り返しToDo</h1>
              <p className="text-xs text-muted-foreground">習慣を管理しよう</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border bg-secondary p-1">
                <button
                  onClick={() => setViewMode('today')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    viewMode === 'today'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  日別
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    viewMode === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ListChecks className="h-3.5 w-3.5" />
                  一覧
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="space-y-6">
          {viewMode === 'today' ? (
            <>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                taskCounts={taskCounts}
              />

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{formatDate(selectedDate)}</h2>
                  <p className="text-sm text-muted-foreground">
                    {tasksForSelectedDate.length > 0
                      ? `${completedCount}/${tasksForSelectedDate.length} 完了`
                      : 'タスクなし'}
                  </p>
                </div>
                {tasksForSelectedDate.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(completedCount / tasksForSelectedDate.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <TaskList
                tasks={tasksForSelectedDate}
                selectedDate={selectedDate}
                isTaskCompletedForDate={isTaskCompletedForDate}
                onToggleTask={toggleTaskCompletion}
                onDeleteTask={deleteTask}
              />
            </>
          ) : (
            <AllTasksView
              tasks={tasks}
              onDeleteTask={deleteTask}
            />
          )}

          <TaskForm onSubmit={addTask} />
        </div>
      </main>
    </div>
  );
}

function AllTasksView({
  tasks,
  onDeleteTask,
}: {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <ListChecks className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground text-sm">タスクがありません</p>
        <p className="text-muted-foreground/70 text-xs mt-1">
          下のボタンから新しいタスクを追加しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">すべてのタスク</h2>
      <p className="text-sm text-muted-foreground">{tasks.length}件の繰り返しタスク</p>
      
      <div className="space-y-3">
        {tasks.map((task) => {
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
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{task.title}</p>
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{task.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <p className="text-sm font-medium mb-2">繰り返し設定</p>
                      <p className="text-sm text-muted-foreground">{repeatLabel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">実行する曜日</p>
                      <DaySelector
                        selectedDays={task.selectedDays}
                        onChange={() => {}}
                        disabled
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      タスクを削除
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
