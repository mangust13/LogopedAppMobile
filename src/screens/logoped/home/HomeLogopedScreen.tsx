import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

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
      <View
        key={item.id}
        className={cn(
          "flex-row justify-between items-center p-3 rounded-xl border mb-2",
          item.level === "high" && "bg-red-50 border-red-100",
          item.level === "medium" && "bg-orange-50 border-orange-100",
          item.level === "low" && "bg-cyan-50 border-cyan-100",
        )}
      >
        <View className="flex-1">
          <View className="flex-row items-center space-x-2 mb-1">
            <Text className="font-bold text-text-main">{item.childName}</Text>
            <PriorityBadge level={item.level} />
          </View>
          <Text className="text-xs text-text-muted">{item.reason}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Children")}>
          <Text className="text-primary font-bold text-sm">Деталі</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Stat = ({ label, value }: { label: string; value: any }) => (
    <View className="items-center flex-1">
      <Text className="text-2xl font-bold text-primary mb-1">{value}</Text>
      <Text className="text-xs text-text-muted uppercase font-bold tracking-wider text-center">
        {label}
      </Text>
    </View>
  );

  return (
    <Screen>
      <ScreenHeader title="Головна" center />

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
        ListHeaderComponent={
          <View className="gap-5">
            <Card>
              <Text className="text-lg font-bold mb-4 text-text-main">
                Сьогодні 📅
              </Text>
              <View className="flex-row justify-between divide-x divide-gray-100">
                <Stat label="Занять" value={todayStats.sessionsToday} />
                <Stat label="Учнів" value={todayStats.activeChildren} />
                <Stat label="Точність" value={`${todayStats.avgAccuracy}%`} />
              </View>
            </Card>

            <Card>
              <Text className="text-lg font-bold mb-3 text-text-main">
                Потребують уваги ⚠️
              </Text>
              <View>
                {needAttention.map((item) => renderAttentionItem(item))}
              </View>
            </Card>

            <View>
              <Text className="text-lg font-bold mb-3 text-text-main">
                Швидкі дії
              </Text>
              <View className="flex-row gap-3">
                <Button
                  title="Всі учні"
                  variant="secondary"
                  className="flex-1"
                  onPress={() => navigation.navigate("Children")}
                />
                <Button
                  title="Звіти"
                  variant="outline"
                  className="flex-1"
                  onPress={() => navigation.navigate("Progress")}
                />
              </View>
            </View>

            <Text className="text-lg font-bold mt-2 text-text-main">
              Остання активність
            </Text>
          </View>
        }
        data={recentActivities}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <View>
              <Text className="font-bold text-text-main text-base">
                {item.childName}
              </Text>
              <Text className="text-text-muted text-sm">{item.action}</Text>
            </View>
            <Text className="text-xs text-text-muted bg-gray-50 px-2 py-1 rounded-md">
              {item.time}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

function PriorityBadge({ level }: { level: AttentionLevel }) {
  const styles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-cyan-100 text-cyan-700",
  };

  const labels = {
    high: "Високий",
    medium: "Середній",
    low: "Низький",
  };

  return (
    <View
      className={cn(
        "px-2 py-0.5 rounded-full ml-2",
        styles[level].split(" ")[0],
      )}
    >
      <Text
        className={cn("text-[10px] font-bold", styles[level].split(" ")[1])}
      >
        {labels[level]}
      </Text>
    </View>
  );
}
