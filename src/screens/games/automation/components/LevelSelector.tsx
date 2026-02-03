import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  levels: number[];
  selectedLevel: number;
  onSelect: (level: number) => void;
};

export function LevelSelector({ levels, selectedLevel, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {levels.map((level) => {
        const active = level === selectedLevel;

        return (
          <Pressable
            key={level}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => onSelect(level)}
          >
            <Text style={[styles.text, active && styles.textActive]}>Рівень {level}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  itemActive: {
    backgroundColor: "#2b6cb0",
    borderColor: "#2b6cb0",
  },
  text: {
    color: "#2d3748",
    fontSize: 13,
    fontWeight: "700",
  },
  textActive: {
    color: "#fff",
  },
});
