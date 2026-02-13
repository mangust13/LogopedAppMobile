// src\screens\games\preparation\PreparationCategoriesScreen.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { Card } from "../../../shared/ui/Card";
import { exercisesApi } from "../../../api/exercisesApi";
import { ExerciseDto, ComplexDto } from "../../../api/types/exercise";
import { useAuthStore } from "../../../store/authStore";
import { BackHeader } from "../../../shared/ui/BackHeader";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "PreparationCategories"
>;

type CategoryItem = {
  id: string;
  title: string;
  type: "system_category" | "custom_complex";
  icon: keyof typeof Ionicons.glyphMap;
};

export function PreparationCategoriesScreen() {
  const navigation = useNavigation<NavProp>();
  const role = useAuthStore((s) => s.role);

  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const allExercises = await exercisesApi.getAll();

      const uniqueCategories = Array.from(
        new Set(allExercises.map((e) => e.category)),
      )
        .filter((c) => c)
        .map((cat) => ({
          id: cat,
          title: formatCategoryTitle(cat),
          type: "system_category" as const,
          icon: getIconForCategory(cat),
        }));

      const list: CategoryItem[] = [
        {
          id: "all",
          title: "Всі вправи",
          type: "system_category",
          icon: "apps-outline",
        },
        ...uniqueCategories,
      ];

      if (role === "Logoped") {
        try {
          const myComplexes = await exercisesApi.getMyComplexes();
          const complexItems = myComplexes.map((c) => ({
            id: c.id.toString(),
            title: c.title,
            type: "custom_complex" as const,
            icon: "folder-open-outline" as keyof typeof Ionicons.glyphMap,
          }));
          list.push(...complexItems);
        } catch (e) {
          console.log("Failed to load complexes", e);
        }
      }

      setItems(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (
    category: string,
  ): keyof typeof Ionicons.glyphMap => {
    const lower = category.toLowerCase();
    if (lower.includes("lips") || lower.includes("губ"))
      return "ellipse-outline";
    if (lower.includes("tongue") || lower.includes("язик"))
      return "hardware-chip-outline";
    if (lower.includes("sound") || lower.includes("звук"))
      return "musical-note-outline";
    return "grid-outline";
  };

  const formatCategoryTitle = (category: string) => {
    return `Вправи: ${category}`;
  };

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title="Бібліотека" />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id + item.type}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("PreparationExerciseGallery", {
                categoryId: item.id,
                categoryTitle: item.title,
              })
            }
          >
            <Card className="flex-row items-center p-4 border border-blue-100 bg-blue-50/50">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 border border-blue-100">
                <Ionicons name={item.icon} size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-main">
                  {item.title}
                </Text>
                {item.type === "custom_complex" && (
                  <Text className="text-xs text-text-muted">
                    Авторський комплекс
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
