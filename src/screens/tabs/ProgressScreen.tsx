// src/screens/tabs/ProgressScreen.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useProgress } from '../../hooks/useProgress';
import { SummaryCard } from './components/SummaryCard';
import { AttemptRow } from './components/SummaryCard copy';
import { TrendChart } from './components/TrendChart';

export function ProgressScreen() {
  const selectedChildId = 4; // ⬅️ поки хардкод, далі підʼєднаємо selector
  const { summary, last, trend, loading, error } =
    useProgress(selectedChildId);

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {summary && (
            <View style={styles.summaryRow}>
              <SummaryCard
                label="Середня точність"
                value={`${summary.avgAccuracy}%`}
              />
              <SummaryCard
                label="Спроб"
                value={`${summary.totalAttempts}`}
              />
            </View>
          )}

          {trend.length > 0 && <TrendChart data={trend} />}

          <Text style={styles.section}>Останні спроби</Text>
        </View>
      }
      data={last}
      keyExtractor={i => i.id.toString()}
      renderItem={({ item }) => <AttemptRow item={item} />}
      refreshing={loading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
  },
});
