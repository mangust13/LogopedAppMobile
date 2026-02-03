// src/screens/parent/home/components/SoundProgressBar.tsx
import { View, Text, StyleSheet } from "react-native";

type Props = {
  sound: string;
  progress: number; // 0..100
};

export function SoundProgressBar({ sound, progress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sound}>/{sound}/</Text>
        <Text style={styles.percent}>{progress}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sound: {
    fontSize: 14,
    fontWeight: "600",
  },
  percent: {
    fontSize: 13,
    color: "#6b7280",
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: "#22c55e",
  },
});
