// src\screens\games\catalog\GamesCatalogScreen.tsx
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { CategoryCard } from "./components/CategoryCard";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

type Props = NativeStackScreenProps<GamesStackParamList, "GamesCatalog">;

export function GamesCatalogScreen({ navigation, route }: Props) {
  const actor = route.params.actor;

  return (
    <Screen>
      {/* Header */}
      <ScreenHeader title="Каталог" subtitle="Ігри та вправи 🎮" center />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <View className="mb-6">
          <Text className="text-text-main text-base bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            👋{" "}
            {actor === "Logoped"
              ? "Обирайте категорію для проведення заняття з дитиною."
              : "Вітаємо! Виконуйте рекомендовані вправи щодня для найкращого результату."}
          </Text>
        </View>

        <CategoryCard
          title="Артикуляційна гімнастика"
          description="Розігрів мовного апарату. Базові вправи для язика, губ та щік перед початком занять."
          recommended
          color="blue"
          icon="happy-outline"
          onPress={() => navigation.navigate("PreparationList")}
        />

        <CategoryCard
          title="Автоматизація звуків"
          description="Закріплення правильної вимови звуків у складах, словах та реченнях. Рівні складності."
          recommended={actor === "Logoped"}
          color="orange"
          icon="mic-outline"
          onPress={() => navigation.navigate("AutomationList")}
        />

        <CategoryCard
          title="Диференціація звуків"
          description="Вправи на розрізнення схожих звуків (С-Ш, Р-Л) та розвиток фонематичного слуху."
          recommended={false}
          color="purple"
          icon="ear-outline"
          onPress={() => navigation.navigate("DifferentiationList")}
        />

        <View className="mt-4 opacity-50">
          <Text className="text-center text-gray-400 text-sm mb-2">
            Незабаром
          </Text>
          <CategoryCard
            title="Розвиток мовлення"
            description="Сюжетні ігри для побудови зв'язного мовлення та розширення словникового запасу."
            recommended={false}
            color="green"
            icon="chatbubbles-outline"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
