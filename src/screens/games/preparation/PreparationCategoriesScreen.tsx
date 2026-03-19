// src/screens/games/preparation/PreparationCategoriesScreen.tsx
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
import { BackHeader } from "../../../shared/ui/BackHeader";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "PreparationCategories"
>;

export function PreparationCategoriesScreen() {
  const navigation = useNavigation<NavProp>();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await exercisesApi.getMainCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (name: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      all: "apps-outline",
      whistling: "musical-note-outline",
      hushing: "volume-high-outline",
      "sound-l": "chatbubble-outline",
      "sound-r": "chatbubbles-outline",
      "tongue-tip": "hardware-chip-outline",
    };
    return iconMap[name] || "grid-outline";
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
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("PreparationExerciseGallery", {
                categoryId: item.name,
                categoryTitle: item.displayName,
              })
            }
          >
            <Card className="flex-row items-center p-4 border border-blue-100 bg-blue-50/50">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 border border-blue-100">
                <Ionicons
                  name={getIconForCategory(item.name)}
                  size={24}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-main">
                  {item.displayName}
                </Text>
                <Text className="text-xs text-text-muted">
                  {item.exerciseCount} вправ
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
