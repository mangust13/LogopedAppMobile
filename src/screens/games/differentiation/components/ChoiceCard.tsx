import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function ChoiceCard({
  label,
  selected = false,
  correct = false,
  disabled = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.card, selected && styles.selected, selected && correct && styles.correct]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#cbd5e0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  selected: {
    backgroundColor: "#ebf8ff",
    borderColor: "#63b3ed",
  },
  correct: {
    backgroundColor: "#e6fffa",
    borderColor: "#38b2ac",
  },
  label: {
    fontSize: 15,
    color: "#1a202c",
    fontWeight: "600",
  },
});
