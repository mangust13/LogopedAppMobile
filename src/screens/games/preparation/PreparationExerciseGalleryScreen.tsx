// src\screens\games\preparation\PreparationExerciseGalleryScreen.tsx

import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { useAuthStore } from "../../../store/authStore";
import { exercisesApi } from "../../../api/exercisesApi";
import { ExerciseDto } from "../../../api/types/exercise";
import { ENV } from "../../../config/env";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "PreparationExerciseGallery"
>;
type RouteProps = RouteProp<GamesStackParamList, "PreparationExerciseGallery">;

const { width } = Dimensions.get("window");
const COLUMNS = 3;
const SPACING = 12;
const ITEM_WIDTH = (width - SPACING * (COLUMNS + 1)) / COLUMNS;

export function PreparationExerciseGalleryScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { categoryId, categoryTitle } = route.params;
  const role = useAuthStore((s) => s.role);

  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await exercisesApi.getAll();
      setExercises(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <BackHeader title={categoryTitle} />

      {/* Gallery */}
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMNS}
        contentContainerStyle={{ padding: SPACING, paddingBottom: 100 }}
        columnWrapperStyle={{ gap: SPACING }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: ITEM_WIDTH }}
            className="mb-3"
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("PreparationExerciseDetail", {
                exerciseId: item.id,
                title: item.title,
                videoUrl: item.videoUrl,
                description: item.description,
                iconName: item.iconName,
              })
            }
          >
            <View
              style={{
                width: ITEM_WIDTH,
                aspectRatio: 1,
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 4,
                backgroundColor: "#E5E7EB",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: `${ENV.API_BASE_URL}/exercises/${item.iconName}`,
                }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            </View>
            <Text
              className="text-center text-xs font-bold text-text-main"
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Button for Logoped */}
      {role === "Logoped" && (
        <View className="absolute bottom-8 left-4 right-4">
          <Button
            title="+ Створити комплекс"
            onPress={() =>
              navigation.navigate("LogopedCreateComplex", {
                categoryId: categoryId,
              })
            }
            className="shadow-lg shadow-blue-500/30"
          />
        </View>
      )}
    </Screen>
  );
}
