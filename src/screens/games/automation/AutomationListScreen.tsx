import { ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ExerciseCard } from "../preparation/components/ExerciseCard";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationList">;

const exercises = [
  {
    title: "Звук [С] — початок",
    description: "Повторюй слова, де [С] стоїть на початку.",
    difficulty: "Легко" as const,
    estimatedTime: "3 хв",
    sound: "С",
    position: "Початок" as const,
    level: 1,
  },
  {
    title: "Звук [Ш] — середина",
    description: "Тренуй чіткість звука [Ш] у середині слова.",
    difficulty: "Середньо" as const,
    estimatedTime: "4 хв",
    sound: "Ш",
    position: "Середина" as const,
    level: 2,
  },
  {
    title: "Звук [Р] — кінець",
    description: "Закріпи вимову [Р] у кінці слова.",
    difficulty: "Складно" as const,
    estimatedTime: "5 хв",
    sound: "Р",
    position: "Кінець" as const,
    level: 3,
  },
];

export function AutomationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Автоматизація звуків</Text>
        <Text style={styles.subtitle}>Оберіть вправу за звуком і позицією в слові.</Text>

        {exercises.map((item) => (
          <ExerciseCard
            key={item.title}
            title={item.title}
            description={item.description}
            difficulty={item.difficulty}
            estimatedTime={item.estimatedTime}
            onPress={() =>
              navigation.navigate("AutomationGame", {
                sound: item.sound,
                position: item.position,
                level: item.level,
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
