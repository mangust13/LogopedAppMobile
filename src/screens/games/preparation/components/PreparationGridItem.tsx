// src\screens\games\preparation\components\PreparationGridItem.tsx
import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../../shared/ui/Card";

type Props = {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

export function PreparationGridItem({
  title,
  onPress,
  icon = "happy",
  color = "#3b82f6",
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: CARD_WIDTH, marginBottom: 12 }}
    >
      <Card className="p-0 h-36 border-2 border-gray-100 items-center justify-between overflow-hidden bg-white">
        <View className="flex-1 w-full items-center justify-center bg-gray-50">
          <View className="w-16 h-16 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons name={icon} size={40} color={color} />
          </View>
        </View>

        <View className="w-full py-3 px-2 bg-white border-t border-gray-100 items-center">
          <Text
            className="text-sm font-bold text-text-main text-center leading-4"
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        <View className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
          <Ionicons name="play-circle" size={20} color={color} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
