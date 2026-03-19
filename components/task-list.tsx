'use client';

import { TaskItem } from './task-item';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  selectedDate: Date;
  isTaskCompletedForDate: (task: Task, date: Date) => boolean;
  onToggleTask: (id: string, date: Date) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskList({
  tasks,
  selectedDate,
  isTaskCompletedForDate,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-secondary p-4 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-muted-foreground text-sm">この日のタスクはありません</p>
        <p className="text-muted-foreground/70 text-xs mt-1">新しいタスクを追加してみましょう</p>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => isTaskCompletedForDate(task, selectedDate));
  const pendingTasks = tasks.filter(task => !isTaskCompletedForDate(task, selectedDate));

  return (
    <div className="space-y-3">
      {pendingTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isCompleted={false}
          onToggle={() => onToggleTask(task.id, selectedDate)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
      {completedTasks.length > 0 && pendingTasks.length > 0 && (
        <div className="py-2">
          <div className="border-t border-border" />
        </div>
      )}
      {completedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isCompleted={true}
          onToggle={() => onToggleTask(task.id, selectedDate)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </div>
  );
}
