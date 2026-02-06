//src/screens/parent/stats/components/WeeklyChart.tsx
import { View, Text } from "react-native";
import { Card } from "../../../../shared/ui/Card";
import { cn } from "../../../../shared/utils/cn";
import { TrendPointDto } from "../../../../api/types/progress";

type Props = {
  data: TrendPointDto[];
};

const DAYS_UA = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function WeeklyChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const maxVal = 100;

  return (
    <Card className="mb-6 p-4">
      <Text className="text-lg font-bold text-text-main mb-4">Динаміка 📈</Text>

      <View className="flex-row justify-between h-40 pb-2">
        {data.map((point, index) => {
          const val = point.value;
          const heightPercent = Math.max((val / maxVal) * 100, 10);
          const isHigh = val >= 70;

          const dateObj = new Date(point.date);
          const dayName = DAYS_UA[dateObj.getDay()] || "?";
          const dayNum = dateObj.getDate();

          return (
            <View key={index} className="items-center flex-1 h-full">
              <View className="flex-1 w-full justify-end items-center pb-2">
                <View
                  style={{ height: `${heightPercent}%` }}
                  className={cn(
                    "w-2.5 rounded-t-full opacity-90",
                    isHigh ? "bg-primary" : "bg-secondary",
                  )}
                />
              </View>

              <Text className="text-[10px] text-text-muted font-medium">
                {dayName}
              </Text>
              <Text className="text-[9px] text-gray-400">{dayNum}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
