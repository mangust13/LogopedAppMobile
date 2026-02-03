//src\screens\games\differentiation\DifferentiationListScreen.tsx
import { ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ExerciseCard } from "../preparation/components/ExerciseCard";

type Props = NativeStackScreenProps<GamesStackParamList, "DifferentiationList">;

const tasks = [
  {
    title: "Пари са - ша",
    description: "Обери правильний звук у парі слів.",
    difficulty: "Середньо" as const,
    estimatedTime: "3 хв",
    prompt: "Оберіть правильне звучання для картинки.",
    correctAnswer: "ша",
    options: ["са", "ша"],
  },
  {
    title: "Вибір правильного звука",
    description: "Розрізняй [С] та [Ш] у коротких прикладах.",
    difficulty: "Середньо" as const,
    estimatedTime: "4 хв",
    prompt: "Який звук чутно на початку: шапка?",
    correctAnswer: "ш",
    options: ["с", "ш"],
  },
  {
    title: "Сюжетне завдання",
    description: "Вибери правильне слово для завершення речення.",
    difficulty: "Складно" as const,
    estimatedTime: "5 хв",
    prompt: "У лісі росте...",
    correctAnswer: "шишка",
    options: ["сиска", "шишка", "сішка"],
  },
];

export function DifferentiationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Диференціація / зв'язне мовлення</Text>
        <Text style={styles.subtitle}>
          Оберіть завдання з картками та вибором відповідей.
        </Text>

        {tasks.map((task) => (
          <ExerciseCard
            key={task.title}
            title={task.title}
            description={task.description}
            difficulty={task.difficulty}
            estimatedTime={task.estimatedTime}
            onPress={() =>
              navigation.navigate("DifferentiationGame", {
                title: task.title,
                prompt: task.prompt,
                correctAnswer: task.correctAnswer,
                options: task.options,
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
