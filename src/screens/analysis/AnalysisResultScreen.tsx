import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import { BackHeader } from "../../shared/ui/BackHeader";
import { exercisesApi, ExerciseDto } from "../../api/exercisesApi";
import { RootStackParamList } from "../../navigation/RootNavigator";

type RouteProps = RouteProp<RootStackParamList, "AnalysisResult">;

const SOUND_TO_TAG: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  дж: "dzh",
  дз: "dz",
  е: "e",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
};

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

export function AnalysisResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const { problemSounds, groupLabel } = route.params;

  const [exercises, setExercises] = useState<Record<string, ExerciseDto[]>>({});
  const [isLoading, setIsLoading] = useState(problemSounds.length > 0);

  useEffect(() => {
    if (problemSounds.length > 0) {
      loadExercises();
    }
  }, []);

  const loadExercises = async () => {
    try {
      const result: Record<string, ExerciseDto[]> = {};
      await Promise.all(
        problemSounds.map(async (sound) => {
          const data = await exercisesApi.getBySound(sound);
          result[sound] = data.slice(0, 3);
        }),
      );
      setExercises(result);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToGame = (route: string, sound: string) => {
    navigation.navigate("App", {
      screen: "Games",
      params: {
        screen: route,
        params: { sound: sound.toUpperCase() },
      },
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
              <Text className="text-xl font-bold text-text-main mb-4">
                Рекомендовані вправи 📋
              </Text>

              {isLoading ? (
                <ActivityIndicator size="large" color="#6C63FF" />
              ) : (
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

                      {exercises[sound]?.length > 0 ? (
                        <View className="gap-3">
                          {exercises[sound].map((ex) => (
                            <View
                              key={ex.id}
                              className="bg-white border border-gray-100 rounded-2xl p-4"
                            >
                              <Text className="font-bold text-text-main text-base mb-1">
                                {ex.title}
                              </Text>
                              {ex.description ? (
                                <Text
                                  className="text-text-muted text-sm"
                                  numberOfLines={2}
                                >
                                  {ex.description}
                                </Text>
                              ) : null}
                            </View>
                          ))}
                        </View>
                      ) : (
                        <View className="bg-gray-50 rounded-2xl p-4">
                          <Text className="text-text-muted text-sm">
                            Вправ для цього звуку поки немає
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

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

        <View className="gap-3 mt-2">
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
