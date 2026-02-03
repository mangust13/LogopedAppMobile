// src/screens/parent/home/components/BadgeItem.tsx
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  unlocked: boolean;
};

export function BadgeItem({ title, unlocked }: Props) {
  return (
    <View style={[styles.badge, unlocked ? styles.unlocked : styles.locked]}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 90,
    alignItems: "center",
  },
  unlocked: {
    backgroundColor: "#ecfeff",
    borderColor: "#67e8f9",
  },
  locked: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
