// src\screens\games\preparation\PreparationListScreen.tsx

import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ExerciseCard } from "./components/ExerciseCard";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

type Props = NativeStackScreenProps<GamesStackParamList, "PreparationList">;

const exercises = [
  {
    title: "Парканчик",
    description: "Посміхнися, покажи зімкнуті зуби. Утримуй під рахунок.",
    difficulty: "Легко" as const,
    durationSec: 30,
    estimatedTime: "2 хв",
    icon: "happy-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Лопаточка",
    description: "Поклади широкий язик на нижню губу. Розслаб м'язи.",
    difficulty: "Середньо" as const,
    durationSec: 45,
    estimatedTime: "3 хв",
    icon: "restaurant-outline" as keyof typeof Ionicons.glyphMap, // Символічно :)
  },
  {
    title: "Годинник",
    description: "Рухай язиком вліво-вправо, торкаючись куточків рота.",
    difficulty: "Складно" as const,
    durationSec: 60,
    estimatedTime: "4 хв",
    icon: "time-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export function PreparationListScreen({ navigation }: Props) {
  return (
    <Screen>
      {/* Header */}
      <ScreenHeader title="Вправи" subtitle="Артикуляція 👅" center />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <Text className="text-text-main text-base mb-6 leading-6">
          Виконуйте ці вправи перед дзеркалом для розігріву м'язів мовного
          апарату.
        </Text>

        {exercises.map((item) => (
          <ExerciseCard
            key={item.title}
            title={item.title}
            description={item.description}
            difficulty={item.difficulty}
            estimatedTime={item.estimatedTime}
            icon={item.icon}
            onPress={() =>
              navigation.navigate("PreparationGame", {
                title: item.title,
                instruction: item.description,
                durationSec: item.durationSec,
                difficulty: item.difficulty,
              })
            }
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
