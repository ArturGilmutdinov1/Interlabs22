import { StyleSheet, Text, View } from 'react-native';
import type { Match, Team } from '../types/match';
import { formatScore, formatStartTime, getStatusLabel } from '../utils/matches';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
  const hasScore = match.score != null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatStartTime(match.startsAt)}</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.status, match.status === 'live' && styles.live]}>
            {getStatusLabel(match)}
          </Text>
          <FavoriteButton active={isFavorite} onPress={() => onToggleFavorite(match.id)} />
        </View>
      </View>

      <View style={styles.teams}>
        <TeamName team={match.home} align="left" />
        <Text style={[styles.score, !hasScore && styles.noScore]}>{formatScore(match.score)}</Text>
        <TeamName team={match.away} align="right" />
      </View>
    </View>
  );
}

function TeamName({ team, align }: { team: Team; align: 'left' | 'right' }) {
  const textAlign = { textAlign: align } as const;
  return (
    <View style={styles.team}>
      <Text style={[styles.teamName, textAlign]}>{team.name}</Text>
      <Text style={[styles.city, textAlign]}>{team.city}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  date: {
    flexShrink: 1,
    fontSize: 13,
    color: '#6b7280',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  live: {
    color: '#ef3124',
  },
  teams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  team: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  city: {
    fontSize: 12,
    color: '#9ca3af',
  },
  score: {
    minWidth: 64,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  noScore: {
    color: '#d1d5db',
  },
});
