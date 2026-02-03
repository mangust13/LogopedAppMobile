import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  childName: string;
  onExit: () => void;
};

export function GameSessionHeader({ title, childName, onExit }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.child}>Дитина: {childName}</Text>
      </View>
      <Pressable style={styles.exitButton} onPress={onExit}>
        <Text style={styles.exitText}>Вийти</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a202c",
  },
  child: {
    fontSize: 13,
    color: "#4a5568",
  },
  exitButton: {
    backgroundColor: "#fed7d7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitText: {
    color: "#742a2a",
    fontWeight: "700",
    fontSize: 13,
  },
});
