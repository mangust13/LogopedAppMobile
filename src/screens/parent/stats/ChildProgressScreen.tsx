// src/screens/parent/stats/ChildStatsScreen.tsx
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useChildStore } from "../../../store/childStore";
import { useProgress } from "../../../hooks/useProgress";
import { SummaryCard } from "../../../shared/ui/SummaryCard";
import { AttemptRow } from "../../logoped/children/components/AttemptRow";
import { TrendChart } from "../../logoped/children/components/TrendChart";

export function ChildStatsScreen() {
  const selectedChildId = useChildStore((s) => s.selectedChildId);
  const selectedChild = useChildStore((s) => s.selectedChild);

  if (!selectedChildId) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Оберіть дитину для перегляду прогресу
        </Text>
      </View>
    );
  }

  const { summary, last, trend, loading, error, refresh } =
    useProgress(selectedChildId);

  if (error) {
    return (
      <View style={styles.empty}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {selectedChild && (
            <Text style={styles.childName}>{selectedChild.name}</Text>
          )}

          {summary && (
            <View style={styles.summaryRow}>
              <SummaryCard
                label="Середня точність"
                value={`${summary.avgAccuracy}%`}
              />
              <SummaryCard label="Спроб" value={`${summary.totalAttempts}`} />
            </View>
          )}

          {trend.length > 0 && <TrendChart data={trend} />}

          <Text style={styles.section}>Останні спроби</Text>
        </View>
      }
      data={last}
      keyExtractor={(i) => i.id.toString()}
      renderItem={({ item }) => <AttemptRow item={item} />}
      refreshing={loading}
      onRefresh={refresh}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
  },
  childName: {
    fontSize: 20,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
});
