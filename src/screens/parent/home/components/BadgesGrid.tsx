// src/screens/parent/home/components/BadgesGrid.tsx
import { View, Text } from "react-native";
import { BadgeItem } from "./BadgeItem";

export function BadgesGrid() {
  return (
    <View className="mt-2">
      <Text className="text-base font-bold text-text-main mb-3">
        Досягнення
      </Text>
      <View className="flex-row flex-wrap">
        <BadgeItem title="7 днів" unlocked />
        <BadgeItem title="Без пропусків" unlocked />
        <BadgeItem title="100 вправ" unlocked={false} />
        <BadgeItem title="Місяць" unlocked={false} />
      </View>
    </View>
  );
}
