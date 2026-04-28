// screens/games/preparation/LogopedCreateComplexScreen.tsx
import { useState, useEffect } from "react";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { exercisesApi } from "../../../api/exercisesApi";
import { ExerciseDto } from "../../../api/types/exercise";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";

type NavProp = NativeStackNavigationProp<
  GamesStackParamList,
  "LogopedCreateComplex"
>;
type RouteProps = RouteProp<GamesStackParamList, "LogopedCreateComplex">;

export function LogopedCreateComplexScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { complexId, isEditing, onComplexCreated } = route.params;

  const [exercises, setExercises] = useState<ExerciseDto[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [complexName, setComplexName] = useState("");
  const [complexDescription, setComplexDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadExercisesFromAllComplex();
    if (isEditing && complexId > 0) {
      loadComplexDetails();
    }
  }, [isEditing, complexId]);

  const loadExercisesFromAllComplex = async () => {
    try {
      setLoading(true);

      const complexes = await exercisesApi.getComplexes();
      const allComplex = complexes.find((c) => c.name === "all");

      if (allComplex) {
        const allComplexDetails = await exercisesApi.getComplexById(
          allComplex.id,
        );
        if (allComplexDetails && allComplexDetails.exercises) {
          setExercises(allComplexDetails.exercises);
        } else {
          const allExercises = await exercisesApi.getAll();
          setExercises(allExercises);
        }
      } else {
        const allExercises = await exercisesApi.getAll();
        setExercises(allExercises);
      }
    } catch (error) {
      console.error("Помилка завантаження вправ:", error);
      Alert.alert("Помилка", "Не вдалося завантажити вправи");
    } finally {
      setLoading(false);
    }
  };

  const loadComplexDetails = async () => {
    try {
      const complex = await exercisesApi.getComplexById(complexId);

      if (complex) {
        setComplexName(complex.displayName || "");
        setComplexDescription(complex.description || "");

        setSelectedExercises(complex.exercises.map((ex: ExerciseDto) => ex.id));
      }
    } catch (error) {
      console.error("Помилка завантаження деталей комплексу:", error);
    }
  };

  const toggleExercise = (exerciseId: number) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId],
    );
  };

  const saveComplex = async () => {
    if (!complexName.trim()) {
      Alert.alert("Помилка", "Введіть назву комплексу");
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert("Помилка", "Оберіть хоча б одну вправу");
      return;
    }

    try {
      setCreating(true);

      if (isEditing && complexId > 0) {
        await exercisesApi.updateComplex(complexId, {
          name: complexName.trim(),
          description: complexDescription.trim(),
          exerciseIds: selectedExercises,
        });

        Alert.alert("Успіх", "Комплекс оновлено успішно", [
          {
            text: "OK",
            onPress: () => {
              if (onComplexCreated) {
                onComplexCreated();
              }
              navigation.goBack();
            },
          },
        ]);
      } else {
        await exercisesApi.createComplex({
          name: complexName.trim(),
          description: complexDescription.trim(),
          exerciseIds: selectedExercises,
        });

        Alert.alert("Успіх", "Комплекс створено успішно", [
          {
            text: "OK",
            onPress: () => {
              if (onComplexCreated) {
                onComplexCreated();
              }
              navigation.pop(2);
            },
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Помилка",
        isEditing
          ? "Не вдалося оновити комплекс"
          : "Не вдалося створити комплекс",
      );
    } finally {
      setCreating(false);
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
      <BackHeader
        title={isEditing ? "Редагувати комплекс" : "Створити комплекс"}
      />

      <View className="p-4 border-b border-gray-200">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Назва комплексу
        </Text>
        <TextInput
          value={complexName}
          onChangeText={setComplexName}
          placeholder="Введіть назву комплексу"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">
          Опис (необов'язково)
        </Text>
        <TextInput
          value={complexDescription}
          onChangeText={setComplexDescription}
          placeholder="Введіть опис комплексу"
          multiline
          numberOfLines={3}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
        />

        <Text className="text-sm text-gray-600">
          Обрано: {selectedExercises.length} з {exercises.length} вправ
        </Text>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleExercise(item.id)}
            className={`flex-row items-center p-3 mb-2 rounded-lg border ${
              selectedExercises.includes(item.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                selectedExercises.includes(item.id)
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedExercises.includes(item.id) && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>

            <View className="flex-1">
              <Text className="font-medium text-gray-900">{item.title}</Text>
              {item.description && (
                <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <View className="p-4 border-t border-gray-200">
        <Button
          title={
            creating
              ? isEditing
                ? "Оновлення..."
                : "Створення..."
              : isEditing
                ? "Оновити комплекс"
                : "Створити комплекс"
          }
          onPress={saveComplex}
          disabled={creating || selectedExercises.length === 0}
        />
      </View>
    </Screen>
  );
}
