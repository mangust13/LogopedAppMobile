import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";

type Props = NativeStackScreenProps<GamesStackParamList, "ClassificationGame">;

type Item = {
  id: number;
  word: string;
  image: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
  items: Item[];
};

type FeedbackType = "correct" | "incorrect" | null;

const { width } = Dimensions.get("window");

export function ClassificationGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);

  const mockItems: Item[] = [
    {
      id: 1,
      word: "Абрикос",
      image: "https://via.placeholder.com/150",
      category: "Фрукти",
    },
    {
      id: 2,
      word: "Ананас",
      image: "https://via.placeholder.com/150",
      category: "Фрукти",
    },
    {
      id: 3,
      word: "Автобус",
      image: "https://via.placeholder.com/150",
      category: "Транспорт",
    },
    {
      id: 4,
      word: "Автомобіль",
      image: "https://via.placeholder.com/150",
      category: "Транспорт",
    },
  ];

  const mockCategories: Category[] = [
    {
      id: "fruits",
      name: "Фрукти",
      color: "#FF6B6B",
      icon: "nutrition",
      items: [],
    },
    {
      id: "transport",
      name: "Транспорт",
      color: "#4ECDC4",
      icon: "car",
      items: [],
    },
  ];

  const instructionText =
    "Подивіться на картинку, скажіть слово і натисніть на правильну групу.";

  const total = mockItems.length;
  const remaining = Math.max(total - score, 0);
  const progressPercent = total > 0 ? (score / total) * 100 : 0;

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffledItems = [...mockItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
    setCategories(mockCategories.map((cat) => ({ ...cat, items: [] })));
    setCurrentItem(shuffledItems.length > 0 ? shuffledItems[0] : null);
    setCompleted(false);
    setScore(0);
    setMistakes(0);
    setShowFeedback(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    if (!currentItem || showFeedback) return;

    const targetCategory = mockCategories.find((cat) => cat.id === categoryId);
    if (!targetCategory) return;

    const isCorrect = currentItem.category === targetCategory.name;

    setShowFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      if (isCorrect) {
        setScore((prev) => prev + 1);

        const newCategories = categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, currentItem] }
            : cat,
        );
        setCategories(newCategories);

        const newItems = items.filter((item) => item.id !== currentItem.id);
        setItems(newItems);

        if (newItems.length > 0) {
          setCurrentItem(newItems[0]);
        } else {
          setCurrentItem(null);
          setCompleted(true);
        }
      } else {
        setMistakes((prev) => prev + 1);
      }

      setShowFeedback(null);
    }, 900);
  };

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Розклади по групах"
        onBackPress={() => navigation.goBack()}
      />

      {showInstruction && (
        <VoiceInstruction
          text={instructionText}
          onClose={() => setShowInstruction(false)}
        />
      )}

      {completed ? (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="trophy" size={80} color="#FFD700" />
          <Text className="text-3xl font-bold text-gray-800 mt-5">
            Вітаємо!
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Ви правильно розподілили всі картинки!
          </Text>
          <Text className="text-lg text-green-500 font-bold mt-4">
            Правильно: {score}/{mockItems.length}
          </Text>
          <Text className="text-base text-red-500 mt-1">
            Помилок: {mistakes}
          </Text>
          <TouchableOpacity
            className="bg-green-500 px-8 py-4 rounded-xl mt-8"
            onPress={initGame}
          >
            <Text className="text-white text-lg font-bold">Грати знову</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-5 pt-5 pb-24">
          <View className="items-center bg-white p-5 rounded-2xl mb-5 shadow-sm">
            <Text className="text-lg text-gray-800 mb-5 font-semibold">
              Оберіть групу
            </Text>

            {currentItem && (
              <View className="items-center">
                <Image
                  source={{ uri: currentItem.image }}
                  className="w-32 h-32 object-contain mb-3"
                />
                <Text className="text-xl font-bold text-gray-800">
                  {currentItem.word}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row justify-between mb-8">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="rounded-2xl justify-center items-center shadow-lg relative"
                style={{
                  width: (width - 60) / 2,
                  height: 120,
                  backgroundColor: category.color,
                  opacity: showFeedback ? 0.7 : 1,
                }}
                onPress={() => handleCategorySelect(category.id)}
                disabled={!!showFeedback}
              >
                <Ionicons name={category.icon as any} size={40} color="#fff" />
                <Text className="text-white text-base font-bold mt-2">
                  {category.name}
                </Text>
                <View className="absolute top-2 right-2 bg-white/30 rounded-xl px-2 py-1">
                  <Text className="text-white text-sm font-bold">
                    {category.items.length}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {showFeedback && (
            <View className="absolute inset-0 items-center justify-center px-8">
              <View
                className={`w-full rounded-[28px] px-6 py-7 items-center shadow-lg ${
                  showFeedback === "correct" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <View
                  className={`w-20 h-20 rounded-full items-center justify-center ${
                    showFeedback === "correct" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Ionicons
                    name={
                      showFeedback === "correct"
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={52}
                    color={showFeedback === "correct" ? "#16A34A" : "#DC2626"}
                  />
                </View>

                <Text
                  className={`text-2xl font-extrabold mt-4 ${
                    showFeedback === "correct"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {showFeedback === "correct" ? "Правильно!" : "Спробуй ще раз"}
                </Text>

                <Text
                  className={`text-base text-center mt-2 ${
                    showFeedback === "correct"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {showFeedback === "correct"
                    ? "Ти обрав правильну групу"
                    : "Це не та група для цієї картинки"}
                </Text>
              </View>
            </View>
          )}

          <View className="absolute left-4 right-4 bottom-4 bg-white rounded-2xl px-4 py-3 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View>
                <Text className="text-sm font-extrabold text-gray-900">
                  Прогрес: {score} з {total}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Залишилось: {remaining}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="checkmark" size={18} color="#6FCF97" />
                  <Text className="text-sm font-extrabold text-gray-900 ml-1">
                    {score}
                  </Text>
                </View>

                <View className="flex-row items-center mr-4">
                  <Ionicons name="close" size={18} color="#EB5757" />
                  <Text className="text-sm font-extrabold text-gray-900 ml-1">
                    {mistakes}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={initGame}
                  className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
                >
                  <Ionicons name="refresh" size={20} color="#EB5757" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>
        </View>
      )}

      {!showInstruction && (
        <TouchableOpacity
          className="absolute right-5 bottom-28 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
          onPress={() => setShowInstruction(true)}
        >
          <Ionicons name="help" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </Screen>
  );
}
