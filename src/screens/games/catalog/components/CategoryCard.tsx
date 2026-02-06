// src\screens\games\catalog\components\CategoryCard.tsx
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../../shared/ui/Card";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  title: string;
  description: string;
  recommended?: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  color: string; // "blue" | "green" | "orange"
};

export function CategoryCard({
  title,
  description,
  recommended,
  onPress,
  icon,
  color,
}: Props) {
  const bgColors = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    orange: "bg-orange-50 border-orange-100",
    purple: "bg-purple-50 border-purple-100",
  };

  const iconColors = {
    blue: "#3b82f6",
    green: "#10b981",
    orange: "#f97316",
    purple: "#8b5cf6",
  };

  // Типізація для ключів об'єктів
  const bgColorClass =
    bgColors[color as keyof typeof bgColors] || bgColors.blue;
  const iconColor =
    iconColors[color as keyof typeof iconColors] || iconColors.blue;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} className="mb-4">
      <Card className={cn("p-4 border-2", bgColorClass)}>
        <View className="flex-row items-start">
          {/* Іконка категорії */}
          <View className="w-12 h-12 rounded-xl bg-white items-center justify-center mr-4 shadow-sm">
            <Ionicons name={icon} size={28} color={iconColor} />
          </View>

          <View className="flex-1">
            <View className="flex-row flex-wrap items-start mb-1">
              <Text
                className="text-lg font-bold text-text-main mr-2"
                style={{ flexShrink: 1 }}
              >
                {title}
              </Text>

              {recommended && (
                <View className="bg-green-100 px-2 py-0.5 rounded-md border border-green-200 mt-1">
                  <Text className="text-[10px] font-bold text-green-700 uppercase">
                    Рекомендовано
                  </Text>
                </View>
              )}
            </View>

            <Text className="text-sm text-text-muted leading-5 mb-3">
              {description}
            </Text>

            <View className="flex-row items-center">
              <Text className="text-sm font-bold" style={{ color: iconColor }}>
                Почати
              </Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={iconColor}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
