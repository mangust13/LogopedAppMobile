import { Text, TouchableOpacity, View } from "react-native";
import { UKRAINIAN_SOUND_OPTIONS } from "../constants/sounds";
import { cn } from "../utils/cn";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
};

export function ProblemSoundsPicker({
  value,
  onChange,
  label = "Проблемні звуки",
}: Props) {
  const toggleSound = (sound: string) => {
    if (value.includes(sound)) {
      onChange(value.filter((selectedSound) => selectedSound !== sound));
      return;
    }

    onChange([...value, sound]);
  };

  return (
    <View className="space-y-2">
      <Text className="text-sm font-medium text-text-muted ml-1">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {UKRAINIAN_SOUND_OPTIONS.map((sound) => {
          const selected = value.includes(sound.letter);

          return (
            <TouchableOpacity
              key={sound.letter}
              activeOpacity={0.85}
              onPress={() => toggleSound(sound.letter)}
              className={cn(
                "w-12 h-12 rounded-2xl items-center justify-center border-2",
                selected ? "border-primary" : "border-gray-100",
              )}
              style={{
                backgroundColor: selected ? sound.color : "#FFFFFF",
              }}
            >
              <Text
                className={cn(
                  "text-lg font-bold",
                  selected ? "text-white" : "text-text-main",
                )}
              >
                {sound.letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
