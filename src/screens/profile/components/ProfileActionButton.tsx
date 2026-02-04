//src\screens\profile\components\ProfileActionButton.tsx
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
};

export function ProfileActionButton({ label, onPress }: Props) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  actionText: {
    fontWeight: "700",
    color: "#111827",
  },
});
