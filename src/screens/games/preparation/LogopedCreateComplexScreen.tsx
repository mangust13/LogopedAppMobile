// src\screens\games\preparation\LogopedCreateComplexScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { exercisesApi } from "../../../api/exercisesApi";
import { ExerciseDto } from "../../../api/types/exercise";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { cn } from "../../../shared/utils/cn";

type RouteProps = RouteProp<GamesStackParamList, "LogopedCreateComplex">;

export function LogopedCreateComplexScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { categoryId } = route.params;

  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await exercisesApi.getAll();
      setExercises(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Помилка", "Введіть назву комплексу");
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert("Помилка", "Оберіть вправи");
      return;
    }

    try {
      setSaving(true);
      await exercisesApi.createComplex({
        title,
        exerciseIds: selectedIds,
      });
      Alert.alert("Успіх", "Комплекс створено!", [
        { text: "ОК", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося зберегти");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="px-4 py-3 border-b border-gray-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text-main">
          Створити комплекс
        </Text>
      </View>

      <View className="p-4 bg-white border-b border-gray-100">
        <Text className="text-xs font-bold text-text-muted uppercase mb-1">
          Назва
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Напр: Артикуляція для Сашка"
          className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-base text-text-main"
        />
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleSelection(item.id)}
              className={cn(
                "flex-row items-center p-3 mb-2 rounded-xl border-2",
                isSelected
                  ? "bg-indigo-50 border-indigo-500"
                  : "bg-white border-gray-100",
              )}
            >
              <View className="flex-1">
                <Text className="font-bold text-text-main text-base">
                  {item.title}
                </Text>
                <Text className="text-xs text-text-muted">{item.category}</Text>
              </View>

              <View
                className={cn(
                  "w-6 h-6 rounded-full border-2 items-center justify-center",
                  isSelected
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300",
                )}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View className="absolute bottom-6 left-4 right-4">
        <Button
          title={saving ? "Збереження..." : `Зберегти (${selectedIds.length})`}
          onPress={handleSave}
          disabled={saving}
        />
      </View>
    </Screen>
  );
}
