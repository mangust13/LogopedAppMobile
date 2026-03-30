// screens/games/preparation/LogopedComplexListScreen.tsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { exercisesApi } from "../../../api/exercisesApi";
import { ComplexDto } from "../../../api/types/exercise";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "LogopedComplexList"
>;

export function LogopedComplexListScreen() {
  const navigation = useNavigation<NavProp>();
  const [complexes, setComplexes] = useState<ComplexDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplexes();
  }, []);

  const loadComplexes = async () => {
    try {
      setLoading(true);
      const data = await exercisesApi.getComplexes();
      setComplexes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <BackHeader title="Мої комплекси" />

      <FlatList
        data={complexes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
            onPress={() =>
              navigation.navigate("LogopedAssignComplex", {
                complexId: item.id,
              })
            }
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {item.displayName}
                </Text>
                {item.description && (
                  <Text className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </Text>
                )}
                <Text className="text-xs text-blue-600 mt-2">
                  {item.exerciseCount} вправ •{" "}
                  {item.isDefault ? "Системний" : "Власний"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
