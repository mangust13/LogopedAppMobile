import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
  recommended: boolean;
  onPress: () => void;
};

export function CategoryCard({ title, description, recommended, onPress }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {recommended ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Рекомендовано логопедом</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.description}>{description}</Text>
      <Pressable style={styles.ctaButton} onPress={onPress}>
        <Text style={styles.ctaText}>Перейти</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f7fafc",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  headerRow: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a202c",
  },
  description: {
    fontSize: 14,
    color: "#4a5568",
    lineHeight: 20,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e6fffa",
    borderColor: "#81e6d9",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#234e52",
    fontSize: 12,
    fontWeight: "600",
  },
  ctaButton: {
    backgroundColor: "#2b6cb0",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  ctaText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
