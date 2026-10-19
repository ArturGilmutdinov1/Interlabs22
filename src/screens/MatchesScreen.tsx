import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { StateMessage } from '../components/StateMessage';
import { TextButton } from '../components/TextButton';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { filterMatches, sortByStartTime, type MatchFilter } from '../utils/matches';

// Экран «Матчи тура» — задание в README.md, часть 1.
export function MatchesScreen() {
  const { data, updatedAt, error, isLoading, reload } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const { favorites, isFavorite, toggle } = useFavorites();

  const visibleMatches = useMemo(
    () => (data ? sortByStartTime(filterMatches(data.matches, filter)) : []),
    [data, filter],
  );

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Матчи тура</Text>
        {isLoading ? (
          <StateMessage title="Загружаем матчи…">
            <ActivityIndicator size="large" />
          </StateMessage>
        ) : (
          <StateMessage title="Не удалось загрузить матчи" description={error ?? undefined}>
            <TextButton title="Повторить" onPress={reload} />
          </StateMessage>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи тура</Text>
        <Text style={styles.round}>{data.round} тур</Text>
      </View>

      <View style={styles.toolbar}>
        {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
        <TextButton
          title={isLoading ? 'Обновляем…' : 'Обновить'}
          onPress={reload}
          disabled={isLoading}
        />
      </View>

      {error ? (
        <Text style={styles.refreshError}>Не удалось обновить: {error} Показаны прошлые данные.</Text>
      ) : null}

      <FilterTabs value={filter} onChange={setFilter} />

      <FlatList
        data={visibleMatches}
        keyExtractor={(match) => match.id}
        renderItem={({ item }) => (
          <MatchCard match={item} isFavorite={isFavorite(item.id)} onToggleFavorite={toggle} />
        )}
        // Карточки зависят от избранного, которого нет в data, — без extraData FlatList их не перерисует.
        extraData={favorites}
        refreshing={isLoading}
        onRefresh={reload}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          data.matches.length === 0 ? (
            <StateMessage
              title="В этом туре пока нет матчей"
              description="Загляните позже или обновите список."
            />
          ) : (
            <StateMessage title="Нет матчей в этой категории" description="Выберите другой фильтр." />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  round: {
    fontSize: 14,
    color: '#6b7280',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  refreshError: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    gap: 8,
    paddingBottom: 16,
  },
});
