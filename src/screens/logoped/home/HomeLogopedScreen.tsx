// src/screens/logoped/home/HomeLogopedScreen.tsx
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

type AttentionLevel = "high" | "medium" | "low";

type AttentionItem = {
  id: string;
  childName: string;
  reason: string;
  level: AttentionLevel;
};

type ActivityItem = {
  id: string;
  childName: string;
  action: string;
  time: string;
};

export function HomeLogopedScreen() {
  const navigation = useNavigation<any>();

  const todayStats = {
    sessionsToday: 5,
    activeChildren: 4,
    avgAccuracy: 78,
  };

  const [needAttention] = useState<AttentionItem[]>([
    {
      id: "1",
      childName: "Софія",
      reason: "Немає активності 4 дні",
      level: "high",
    },
    {
      id: "2",
      childName: "Іван",
      reason: "Низька точність (<60%)",
      level: "medium",
    },
    {
      id: "3",
      childName: "Марко",
      reason: "Нерегулярні заняття",
      level: "low",
    },
  ]);

  const recentActivities: ActivityItem[] = [
    {
      id: "1",
      childName: "Марко",
      action: "Автоматизація /с/",
      time: "10 хв тому",
    },
    {
      id: "2",
      childName: "Софія",
      action: "Пропущено заняття",
      time: "Вчора",
    },
  ];

  const renderAttentionItem = (item: AttentionItem) => {
    return (
      <View style={[styles.attentionRow, styles[`level_${item.level}`]]}>
        <View>
          <View style={styles.attentionHeader}>
            <Text style={styles.attentionName}>{item.childName}</Text>
            <PriorityBadge level={item.level} />
          </View>

          <Text style={styles.attentionReason}>{item.reason}</Text>
        </View>

        <Pressable onPress={() => navigation.navigate("Children")}>
          <Text style={styles.attentionAction}>Деталі</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>Домашня сторінка</Text>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Сьогодні</Text>

            <View style={styles.statsRow}>
              <Stat label="Занять" value={todayStats.sessionsToday} />
              <Stat label="Дітей" value={todayStats.activeChildren} />
              <Stat label="Точність" value={`${todayStats.avgAccuracy}%`} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Потребують уваги</Text>

            <View style={{ gap: 8 }}>
              {needAttention.map((item) => (
                <View key={item.id}>{renderAttentionItem(item)}</View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle}>Швидкі дії</Text>

            <Pressable
              style={styles.actionButton}
              onPress={() => navigation.navigate("Children")}
            >
              <Text style={styles.actionText}>Усі учні</Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => navigation.navigate("Progress")}
            >
              <Text style={styles.actionText}>Статистика</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>Остання активність</Text>
        </View>
      }
      data={recentActivities}
      keyExtractor={(i) => i.id}
      renderItem={({ item }) => (
        <View style={styles.activityRow}>
          <Text style={styles.activityName}>{item.childName}</Text>
          <Text>{item.action}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      )}
    />
  );
}

function PriorityBadge({ level }: { level: AttentionLevel }) {
  const map = {
    high: { text: "Високий", style: styles.badgeHigh },
    medium: { text: "Середній", style: styles.badgeMedium },
    low: { text: "Низький", style: styles.badgeLow },
  };

  return (
    <View style={[styles.badge, map[level].style]}>
      <Text style={styles.badgeText}>{map[level].text}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  statLabel: {
    color: "#6b7280",
  },

  attentionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  attentionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attentionName: {
    fontWeight: "600",
  },
  attentionReason: {
    fontSize: 13,
    color: "#374151",
  },
  attentionAction: {
    color: "#2563eb",
    fontWeight: "600",
  },

  level_high: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecaca",
  },
  level_medium: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  level_low: {
    backgroundColor: "#ecfeff",
    borderColor: "#67e8f9",
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeHigh: {
    backgroundColor: "#dc2626",
  },
  badgeMedium: {
    backgroundColor: "#f59e0b",
  },
  badgeLow: {
    backgroundColor: "#0891b2",
  },

  actionButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  actionText: {
    fontWeight: "600",
  },

  activityRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    gap: 2,
  },
  activityName: {
    fontWeight: "600",
  },
  activityTime: {
    color: "#6b7280",
    fontSize: 12,
  },
});
