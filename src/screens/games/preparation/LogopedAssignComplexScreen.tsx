// screens/games/preparation/LogopedAssignComplexScreen.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { exercisesApi } from "../../../api/exercisesApi";
import { logopedApi } from "../../../api/logopedApi";
import { ChildDto } from "../../../api/childrenApi";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { ENV } from "../../../config/env";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "LogopedAssignComplex"
>;
type RouteProps = RouteProp<GamesStackParamList, "LogopedAssignComplex">;

export function LogopedAssignComplexScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { complexId, complexTitle } = route.params;

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await logopedApi.getLogopedChildren();
      setChildren(data);
    } catch (error) {
      console.error("Помилка завантаження списку дітей:", error);
      Alert.alert("Помилка", "Не вдалося завантажити список дітей");
    } finally {
      setLoading(false);
    }
  };

  const toggleChild = (childId: number) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId],
    );
  };

  const assignComplex = async () => {
    if (selectedChildren.length === 0) {
      Alert.alert("Помилка", "Оберіть хоча б одну дитину");
      return;
    }

    try {
      setAssigning(true);
      await exercisesApi.assignComplexToChildren(complexId, selectedChildren);

      Alert.alert("Успіх", "Комплекс успішно призначено", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Помилка при призначенні комплексу:", error);
      Alert.alert("Помилка", "Не вдалося призначити комплекс");
    } finally {
      setAssigning(false);
    }
  };

  const getChildAge = (birthDate: string) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();

    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </Screen>
    );
  }

  if (children.length === 0) {
    return (
      <Screen>
        <BackHeader title="Призначити комплекс" />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="people-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-text-main mt-4 text-center">
            У вас немає дітей
          </Text>
          <Text className="text-sm text-text-muted mt-2 text-center">
            Спочатку додайте дітей у свій профіль
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader title="Призначити комплекс" />

      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-text-main">
          {complexTitle}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Оберіть дітей, яким потрібно призначити цей комплекс
        </Text>
        <Text className="text-sm text-blue-600 mt-2">
          Обрано: {selectedChildren.length} з {children.length}
        </Text>
      </View>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleChild(item.id)}
            className={`flex-row items-center p-3 mb-2 rounded-lg border ${
              selectedChildren.includes(item.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                selectedChildren.includes(item.id)
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedChildren.includes(item.id) && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>

            <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
              {item.avatarUrl ? (
                <Image
                  source={{ uri: `${ENV.API_BASE_URL}${item.avatarUrl}` }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="person" size={20} color="#9CA3AF" />
                </View>
              )}
            </View>

            <View className="flex-1">
              <Text className="font-medium text-gray-900">{item.name}</Text>
              {item.birthDate && (
                <Text className="text-sm text-gray-600">
                  {getChildAge(item.birthDate)} років
                </Text>
              )}
              {item.problemSounds && (
                <Text className="text-xs text-gray-500 mt-1">
                  Проблемні звуки: {item.problemSounds}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <View className="p-4 border-t border-gray-200">
        <Button
          title={assigning ? "Призначення..." : "Призначити комплекс"}
          onPress={assignComplex}
          disabled={assigning || selectedChildren.length === 0}
        />
      </View>
    </Screen>
  );
}
