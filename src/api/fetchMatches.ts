import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types/match';

export async function fetchMatches(signal?: AbortSignal): Promise<MatchesResponse> {
  let response: Response;
  try {
    response = await fetch(MATCHES_URL, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    throw new Error(`Сервер ответил ошибкой ${response.status}.`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Сервер вернул данные в неожиданном формате.');
  }

  if (!isMatchesResponse(data)) {
    throw new Error('Сервер вернул данные в неожиданном формате.');
  }
  return data;
}

function isMatchesResponse(data: unknown): data is MatchesResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as { matches?: unknown }).matches)
  );
}
