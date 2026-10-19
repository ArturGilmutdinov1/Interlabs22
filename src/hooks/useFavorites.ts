import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'favorites';

function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

// Избранные матчи (по id). Сохраняются в AsyncStorage и переживают перезапуск приложения.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  // Пока не прочитали сохранённое, не пишем: иначе пустой стартовый [] затрёт избранное.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setFavorites(parseFavorites(raw)))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, loaded]);

  const isFavorite = (id: string) => favorites.includes(id);

  // Новый массив вместо мутации: React сравнивает state по ссылке и иначе не перерисует экран.
  // Функциональное обновление берёт актуальный state, даже если нажать несколько раз подряд.
  const toggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favoriteId) => favoriteId !== id) : [...prev, id],
    );
  };

  return { favorites, isFavorite, toggle };
}
