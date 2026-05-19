import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { Card } from "../../../shared/ui/Card";
import { exercisesApi, ComplexDto } from "../../../api/exercisesApi";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { getExercisesText } from "../../../shared/utils/getExercisesText";
import { useAuthStore } from "../../../store/authStore";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "PreparationCategories"
>;

export function PreparationCategoriesScreen() {
  const navigation = useNavigation<NavProp>();
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  const [complexes, setComplexes] = useState<ComplexDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (!token) {
        setComplexes([]);
        return;
      }

      if (role === "Logoped") {
        const data = await exercisesApi.getComplexes();
        setComplexes(data);
        return;
      }

      if (role === "User") {
        const data = await exercisesApi.getAssignedComplexes();
        setComplexes(data);
        return;
      }

      setComplexes([]);
    } catch (error) {
      console.error(error);
      setComplexes([]);
    } finally {
      setLoading(false);
    }
  }, [role, token]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

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

  const handleEditComplex = (complex: ComplexDto) => {
    navigation.navigate("LogopedCreateComplex", {
      complexId: complex.id,
      isEditing: true,
    });
  };

  const handleDeleteComplex = (complex: ComplexDto) => {
    Alert.alert(
      "Видалення комплексу",
      `Ви впевнені, що хочете видалити комплекс "${complex.displayName}"?`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await exercisesApi.deleteComplex(complex.id);
              await loadData();
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Помилка",
                "Не вдалося видалити комплекс. Спробуйте ще раз.",
              );
            }
          },
        },
      ],
    );
  };

  const handleAssignComplex = (complex: ComplexDto) => {
    if (complex.name === "all") return;

    navigation.navigate("LogopedAssignComplex", {
      complexId: complex.id,
      complexTitle: complex.displayName,
    });
  };

  const handleCreateComplex = () => {
    navigation.navigate("LogopedCreateComplex", {
      complexId: 0,
      isEditing: false,
    });
  };

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </Screen>
    );
  }

  if (complexes.length === 0) {
    return (
      <Screen>
        <BackHeader title="Бібліотека" />

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="book-outline" size={64} color="#9CA3AF" />

          <Text className="text-lg font-semibold text-text-main mt-4 text-center">
            {role === "User"
              ? "Поки що немає призначених вправ"
              : "У вас ще немає комплексів"}
          </Text>

          <Text className="text-sm text-text-muted mt-2 text-center">
            {role === "User"
              ? "Логопед ще не призначив вам комплекс вправ."
              : "Створіть перший власний комплекс або використайте дефолтні."}
          </Text>

          {role === "Logoped" && (
            <TouchableOpacity
              onPress={handleCreateComplex}
              activeOpacity={0.85}
              className="mt-6 bg-blue-500 px-6 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">
                Створити комплекс
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title="Бібліотека" />

      {role === "Logoped" && (
        <View className="px-4 pt-3 pb-1">
          <TouchableOpacity
            onPress={handleCreateComplex}
            activeOpacity={0.85}
            className="bg-blue-500 py-3 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">
              Створити комплекс
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={complexes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("PreparationExerciseGallery", {
                complexId: item.id,
                complexTitle: item.displayName,
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
                <View className="flex-row items-center">
                  <Text className="text-base font-semibold text-text-main flex-1">
                    {item.displayName}
                  </Text>

                  {role === "Logoped" && item.isDefault && (
                    <View className="px-2 py-0.5 rounded-full bg-blue-100 ml-2">
                      <Text className="text-[10px] text-blue-700 font-semibold">
                        Стандартний
                      </Text>
                    </View>
                  )}
                </View>

                {item.description && (
                  <Text className="text-sm text-text-muted mt-0.5">
                    {item.description}
                  </Text>
                )}

                <View className="flex-row items-center mt-1">
                  <Text className="text-xs text-blue-600">
                    {getExercisesText(item.exerciseCount)}
                  </Text>
                </View>
              </View>

              {role === "Logoped" && (
                <View className="flex-row items-center">
                  {item.name !== "all" && (
                    <TouchableOpacity
                      onPress={() => handleAssignComplex(item)}
                      className="p-2"
                    >
                      <Ionicons
                        name="people-outline"
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  )}

                  {!item.isDefault && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleEditComplex(item)}
                        className="p-2"
                      >
                        <Ionicons
                          name="pencil-outline"
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteComplex(item)}
                        className="p-2"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}

              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
