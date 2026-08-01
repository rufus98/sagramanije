import type { Sagra } from '@/types/sagra';

export type DateFilter = 'all' | 'today' | 'weekend';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function weekendRange(now: Date) {
  const today = startOfDay(now);
  const day = today.getDay();
  const daysUntilSaturday = day === 0 ? -1 : (6 - day + 7) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() + daysUntilSaturday);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
}

function overlaps(sagra: Sagra, start: Date, end: Date) {
  if (!sagra.data_inizio) return false;

  const eventStart = startOfDay(sagra.data_inizio);
  const eventEnd = startOfDay(sagra.data_fine ?? sagra.data_inizio);

  return eventStart <= end && eventEnd >= start;
}

export function matchesDateFilter(sagra: Sagra, filter: DateFilter, now = new Date()) {
  if (filter === 'all') return true;

  const today = startOfDay(now);
  if (filter === 'today') return overlaps(sagra, today, today);

  const weekend = weekendRange(now);
  return overlaps(sagra, weekend.start, weekend.end);
}
