// src\screens\games\automation\components\LevelSelector.tsx
import { Pressable, Text, View, TouchableOpacity } from "react-native";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  levels: number[];
  selectedLevel: number;
  onSelect: (level: number) => void;
};

export function LevelSelector({ levels, selectedLevel, onSelect }: Props) {
  return (
    <View className="flex-row gap-3 mb-4">
      {levels.map((level) => {
        const active = level === selectedLevel;

        return (
          <TouchableOpacity
            key={level}
            onPress={() => onSelect(level)}
            activeOpacity={0.7}
            className={cn(
              "flex-1 py-3 rounded-xl border items-center justify-center",
              active
                ? "bg-primary border-primary shadow-sm shadow-primary/30"
                : "bg-surface border-gray-200",
            )}
          >
            <Text
              className={cn(
                "font-bold text-base",
                active ? "text-white" : "text-text-muted",
              )}
            >
              Рівень {level}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
