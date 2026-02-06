// src\screens\games\preparation\components\ExerciseCard.tsx
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../../shared/ui/Card";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  title: string;
  description: string;
  difficulty: "Легко" | "Середньо" | "Складно";
  estimatedTime: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function ExerciseCard({
  title,
  description,
  difficulty,
  estimatedTime,
  onPress,
  icon = "barbell-outline",
}: Props) {
  const difficultyColor = {
    Легко: "text-green-600 bg-green-50 border-green-100",
    Середньо: "text-orange-600 bg-orange-50 border-orange-100",
    Складно: "text-red-600 bg-red-50 border-red-100",
  }[difficulty];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-3">
      <Card className="p-4 border border-gray-100">
        <View className="flex-row items-start">
          <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
            <Ionicons name={icon} size={22} color="#3b82f6" />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-lg font-bold text-text-main flex-1 mr-2">
                {title}
              </Text>
            </View>

            <Text className="text-sm text-text-muted mb-3 leading-5">
              {description}
            </Text>

            <View className="flex-row gap-2">
              <View className={cn("px-2 py-1 rounded border", difficultyColor)}>
                <Text
                  className={cn(
                    "text-xs font-bold",
                    difficultyColor.split(" ")[0],
                  )}
                >
                  {difficulty}
                </Text>
              </View>

              <View className="flex-row items-center px-2 py-1 rounded bg-gray-50 border border-gray-100">
                <Ionicons
                  name="time-outline"
                  size={12}
                  color="#6B7280"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-xs font-medium text-text-muted">
                  {estimatedTime}
                </Text>
              </View>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#D1D5DB"
            style={{ marginTop: 2 }}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
