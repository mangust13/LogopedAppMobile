// src/screens/tabs/components/AttemptRow.tsx
import { View, Text, StyleSheet } from "react-native";
import { ProgressAttemptDto } from "../../../../api/types/progress";

export function AttemptRow({ item }: { item: ProgressAttemptDto }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{item.exerciseName}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      {item.accuracy != null && (
        <Text style={styles.accuracy}>{item.accuracy}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  accuracy: {
    fontWeight: "600",
  },
});
