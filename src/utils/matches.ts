import type { Match, Score } from '../types/match';

// По времени начала; матчи без даты — в конце, в исходном порядке.
export function sortByStartTime(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => getStartTime(a) - getStartTime(b));
}

function getStartTime(match: Match): number {
  const time = match.startsAt ? Date.parse(match.startsAt) : NaN;
  return Number.isNaN(time) ? Infinity : time;
}

export function getStatusLabel(match: Match): string {
  switch (match.status) {
    case 'scheduled':
      return 'Запланирован';
    case 'live':
      return match.minute != null ? `Идёт · ${match.minute}′` : 'Идёт';
    case 'finished':
      return 'Завершён';
    case 'postponed':
      return 'Перенесён';
    default:
      return 'Статус уточняется';
  }
}

// Дата и время в часовом поясе устройства (toLocaleString берёт его по умолчанию).
export function formatStartTime(startsAt: string | null): string {
  const date = startsAt ? new Date(startsAt) : null;
  if (!date || Number.isNaN(date.getTime())) return 'Дата не назначена';
  return date.toLocaleString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Сравниваем с null явно: счёт 0:0 — тоже счёт.
export function formatScore(score: Score | null): string {
  return score != null ? `${score.home} : ${score.away}` : '– : –';
}
