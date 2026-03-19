'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Task, DayOfWeek, RepeatType } from '@/lib/types';

const STORAGE_KEY = 'recurring-tasks';

function getSelectedDaysForRepeatType(repeatType: RepeatType): DayOfWeek[] {
  switch (repeatType) {
    case 'daily':
      return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    case 'weekdays':
      return ['mon', 'tue', 'wed', 'thu', 'fri'];
    case 'weekends':
      return ['sat', 'sun'];
    case 'custom':
    default:
      return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTasks(parsed.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        })));
      } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((title: string, repeatType: RepeatType, customDays?: DayOfWeek[]) => {
    const selectedDays = repeatType === 'custom' && customDays 
      ? customDays 
      : getSelectedDaysForRepeatType(repeatType);

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      repeatType,
      selectedDays,
      createdAt: new Date(),
      completedDates: [],
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      
      const isCompleted = task.completedDates.includes(dateStr);
      return {
        ...task,
        completedDates: isCompleted
          ? task.completedDates.filter(d => d !== dateStr)
          : [...task.completedDates, dateStr],
      };
    }));
  }, []);

  const isTaskScheduledForDate = useCallback((task: Task, date: Date): boolean => {
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
    const dayMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayOfWeek = dayMap[dayIndex];
    return task.selectedDays.includes(dayOfWeek);
  }, []);

  const isTaskCompletedForDate = useCallback((task: Task, date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return task.completedDates.includes(dateStr);
  }, []);

  const getTasksForDate = useCallback((date: Date): Task[] => {
    return tasks.filter(task => isTaskScheduledForDate(task, date));
  }, [tasks, isTaskScheduledForDate]);

  return {
    tasks,
    isLoaded,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    isTaskScheduledForDate,
    isTaskCompletedForDate,
    getTasksForDate,
  };
}
