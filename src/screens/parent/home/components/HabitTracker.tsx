// src/screens/parent/home/components/HabitTracker.tsx
import { View, Text } from "react-native";
import { cn } from "../../../../shared/utils/cn";
import { Card } from "../../../../shared/ui/Card";

type DayState = "done" | "missed" | "today" | "future";

type HabitDay = {
  date: string;
  state: DayState;
};

type Props = {
  streak: number;
  days: HabitDay[];
};

export function HabitTracker({ streak, days }: Props) {
  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-bold text-text-main">
            Ваша звичка 🔥
          </Text>
          <Text className="text-xs text-text-muted">Займайтесь щодня</Text>
        </View>
        <View className="bg-secondary/10 px-3 py-1 rounded-full">
          <Text className="text-secondary font-bold">
            {streak} днів поспіль
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between gap-2">
        {days.map((day, index) => (
          <View key={index} className="items-center space-y-1 flex-1">
            <View
              className={cn(
                "w-8 h-8 rounded-full items-center justify-center",
                day.state === "done" && "bg-success",
                day.state === "missed" && "bg-error/20",
                day.state === "today" &&
                  "bg-secondary border-2 border-secondary-light",
                day.state === "future" && "bg-gray-100",
              )}
            >
              {day.state === "done" && (
                <Text className="text-white text-xs">✓</Text>
              )}
              {day.state === "missed" && (
                <Text className="text-error text-xs">✕</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
