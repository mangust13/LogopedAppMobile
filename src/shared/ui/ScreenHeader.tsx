//src\shared\ui\ScreenHeader.tsx

import { View, Text } from "react-native";

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  center?: boolean;
};

export default function ScreenHeader({
  title,
  subtitle,
  center = false,
}: ScreenHeaderProps) {
  return (
    <View className={`px-6 pt-6 pb-4 ${center ? "items-center" : ""}`}>
      {subtitle && (
        <Text className="text-text-muted text-xs uppercase font-bold tracking-widest mb-1">
          {subtitle}
        </Text>
      )}
      <Text className="text-2xl font-bold text-primary">{title}</Text>
    </View>
  );
}
