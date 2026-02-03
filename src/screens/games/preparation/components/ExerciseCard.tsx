import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
  difficulty: "Легко" | "Середньо" | "Складно";
  estimatedTime: string;
  onPress: () => void;
};

export function ExerciseCard({
  title,
  description,
  difficulty,
  estimatedTime,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Складність: {difficulty}</Text>
        <Text style={styles.meta}>Час: {estimatedTime}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a202c",
  },
  description: {
    fontSize: 14,
    color: "#4a5568",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "600",
  },
});
