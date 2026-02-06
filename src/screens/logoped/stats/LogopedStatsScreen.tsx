// src/screens/logoped/stats/LogopedStatsScreen.tsx
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import ScreenHeader from "../../../shared/ui/ScreenHeader ";

export function LogopedStatsScreen() {
  const stats = [
    {
      label: "Сьогодні",
      value: 2,
      icon: "today-outline",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Цей тиждень",
      value: 5,
      icon: "calendar-outline",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Цей місяць",
      value: 20,
      icon: "stats-chart-outline",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Всього занять",
      value: 120,
      icon: "layers-outline",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <Screen>
      <ScreenHeader subtitle="Дашборд" title={"Моя активність 📈"} center />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-4 justify-between">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="w-[47%] p-4 items-center justify-center aspect-square"
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${s.bg}`}
              >
                <Ionicons
                  name={s.icon as any}
                  size={24}
                  className={s.color}
                  style={{ opacity: 0.8 }}
                />
              </View>
              <Text className="text-3xl font-bold text-text-main mb-1">
                {s.value}
              </Text>
              <Text className="text-xs text-text-muted text-center font-bold uppercase">
                {s.label}
              </Text>
            </Card>
          ))}
        </View>

        <Card className="mt-6 p-4">
          <Text className="text-lg font-bold text-text-main mb-2">
            Примітка
          </Text>
          <Text className="text-text-muted leading-5">
            Це зведена статистика по всім вашим учням. Детальний звіт по кожній
            дитині доступний у розділі "Мої учні".
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
