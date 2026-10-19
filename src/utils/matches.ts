import type { Match, MatchStatus, Score } from '../types/match';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const MATCH_FILTERS: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершённые' },
];

// «Предстоящие» — матчи, результат которых ещё не известен: запланированные,
// идущие сейчас и перенесённые. Матчи с неизвестным статусом видны только во «Все».
const STATUSES_BY_FILTER: Record<Exclude<MatchFilter, 'all'>, readonly MatchStatus[]> = {
  upcoming: ['scheduled', 'live', 'postponed'],
  finished: ['finished'],
};

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return matches;
  const statuses: readonly string[] = STATUSES_BY_FILTER[filter];
  return matches.filter((match) => statuses.includes(match.status));
}

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
