import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../../../shared/utils/cn";
import { ProgressAttemptDto } from "../../../../api/types/progress";

type Props = {
  item: ProgressAttemptDto;
};

export function AttemptItem({ item }: Props) {
  const accuracy = item.accuracy ?? 0;
  const isGood = accuracy >= 70;

  const time = new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="flex-row items-center justify-between p-3 bg-white border border-gray-100 rounded-xl mb-2">
      <View className="flex-row items-center gap-3 flex-1 mr-2">
        <View
          className={cn(
            "w-10 h-10 rounded-full items-center justify-center",
            isGood ? "bg-green-100" : "bg-orange-100",
          )}
        >
          <Ionicons
            name={isGood ? "checkmark" : "trending-up"}
            size={20}
            color={isGood ? "#15803d" : "#c2410c"}
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-text-main text-sm" numberOfLines={1}>
            {item.exerciseName}
          </Text>
          <Text className="text-xs text-text-muted">{time}</Text>
        </View>
      </View>

      <View className="items-end">
        <Text
          className={cn(
            "font-bold text-base",
            isGood ? "text-green-600" : "text-orange-500",
          )}
        >
          {accuracy}%
        </Text>
        <Text className="text-[10px] text-text-muted">точність</Text>
      </View>
    </View>
  );
}
