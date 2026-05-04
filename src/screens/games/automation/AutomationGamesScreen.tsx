import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { useChildStore } from "../../../store/childStore";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationGames">;

export function AutomationGamesScreen({ navigation, route }: Props) {
  const { sound } = route.params;
  const { selectedChildId } = useChildStore();

  useEffect(() => {
    if (selectedChildId) {
      navigation.replace("SoundRoadmap", { sound, childId: selectedChildId });
    }
  }, []);

  if (!selectedChildId) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Ігри"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-text-muted text-center text-base">
            Оберіть дитину на головному екрані
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Ігри"
        onBackPress={() => navigation.goBack()}
      />
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    </Screen>
  );
}
