// src/screens/parent/home/components/SoundProgressBar.tsx
import { View, Text } from "react-native";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  sound: string;
  progress: number; // 0..100
};

export function SoundProgressBar({ sound, progress }: Props) {
  return (
    <View className="space-y-2 mb-3">
      <View className="flex-row justify-between items-end">
        <Text className="text-base font-bold text-text-main">
          Звук <Text className="text-primary text-lg">"{sound}"</Text>
        </Text>
        <Text className="text-sm font-medium text-text-muted">{progress}%</Text>
      </View>

      <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <View
          className={cn(
            "h-full rounded-full",
            progress < 30 ? "bg-secondary" : "bg-primary",
          )}
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
