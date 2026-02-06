// src\screens\games\differentiation\components\ChoiceCard.tsx
import { Pressable, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  label: string;
  selected?: boolean;
  correct?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function ChoiceCard({
  label,
  selected = false,
  correct = false,
  disabled = false,
  onPress,
}: Props) {
  let bgColor = "bg-surface";
  let borderColor = "border-gray-200";
  let textColor = "text-text-main";
  let iconName = null;
  let iconColor = "";

  if (selected) {
    if (correct) {
      bgColor = "bg-green-50";
      borderColor = "border-green-300";
      textColor = "text-green-800";
      iconName = "checkmark-circle";
      iconColor = "#16a34a";
    } else {
      bgColor = "bg-red-50";
      borderColor = "border-red-300";
      textColor = "text-red-800";
      iconName = "close-circle";
      iconColor = "#dc2626";
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      className={cn(
        "flex-row items-center justify-between p-4 mb-3 rounded-xl border-2",
        bgColor,
        borderColor,
      )}
    >
      <Text className={cn("text-lg font-bold", textColor)}>{label}</Text>

      {iconName && (
        <Ionicons name={iconName as any} size={24} color={iconColor} />
      )}

      {!selected && (
        <View className="w-6 h-6 rounded-full border-2 border-gray-200" />
      )}
    </TouchableOpacity>
  );
}
