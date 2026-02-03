import { ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ExerciseCard } from "./components/ExerciseCard";

type Props = NativeStackScreenProps<GamesStackParamList, "PreparationList">;

const exercises = [
  {
    title: "Артикуляційні пози",
    description: "Утримуй правильне положення язика та губ у дзеркалі.",
    difficulty: "Легко" as const,
    durationSec: 30,
    estimatedTime: "2 хв",
  },
  {
    title: "Утримання",
    description: "Тримай позицію стабільно протягом заданого часу.",
    difficulty: "Середньо" as const,
    durationSec: 45,
    estimatedTime: "3 хв",
  },
  {
    title: "Повтори",
    description: "Повторюй серії артикуляційних рухів у правильному темпі.",
    difficulty: "Складно" as const,
    durationSec: 60,
    estimatedTime: "4 хв",
  },
];

export function PreparationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Підготовчий етап</Text>
        <Text style={styles.subtitle}>Оберіть вправу для запуску ігрової сесії.</Text>

        {exercises.map((item) => (
          <ExerciseCard
            key={item.title}
            title={item.title}
            description={item.description}
            difficulty={item.difficulty}
            estimatedTime={item.estimatedTime}
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

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a202c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 14,
  },
});
