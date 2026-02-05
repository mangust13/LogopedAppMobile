// src/screens/parent/home/components/BadgeItem.tsx
import { View, Text } from "react-native";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  title: string;
  unlocked: boolean;
};

export function BadgeItem({ title, unlocked }: Props) {
  return (
    <View
      className={cn(
        "px-3 py-2 rounded-xl border min-w-[80px] items-center justify-center mb-2 mr-2",
        unlocked
          ? "bg-yellow-50 border-yellow-200"
          : "bg-gray-50 border-gray-100 opacity-60",
      )}
    >
      <Text className="text-xl mb-1">{unlocked ? "🏆" : "🔒"}</Text>
      <Text
        className={cn(
          "text-[10px] font-bold text-center",
          unlocked ? "text-yellow-700" : "text-gray-400",
        )}
      >
        {title}
      </Text>
    </View>
  );
}
