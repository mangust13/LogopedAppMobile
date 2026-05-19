// src/screens/analysis/AnalysisResultScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { BackHeader } from "../../shared/ui/BackHeader";
import { exercisesApi, ExerciseDto, ComplexDto } from "../../api/exercisesApi";
import { RootStackParamList } from "../../navigation/RootNavigator";

type RouteProps = RouteProp<RootStackParamList, "AnalysisResult">;

const games = [
  {
    title: "Гортай картинки",
    icon: "image-multiple",
    color: "#4CAF50",
    route: "SwipeGame" as const,
  },
  {
    title: "Знайди однакові",
    icon: "cards-playing-outline",
    color: "#FF9800",
    route: "MatchingGame" as const,
  },
  {
    title: "Розклади по групах",
    icon: "view-grid-outline",
    color: "#9C27B0",
    route: "ClassificationGame" as const,
  },
];

const SOUND_TO_COMPLEX: Record<string, string> = {
  р: "sound-r",
  л: "sound-l",
  ш: "hushing",
  ж: "hushing",
  ч: "hushing",
  щ: "hushing",
  с: "whistling",
  з: "whistling",
  ц: "whistling",
};

export function AnalysisResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const { problemSounds, groupLabel } = route.params;

  const [exercises, setExercises] = useState<Record<string, ExerciseDto[]>>({});
  const [complexes, setComplexes] = useState<Record<string, ComplexDto>>({});
  const [isLoading, setIsLoading] = useState(problemSounds.length > 0);

  useEffect(() => {
    if (problemSounds.length > 0) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const [allComplexes, ...exerciseResults] = await Promise.all([
        exercisesApi.getComplexes(),
        ...problemSounds.map((sound) => exercisesApi.getBySound(sound)),
      ]);

      const exerciseMap: Record<string, ExerciseDto[]> = {};
      problemSounds.forEach((sound, i) => {
        exerciseMap[sound] = exerciseResults[i].slice(0, 3);
      });
      setExercises(exerciseMap);

      // Мапимо комплекси по звуку
      const complexMap: Record<string, ComplexDto> = {};
      problemSounds.forEach((sound) => {
        const complexName = SOUND_TO_COMPLEX[sound.toLowerCase()];
        if (complexName) {
          const found = allComplexes.find((c) => c.name === complexName);
          if (found) complexMap[sound] = found;
        }
      });
      setComplexes(complexMap);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToGame = (gameRoute: string, sound: string) => {
    navigation.navigate("App", {
      screen: "Games",
      params: {
        screen: gameRoute,
        params: { sound: sound.toUpperCase() },
      },
    });
  };

  const navigateToComplex = (complex: ComplexDto) => {
    navigation.navigate("App", {
      screen: "Games",
      params: {
        screen: "PreparationExerciseGallery",
        params: {
          complexId: complex.id,
          complexTitle: complex.displayName,
        },
      },
    });
  };

  const navigateToLibrary = () => {
    navigation.navigate("App", {
      screen: "Games",
      params: { screen: "PreparationCategories" },
    });
  };

  return (
    <Screen className="px-0 pb-0">
      <BackHeader title="Результати аналізу" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 48, gap: 20 }}
      >
        <View>
          <Text className="text-3xl font-bold text-primary mb-1">
            Аналіз завершено 🎉
          </Text>
          <Text className="text-text-muted text-base">Група: {groupLabel}</Text>
        </View>

        {problemSounds.length === 0 ? (
          <View className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <Text className="text-green-700 font-bold text-lg mb-1">
              Чудово! 🌟
            </Text>
            <Text className="text-green-600">
              Проблемних звуків не виявлено. Вимова відмінна!
            </Text>
          </View>
        ) : (
          <View className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <Text className="text-orange-700 font-bold text-base mb-3">
              Звуки що потребують уваги:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {problemSounds.map((s) => (
                <View key={s} className="bg-orange-100 px-4 py-2 rounded-full">
                  <Text className="text-orange-700 font-bold text-base">
                    {s.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {problemSounds.length > 0 && (
          <>
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-text-main">
                  Рекомендовані вправи 📋
                </Text>
                <TouchableOpacity
                  onPress={navigateToLibrary}
                  activeOpacity={0.7}
                  className="flex-row items-center gap-1"
                >
                  <Text className="text-primary text-sm font-semibold">
                    Бібліотека
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator size="large" color="#6C63FF" />
              ) : (
                <View className="gap-6">
                  {problemSounds.map((sound) => {
                    const soundExercises = exercises[sound] ?? [];
                    const relatedComplex = complexes[sound];

                    return (
                      <View key={sound}>
                        <View className="flex-row items-center gap-2 mb-3">
                          <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                            <Text className="text-white font-bold text-sm">
                              {sound.toUpperCase()}
                            </Text>
                          </View>
                          <Text className="text-lg font-bold text-text-main">
                            Звук {sound.toUpperCase()}
                          </Text>
                        </View>

                        {relatedComplex && (
                          <TouchableOpacity
                            onPress={() => navigateToComplex(relatedComplex)}
                            activeOpacity={0.8}
                            className="mb-3"
                          >
                            <Card className="flex-row items-center gap-3 p-4 border border-primary/20 bg-primary/5">
                              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                                <Ionicons
                                  name="library"
                                  size={20}
                                  color="#6C63FF"
                                />
                              </View>
                              <View className="flex-1">
                                <Text className="font-bold text-primary text-sm">
                                  Комплекс: {relatedComplex.displayName}
                                </Text>
                                <Text className="text-text-muted text-xs mt-0.5">
                                  {relatedComplex.exerciseCount} вправ •
                                  Натисніть щоб відкрити
                                </Text>
                              </View>
                              <Ionicons
                                name="chevron-forward"
                                size={16}
                                color="#6C63FF"
                              />
                            </Card>
                          </TouchableOpacity>
                        )}

                        {/* Окремі вправи якщо є */}
                        {soundExercises.length > 0 ? (
                          <View className="gap-2">
                            {soundExercises.map((ex) => (
                              <TouchableOpacity
                                key={ex.id}
                                activeOpacity={0.8}
                                onPress={() =>
                                  navigation.navigate("App", {
                                    screen: "Games",
                                    params: {
                                      screen: "PreparationExerciseDetail",
                                      params: {
                                        title: ex.title,
                                        videoPath: ex.videoPath,
                                        description: ex.description,
                                      },
                                    },
                                  })
                                }
                              >
                                <Card className="flex-row items-center gap-3 p-4 border border-gray-100">
                                  <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                    <Ionicons
                                      name="play-circle-outline"
                                      size={22}
                                      color="#6C63FF"
                                    />
                                  </View>
                                  <View className="flex-1">
                                    <Text className="font-bold text-text-main text-sm">
                                      {ex.title}
                                    </Text>
                                    {ex.description ? (
                                      <Text
                                        className="text-text-muted text-xs mt-0.5"
                                        numberOfLines={2}
                                      >
                                        {ex.description}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <Ionicons
                                    name="chevron-forward"
                                    size={16}
                                    color="#9CA3AF"
                                  />
                                </Card>
                              </TouchableOpacity>
                            ))}
                          </View>
                        ) : (
                          // Немає ні вправ ні комплексу
                          !relatedComplex && (
                            <TouchableOpacity
                              onPress={navigateToLibrary}
                              activeOpacity={0.8}
                            >
                              <Card className="flex-row items-center gap-3 p-4 border border-gray-100">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                  <Ionicons
                                    name="library-outline"
                                    size={20}
                                    color="#9CA3AF"
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text className="font-bold text-text-main text-sm">
                                    Переглянути бібліотеку вправ
                                  </Text>
                                  <Text className="text-text-muted text-xs mt-0.5">
                                    Знайдіть підходящі вправи самостійно
                                  </Text>
                                </View>
                                <Ionicons
                                  name="chevron-forward"
                                  size={16}
                                  color="#9CA3AF"
                                />
                              </Card>
                            </TouchableOpacity>
                          )
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Ігри */}
            <View>
              <Text className="text-xl font-bold text-text-main mb-4">
                Ігри для тренування 🎮
              </Text>

              <View className="gap-6">
                {problemSounds.map((sound) => (
                  <View key={sound}>
                    <View className="flex-row items-center gap-2 mb-3">
                      <View className="w-8 h-8 bg-primary rounded-full items-center justify-center">
                        <Text className="text-white font-bold text-sm">
                          {sound.toUpperCase()}
                        </Text>
                      </View>
                      <Text className="text-lg font-bold text-text-main">
                        Звук {sound.toUpperCase()}
                      </Text>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                      {games.map((game) => (
                        <TouchableOpacity
                          key={game.route}
                          onPress={() => navigateToGame(game.route, sound)}
                          activeOpacity={0.8}
                          className="flex-1 min-w-[28%] bg-white border border-gray-100 rounded-2xl p-4 items-center gap-2"
                        >
                          <View
                            className="w-12 h-12 rounded-full items-center justify-center"
                            style={{ backgroundColor: game.color }}
                          >
                            <MaterialCommunityIcons
                              name={game.icon as any}
                              size={24}
                              color="#fff"
                            />
                          </View>
                          <Text className="text-xs font-bold text-text-main text-center">
                            {game.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Кнопки */}
        <View className="gap-3 mt-2">
          <Button
            title="Бібліотека вправ 📚"
            variant="outline"
            onPress={navigateToLibrary}
          />
          <Button
            title="Перевірити іншу групу"
            variant="outline"
            onPress={() => navigation.navigate("SoundAnalysis")}
          />
          <Button
            title="На головну"
            onPress={() => navigation.navigate("App", { screen: "Home" })}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}
