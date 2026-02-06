//src\screens\games\differentiation\DifferentiationListScreen.tsx

import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
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
    icon: "ear-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Вибір правильного звука",
    description: "Розрізняй [С] та [Ш] у коротких прикладах.",
    difficulty: "Середньо" as const,
    estimatedTime: "4 хв",
    prompt: "Який звук чутно на початку: шапка?",
    correctAnswer: "ш",
    options: ["с", "ш"],
    icon: "ear-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Сюжетне завдання",
    description: "Вибери правильне слово для завершення речення.",
    difficulty: "Складно" as const,
    estimatedTime: "5 хв",
    prompt: "У лісі росте...",
    correctAnswer: "шишка",
    options: ["сиска", "шишка", "сішка"],
    icon: "chatbubbles-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export function DifferentiationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <View className="px-6 pt-2 pb-4">
        <Text className="text-text-muted text-xs uppercase font-bold tracking-widest">
          Вправи
        </Text>
        <Text className="text-2xl font-bold text-primary">
          Диференціація 👂
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <Text className="text-text-main text-base mb-6 leading-6">
          Розвивайте фонематичний слух, обираючи правильні варіанти вимови.
        </Text>

        {tasks.map((task) => (
          <ExerciseCard
            key={task.title}
            title={task.title}
            description={task.description}
            difficulty={task.difficulty}
            estimatedTime={task.estimatedTime}
            icon={task.icon}
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
