// src\screens\games\automation\AutomationListScreen.tsx
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ExerciseCard } from "../preparation/components/ExerciseCard";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationList">;

const exercises = [
  {
    title: "Звук [С] — початок",
    description: "Повторюй слова, де [С] стоїть на початку (Сонце, Слон).",
    difficulty: "Легко" as const,
    estimatedTime: "3 хв",
    sound: "С",
    position: "Початок" as const,
    level: 1,
    icon: "mic-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Звук [Ш] — середина",
    description: "Тренуй чіткість звука [Ш] у середині слова (Миша, Каша).",
    difficulty: "Середньо" as const,
    estimatedTime: "4 хв",
    sound: "Ш",
    position: "Середина" as const,
    level: 2,
    icon: "mic-outline" as keyof typeof Ionicons.glyphMap,
  },
  {
    title: "Звук [Р] — кінець",
    description: "Закріпи вимову [Р] у кінці слова (Сир, Мир).",
    difficulty: "Складно" as const,
    estimatedTime: "5 хв",
    sound: "Р",
    position: "Кінець" as const,
    level: 3,
    icon: "mic-outline" as keyof typeof Ionicons.glyphMap,
  },
];

export function AutomationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <View className="px-6 pt-2 pb-4">
        <Text className="text-text-muted text-xs uppercase font-bold tracking-widest">
          Вправи
        </Text>
        <Text className="text-2xl font-bold text-primary">
          Автоматизація 🎤
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <Text className="text-text-main text-base mb-6 leading-6">
          Обирайте звук та його позицію в слові для тренування чіткої вимови.
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
