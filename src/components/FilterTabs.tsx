import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MATCH_FILTERS, type MatchFilter } from '../utils/matches';

type Props = {
  value: MatchFilter;
  onChange: (value: MatchFilter) => void;
};

export function FilterTabs({ value, onChange }: Props) {
  return (
    <View style={styles.container} accessibilityRole="tablist">
      {MATCH_FILTERS.map((filter) => {
        const selected = filter.value === value;
        return (
          <Pressable
            key={filter.value}
            onPress={() => onChange(filter.value)}
            style={[styles.tab, selected && styles.selectedTab]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedLabel: {
    color: '#111827',
    fontWeight: '600',
  },
});
