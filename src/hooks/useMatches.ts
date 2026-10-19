import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches } from '../api/fetchMatches';
import type { MatchesResponse } from '../types/match';

// Загрузка матчей. При повторной загрузке старые данные остаются на экране,
// а ошибка обновления не стирает уже показанный список.
export function useMatches() {
  const [data, setData] = useState<MatchesResponse | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    // Если предыдущий запрос ещё идёт — отменяем, чтобы его ответ не перезаписал свежий.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchMatches(controller.signal);
      if (controller.signal.aborted) return;
      setData(response);
      setUpdatedAt(new Date());
    } catch (e) {
      if (controller.signal.aborted) return;
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка.');
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    return () => controllerRef.current?.abort();
  }, [reload]);

  return { data, updatedAt, error, isLoading, reload };
}
