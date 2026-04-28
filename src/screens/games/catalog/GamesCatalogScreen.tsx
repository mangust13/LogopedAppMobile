// src\screens\games\catalog\GamesCatalogScreen.tsx
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { CategoryCard } from "./components/CategoryCard";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

type Props = NativeStackScreenProps<GamesStackParamList, "GamesCatalog">;

export function GamesCatalogScreen({ navigation, route }: Props) {
  const actor = route.params.actor;

  return (
    <Screen>
      <View className="px-6 pt-2 pb-4">
        <ScreenHeader subtitle="Каталог" title={"Ігри та вправи 🎮"} center />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
      >
        <View className="mb-6">
          <Text className="text-text-main text-base bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            👋{" "}
            {actor === "Logoped"
              ? "Обирайте категорію для проведення заняття з дитиною."
              : "Вітаємо! Виконуйте рекомендовані вправи щодня."}
          </Text>
        </View>

        <CategoryCard
          title="Артикуляційна гімнастика"
          description="Розігрів мовного апарату. Базові вправи для язика, губ та щік."
          color="blue"
          icon="happy-outline"
          onPress={() => navigation.navigate("PreparationCategories")}
        />

        <CategoryCard
          title="Автоматизація звуків"
          description="Закріплення правильної вимови звуків у складах, словах та реченнях."
          color="orange"
          icon="mic-outline"
          onPress={() => navigation.navigate("AutomationList")}
        />

        <View className="mt-4 opacity-50">
          <Text className="text-center text-gray-400 text-sm mb-2">
            Незабаром
          </Text>
          <CategoryCard
            title="Диференціація звуків"
            description="Вправи на розрізнення схожих звуків (С-Ш, Р-Л)."
            color="purple"
            icon="ear-outline"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
