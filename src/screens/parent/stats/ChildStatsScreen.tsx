// src/screens/parent/stats/ChildStatsScreen.tsx
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useChildStore } from "../../../store/childStore";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import { SessionHistory } from "./components/SessionHistory";

export function ChildStatsScreen() {
  const navigation = useNavigation<any>();
  const selectedChildId = useChildStore((s) => s.selectedChildId);
  const selectedChild = useChildStore((s) => s.selectedChild);

  if (!selectedChildId || !selectedChild) {
    return (
      <Screen className="justify-center items-center px-6">
        <Text className="text-xl font-bold text-text-main text-center mb-2">
          Не обрано дитину 🤷‍♂️
        </Text>
        <Text className="text-text-muted text-center mb-6">
          Перейдіть на головну, щоб обрати профіль дитини.
        </Text>
        <Button
          title="На головну"
          onPress={() => navigation.navigate("Home")}
          className="w-full"
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader subtitle="Статистика" title={selectedChild.name} center />

      <View className="flex-1 px-6 pt-4">
        <Text className="text-lg font-bold text-text-main mb-3">
          Заняття з логопедом 📋
        </Text>

        <SessionHistory childId={selectedChildId} />
      </View>
    </Screen>
  );
}
