export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type RepeatType = 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface Task {
  id: string;
  title: string;
  repeatType: RepeatType;
  selectedDays: DayOfWeek[];
  createdAt: Date;
  completedDates: string[]; // ISO date strings for tracking completed dates
}

export const DAYS_OF_WEEK: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'mon', label: '月曜日', short: '月' },
  { key: 'tue', label: '火曜日', short: '火' },
  { key: 'wed', label: '水曜日', short: '水' },
  { key: 'thu', label: '木曜日', short: '木' },
  { key: 'fri', label: '金曜日', short: '金' },
  { key: 'sat', label: '土曜日', short: '土' },
  { key: 'sun', label: '日曜日', short: '日' },
];

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'daily', label: '毎日' },
  { value: 'weekdays', label: '平日のみ' },
  { value: 'weekends', label: '週末のみ' },
  { value: 'custom', label: 'カスタム' },
];
