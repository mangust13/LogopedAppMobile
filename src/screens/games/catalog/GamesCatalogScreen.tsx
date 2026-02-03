import { ScrollView, StyleSheet, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { CategoryCard } from "./components/CategoryCard";

type Props = NativeStackScreenProps<GamesStackParamList, "GamesCatalog">;

export function GamesCatalogScreen({ navigation, route }: Props) {
  const actor = route.params.actor;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Games</Text>
        <Text style={styles.subtitle}>
          {actor === "Logoped"
            ? "Каталог однаковий для всіх, з mock-рекомендаціями від логопеда."
            : "Каталог однаковий для всіх, рекомендації поки працюють як mock."}
        </Text>

        <CategoryCard
          title="Підготовчий етап"
          description="Артикуляційні пози, утримання та повтори рухів для старту тренування."
          recommended
          onPress={() => navigation.navigate("PreparationList")}
        />

        <CategoryCard
          title="Автоматизація звуків"
          description="Вправи за звуком, позицією в слові та рівнем складності."
          recommended={actor === "Logoped"}
          onPress={() => navigation.navigate("AutomationList")}
        />

        <CategoryCard
          title="Диференціація / зв'язне мовлення"
          description="Вибір правильного звука, пари на розрізнення й прості сюжетні завдання."
          recommended={false}
          onPress={() => navigation.navigate("DifferentiationList")}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a202c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 16,
    lineHeight: 20,
  },
});
