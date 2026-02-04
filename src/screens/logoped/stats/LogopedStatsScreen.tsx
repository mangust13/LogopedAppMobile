// src/screens/logoped/stats/LogopedStatsScreen.tsx
import { View, Text, StyleSheet } from "react-native";
import { SummaryCard } from "../../../shared/ui/SummaryCard";

type Stat = {
  label: string;
  value: number;
};

export function LogopedStatsScreen() {
  const stats: Stat[] = [
    { label: "Сьогодні", value: 2 },
    { label: "Тиждень", value: 5 },
    { label: "Місяць", value: 20 },
    { label: "Рік", value: 120 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧑‍🏫 Статистика логопеда</Text>

      <View style={styles.grid}>
        {stats.map((s) => (
          <SummaryCard
            key={s.label}
            label={s.label}
            value={`${s.value} занять`}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
