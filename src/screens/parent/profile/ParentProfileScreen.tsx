//src\screens\parent\profile\ParentProfileScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { useAuthStore } from "../../../store/authStore";
import { useChildStore } from "../../../store/childStore";
import { ProfileActionButton } from "../../profile/components/ProfileActionButton";
import { ProfileSettingRow } from "../../profile/components/ProfileSettingRow";

export function ParentProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const selectedChild = useChildStore((s) => s.selectedChild);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Профіль батьків</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>User</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Акаунт</Text>
          <Text style={styles.line}>Email: {email ?? "Невідомо"}</Text>
          <Text style={styles.line}>
            Активна дитина: {selectedChild?.name ?? "не обрано"}
          </Text>
          <Text style={styles.muted}>
            Тут тільки персональна інформація і керування, без дублювання прогрес-метрик.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Налаштування домашніх занять</Text>
          <ProfileSettingRow label="Нагадування" value="19:00 щодня (mock)" />
          <ProfileSettingRow
            label="Тривалість сесії"
            value="10 хв за замовчуванням (mock)"
          />
          <ProfileSettingRow label="Темп" value="М'який (mock)" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Швидкі переходи</Text>
          <ProfileActionButton
            label="Керувати дітьми"
            onPress={() => navigation.navigate("Children")}
          />
          <ProfileActionButton
            label="Відкрити Games"
            onPress={() => navigation.navigate("Games")}
          />
          <ProfileActionButton
            label="Переглянути Progress"
            onPress={() => navigation.navigate("Progress")}
          />
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Вийти з акаунту</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    paddingBottom: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#a5f3fc",
    backgroundColor: "#ecfeff",
  },
  badgeText: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  line: {
    fontSize: 14,
    color: "#1f2937",
  },
  muted: {
    fontSize: 12,
    color: "#6b7280",
  },
  logoutButton: {
    marginTop: 2,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: {
    color: "#991b1b",
    fontWeight: "700",
  },
});
