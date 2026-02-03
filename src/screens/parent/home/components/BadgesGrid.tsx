// src/screens/parent/home/components/BadgesGrid.tsx
import { View, Text, StyleSheet } from "react-native";
import { BadgeItem } from "./BadgeItem";

export function BadgesGrid() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Досягнення</Text>

      <View style={styles.grid}>
        <BadgeItem title="7 днів" unlocked />
        <BadgeItem title="Без пропусків" unlocked />
        <BadgeItem title="100 вправ" unlocked={false} />
        <BadgeItem title="Місяць" unlocked={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
