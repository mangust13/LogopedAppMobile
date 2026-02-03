// src/screens/parent/home/components/ChildSelector.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChildDto } from "../../../../api/types/child";

type Props = {
  children: ChildDto[];
  selectedChildId: number | null;
  onSelect: (child: ChildDto) => void;
};

export function ChildSelector({ children, selectedChildId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {children.map((child) => {
        const active = Number(child.id) === selectedChildId;

        return (
          <Pressable
            key={child.id}
            style={[styles.item, active && styles.active]}
            onPress={() => onSelect(child)}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {child.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
  },
  active: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  text: {
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
