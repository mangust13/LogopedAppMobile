import { View, Text } from "react-native";
import { StreakDto } from "../../../../api/activityApi";
import { Card } from "../../../../shared/ui/Card";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  streak: StreakDto;
  activeDates: string[];
};

type DayState = "done" | "missed" | "today" | "future";

type DayInfo = {
  label: string;
  state: DayState;
};

function buildWeekDays(activeDates: string[], activeToday: boolean): DayInfo[] {
  const days: DayInfo[] = [];
  const today = new Date();
  const dayLabels = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  const activeDateSet = new Set(activeDates.map((d) => d.slice(0, 10)));

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().slice(0, 10);
    const label = dayLabels[date.getDay()];

    let state: DayState;

    if (i === 0) {
      state = activeToday ? "done" : "today";
    } else {
      state = activeDateSet.has(dateStr) ? "done" : "missed";
    }

    days.push({ label, state });
  }

  return days;
}

export function StreakCard({ streak, activeDates }: Props) {
  const days = buildWeekDays(activeDates, streak.activeToday);

  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-bold text-text-main">
            Ваша звичка 🔥
          </Text>
          <Text className="text-xs text-text-muted">Займайтесь щодня</Text>
        </View>

        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-600 font-bold">
            {streak.currentStreak} днів поспіль
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        {days.map((day, index) => (
          <View key={index} className="items-center gap-1 flex-1">
            <View
              className={cn(
                "w-8 h-8 rounded-full items-center justify-center",
                day.state === "done" && "bg-green-500",
                day.state === "missed" && "bg-red-100",
                day.state === "today" &&
                  "bg-orange-400 border-2 border-orange-300",
                day.state === "future" && "bg-gray-100",
              )}
            >
              {day.state === "done" && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
              {day.state === "missed" && (
                <Text className="text-red-400 text-xs font-bold">✕</Text>
              )}
              {day.state === "today" && (
                <Text className="text-white text-xs font-bold">•</Text>
              )}
            </View>

            <Text className="text-[10px] text-gray-400 font-medium">
              {day.label}
            </Text>
          </View>
        ))}
      </View>

      {streak.longestStreak > 0 && (
        <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between">
          <Text className="text-xs text-gray-400">
            Найдовша серія:{" "}
            <Text className="font-bold text-gray-600">
              {streak.longestStreak} днів
            </Text>
          </Text>
          <Text className="text-xs text-gray-400">
            Всього:{" "}
            <Text className="font-bold text-gray-600">
              {streak.totalActiveDays} днів
            </Text>
          </Text>
        </View>
      )}
    </Card>
  );
}
