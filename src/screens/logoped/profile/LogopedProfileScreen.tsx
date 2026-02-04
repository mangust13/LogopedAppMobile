//src\screens\logoped\profile\LogopedProfileScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { useAuthStore } from "../../../store/authStore";
import { ProfileActionButton } from "../../profile/components/ProfileActionButton";
import { ProfileSettingRow } from "../../profile/components/ProfileSettingRow";

export function LogopedProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Профіль логопеда</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Logoped</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Професійний акаунт</Text>
          <Text style={styles.line}>Email: {email ?? "Невідомо"}</Text>
          <Text style={styles.line}>
            Формат супроводу: рекомендації + контроль виконання (mock)
          </Text>
          <Text style={styles.muted}>
            Цей екран про налаштування практики, а не повтор статистики з Progress.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Робочі налаштування</Text>
          <ProfileSettingRow
            label="Шаблон рекомендацій"
            value="Базовий 15 хв (mock)"
          />
          <ProfileSettingRow
            label="Автонoтатки після сесії"
            value="Увімкнено (mock)"
          />
          <ProfileSettingRow
            label="Тон фідбеку батькам"
            value="Підтримуючий (mock)"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Робочі інструменти</Text>
          <ProfileActionButton
            label="Відкрити список дітей"
            onPress={() => navigation.navigate("Children")}
          />
          <ProfileActionButton
            label="Перейти в Games"
            onPress={() => navigation.navigate("Games")}
          />
          <ProfileActionButton
            label="Відкрити Progress"
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
    borderColor: "#c7d2fe",
    backgroundColor: "#eef2ff",
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
