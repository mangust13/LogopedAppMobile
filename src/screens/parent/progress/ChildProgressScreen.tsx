// src/screens/parent/progress/ChildProgressScreen.tsx
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useProgress } from "../../../hooks/useProgress";
import { SummaryCard } from "../../../shared/ui/SummaryCard";
import { AttemptRow } from "../../logoped/children/components/AttemptRow";
import { TrendChart } from "../../logoped/children/components/TrendChart";

type RouteParams = {
  childId?: number;
};

export function ChildProgressScreen() {
  const route = useRoute<any>();
  const { childId } = (route.params ?? {}) as RouteParams;

  if (!childId) {
    return (
      <View style={styles.empty}>
        <Text>Дитину не вибрано</Text>
      </View>
    );
  }

  const { summary, last, trend, loading, error, refresh } =
    useProgress(childId);

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
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
