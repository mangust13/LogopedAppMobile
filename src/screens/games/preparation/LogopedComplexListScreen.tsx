import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { exercisesApi, ComplexDto } from "../../../api/exercisesApi";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "LogopedComplexList"
>;

export function LogopedComplexListScreen() {
  const navigation = useNavigation<NavProp>();

  const [complexes, setComplexes] = useState<ComplexDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplexes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await exercisesApi.getComplexes();
      setComplexes(data);
    } catch (error) {
      console.error(error);
      setComplexes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadComplexes();
    }, [loadComplexes]),
  );

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title="Мої комплекси" />

      <FlatList
        data={complexes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Ionicons name="folder-open-outline" size={56} color="#9CA3AF" />
            <Text className="text-base font-semibold text-gray-900 mt-4">
              Комплексів ще немає
            </Text>
            <Text className="text-sm text-gray-500 mt-1 text-center">
              Створіть власний комплекс або використайте дефолтний.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isAllComplex = item.name === "all";

          return (
            <TouchableOpacity
              className={`p-4 rounded-lg border border-gray-200 mb-3 ${
                isAllComplex ? "bg-gray-50 opacity-70" : "bg-white"
              }`}
              activeOpacity={isAllComplex ? 1 : 0.75}
              disabled={isAllComplex}
              onPress={() =>
                navigation.navigate("LogopedAssignComplex", {
                  complexId: item.id,
                  complexTitle: item.displayName,
                })
              }
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="font-semibold text-gray-900 flex-1">
                      {item.displayName}
                    </Text>

                    <View
                      className={`px-2 py-0.5 rounded-full ml-2 ${
                        item.isDefault ? "bg-blue-100" : "bg-green-100"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${
                          item.isDefault ? "text-blue-700" : "text-green-700"
                        }`}
                      >
                        {item.isDefault ? "Дефолтний" : "Власний"}
                      </Text>
                    </View>
                  </View>

                  {item.description && (
                    <Text className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </Text>
                  )}

                  <Text className="text-xs text-blue-600 mt-2">
                    {item.exerciseCount} вправ
                  </Text>
                </View>

                {isAllComplex ? (
                  <Text className="text-xs text-gray-400 ml-3">
                    Не призначається
                  </Text>
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}
