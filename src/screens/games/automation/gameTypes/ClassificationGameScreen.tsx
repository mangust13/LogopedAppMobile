import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";
import { GameProgressBar } from "../../../../shared/ui/GameProgressBar";
import { InstructionButton } from "../../../../shared/ui/InstructionButton";
import { useSessionInstruction } from "../../../../hooks/useSessionInstruction";

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

export function ClassificationGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;
  const { width, height } = useWindowDimensions();

  const categoryCardWidth = (width - 60) / 2;
  const itemCardHeight = Math.min(height * 0.32, 260);
  const categoryCardHeight = Math.min(height * 0.22, 165);
  const imageSize = Math.min(width * 0.34, 130);

  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);

  const { showInstruction, openInstruction, closeInstruction } =
    useSessionInstruction("ClassificationGame");

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
        <VoiceInstruction text={instructionText} onClose={closeInstruction} />
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
        <View className="flex-1 px-5 pt-4 pb-5">
          <View
            className="bg-white rounded-[28px] shadow-sm px-5 py-5 mb-4 items-center"
            style={{ height: itemCardHeight }}
          >
            <Text className="text-xl text-gray-800 font-bold mb-3">
              Оберіть групу
            </Text>

            {currentItem && (
              <View className="flex-1 w-full items-center justify-center">
                <Image
                  source={{ uri: currentItem.image }}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    marginBottom: 10,
                  }}
                  resizeMode="contain"
                />

                <Text
                  className="text-3xl font-bold text-gray-800 text-center"
                  numberOfLines={2}
                  adjustsFontSizeToFit
                >
                  {currentItem.word}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row justify-between mb-4">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="rounded-[28px] justify-center items-center shadow-lg relative"
                style={{
                  width: categoryCardWidth,
                  height: categoryCardHeight,
                  backgroundColor: category.color,
                  opacity: showFeedback ? 0.7 : 1,
                }}
                onPress={() => handleCategorySelect(category.id)}
                disabled={!!showFeedback}
              >
                <Ionicons name={category.icon as any} size={52} color="#fff" />

                <Text className="text-white text-xl font-bold mt-3">
                  {category.name}
                </Text>

                <View className="absolute top-3 right-3 bg-white/30 rounded-full px-3 py-1">
                  <Text className="text-white text-base font-bold">
                    {category.items.length}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-1" />

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

          <GameProgressBar
            current={score}
            total={mockItems.length}
            correct={score}
            incorrect={mistakes}
            onRestart={initGame}
          />
        </View>
      )}

      {!showInstruction && !completed && (
        <InstructionButton onPress={openInstruction} bottom={110} />
      )}

      {!showInstruction && completed && (
        <InstructionButton onPress={openInstruction} bottom={24} />
      )}
    </Screen>
  );
}
