export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  // ISO-строка в UTC. null — дата ещё не назначена (например, у перенесённого матча).
  startsAt: string | null;
  // Сервер может прислать статус, которого нет в MatchStatus, поэтому допускаем любую строку.
  // `string & {}` сохраняет подсказки известных значений в редакторе.
  status: MatchStatus | (string & {});
  // Минута матча — приходит только для статуса live.
  minute?: number;
  home: Team;
  away: Team;
  // null — матч ещё не начался.
  score: Score | null;
};

export type MatchesResponse = {
  round: number;
  matches: Match[];
};
