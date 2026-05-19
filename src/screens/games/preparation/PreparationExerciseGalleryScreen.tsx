import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";

import type { GamesStackParamList } from "../../../navigation/games/GamesStack";

import {
  exercisesApi,
  ExerciseDto,
  ExerciseTagDto,
  ComplexDto,
} from "../../../api/exercisesApi";

import { ENV } from "../../../config/env";
import { cn } from "../../../shared/utils/cn";

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

  const { complexId, complexTitle } = route.params;

  const [allExercises, setAllExercises] = useState<ExerciseDto[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<ExerciseDto[]>([]);
  const [availableTags, setAvailableTags] = useState<ExerciseTagDto[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    void loadExercises();
  }, [complexId]);

  useEffect(() => {
    applyFilters();
  }, [allExercises, selectedTags]);

  const loadExercises = async () => {
    try {
      setLoading(true);

      const complex: ComplexDto = await exercisesApi.getComplexById(complexId);

      setAllExercises(complex.exercises);

      const uniqueTags = new Map<string, ExerciseTagDto>();

      complex.exercises.forEach((exercise: ExerciseDto) => {
        exercise.tags.forEach((tag: ExerciseTagDto) => {
          uniqueTags.set(tag.name, tag);
        });
      });

      setAvailableTags(Array.from(uniqueTags.values()));
    } catch (error) {
      console.error(error);

      setAllExercises([]);
      setAvailableTags([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (selectedTags.length === 0) {
      setFilteredExercises(allExercises);

      return;
    }

    const filtered = allExercises.filter((exercise: ExerciseDto) =>
      selectedTags.every((selectedTag) =>
        exercise.tags.some((tag: ExerciseTagDto) => tag.name === selectedTag),
      ),
    );

    setFilteredExercises(filtered);
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((tag) => tag !== tagName)
        : [...prev, tagName],
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const groupedTags = availableTags.reduce<Record<string, ExerciseTagDto[]>>(
    (acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }

      acc[tag.category].push(tag);

      return acc;
    },
    {},
  );

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      type: "Тип вправи",
      organ: "Органи",
      sound: "Звуки",
    };

    return categoryNames[category] || category;
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
      <BackHeader title={complexTitle} />

      {availableTags.length > 0 && (
        <View className="flex-row items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
          <Text className="text-sm text-text-muted">
            {filteredExercises.length} з {allExercises.length} вправ
          </Text>

          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="flex-row items-center"
          >
            <Ionicons name="filter" size={16} color="#6B7280" />

            <Text className="text-sm text-text-muted ml-1">Фільтри</Text>

            {selectedTags.length > 0 && (
              <View className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
            )}
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id.toString()}
        numColumns={COLUMNS}
        contentContainerStyle={{
          padding: SPACING,
          paddingBottom: 24,
        }}
        columnWrapperStyle={{ gap: SPACING }}
        renderItem={({ item }) => {
          const imagePath = item.imagePath?.trim();
          const videoPath = item.videoPath?.trim();

          return (
            <TouchableOpacity
              style={{ width: ITEM_WIDTH }}
              className="mb-3"
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("PreparationExerciseDetail", {
                  exerciseId: item.id,
                  title: item.title,
                  videoPath: item.videoPath,
                  description: item.description,
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
                {imagePath ? (
                  <Image
                    source={{
                      uri: `${ENV.API_BASE_URL}/exercises${imagePath}`,
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                ) : videoPath ? (
                  <View className="w-full h-full items-center justify-center bg-gray-200">
                    <View className="w-9 h-9 rounded-full bg-black/45 items-center justify-center">
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                  </View>
                ) : (
                  <Ionicons name="videocam-off" size={28} color="#9CA3AF" />
                )}
              </View>

              <Text
                className="text-center text-xs font-bold text-text-main"
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        visible={showFilters}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowFilters(false)}
          />

          <View
            className="bg-white rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
            style={{ height: "70%" }}
          >
            <View className="items-center pt-4 pb-2">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>

            <View className="flex-row items-center justify-between mb-4 px-6">
              <Text className="text-xl font-bold text-text-main">Фільтри</Text>

              {selectedTags.length > 0 && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text className="text-blue-500 font-medium">Очистити</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <ScrollView
                className="px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                {Object.entries(groupedTags).map(([category, tags]) => (
                  <View key={category} className="mb-6">
                    <Text className="text-sm font-bold text-text-muted uppercase mb-2">
                      {getCategoryDisplayName(category)}
                    </Text>

                    <View className="flex-row flex-wrap gap-2">
                      {tags.map((tag) => (
                        <TouchableOpacity
                          key={tag.name}
                          onPress={() => toggleTag(tag.name)}
                          className={cn(
                            "px-3 py-2 rounded-full border",
                            selectedTags.includes(tag.name)
                              ? "bg-blue-500 border-blue-500"
                              : "bg-gray-50 border-gray-200",
                          )}
                        >
                          <Text
                            className={cn(
                              "text-xs font-medium",
                              selectedTags.includes(tag.name)
                                ? "text-white"
                                : "text-text-main",
                            )}
                          >
                            {tag.displayName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
