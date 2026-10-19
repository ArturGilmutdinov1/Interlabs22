import { useState } from 'react';

// Избранные матчи (по id). Хранятся только в памяти, пока открыто приложение.
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

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
