// src/screens/parent/home/components/HabitTracker.tsx
import { View, Text, StyleSheet } from "react-native";

type DayState = "done" | "missed" | "today" | "future";

type HabitDay = {
  date: string;
  state: DayState;
};

type Props = {
  streak: number;
  days: HabitDay[];
};

export function HabitTracker({ streak, days }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Регулярність занять</Text>
        <Text style={styles.streak}>🔥 {streak} днів</Text>
      </View>

      <View style={styles.daysRow}>
        {days.map((day) => (
          <View
            key={day.date}
            style={[styles.day, styles[`day_${day.state}`]]}
          />
        ))}
      </View>

      <Text style={styles.hint}>Займайтесь щодня, щоб сформувати звичку</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  streak: {
    fontSize: 16,
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    gap: 6,
  },
  day: {
    width: 18,
    height: 18,
    borderRadius: 6,
  },
  day_done: {
    backgroundColor: "#22c55e",
  },
  day_missed: {
    backgroundColor: "#ef4444",
  },
  day_today: {
    backgroundColor: "#f59e0b",
  },
  day_future: {
    backgroundColor: "#e5e7eb",
  },
  hint: {
    fontSize: 12,
    color: "#6b7280",
  },
});
