import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";
import { GameProgressBar } from "../../../../shared/ui/GameProgressBar";
import { useSessionInstruction } from "../../../../hooks/useSessionInstruction";
import { soundCardsApi } from "../../../../api/soundCardsApi";
import { progressApi } from "../../../../api/progressApi";

type Props = NativeStackScreenProps<GamesStackParamList, "ClassificationGame">;

type GameItem = {
  id: number;
  word: string;
  imageUrl: string;
  isAlive: boolean;
};

type Category = {
  isAlive: boolean;
  name: string;
  color: string;
  emoji: string;
  count: number;
};

type FeedbackType = "correct" | "incorrect" | null;

const CATEGORIES: Category[] = [
  { isAlive: false, name: "Неживе", color: "#FF9800", emoji: "🪨", count: 0 },
  { isAlive: true, name: "Живе", color: "#4CAF50", emoji: "🐾", count: 0 },
];

const MAX_MISTAKES = 5;

export function ClassificationGameScreen({ navigation, route }: Props) {
  const { sound, positionCode, childId } = route.params;
  const { width, height } = useWindowDimensions();

  const categoryCardWidth = (width - 44) / 2;
  const itemCardHeight = Math.min(height * 0.52, 420);
  const categoryCardHeight = Math.min(height * 0.13, 105);
  const imageSize = Math.min(width * 0.72, itemCardHeight * 0.68, 270);

  const [items, setItems] = useState<GameItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [alreadySaved, setAlreadySaved] = useState(false);

  const { showInstruction, openInstruction, closeInstruction } =
    useSessionInstruction("ClassificationGame");

  const instructionText =
    "Подивіться на картинку, скажіть слово і натисніть – живе це чи неживе.";

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const data = await soundCardsApi.getBySound(sound);
      const filtered = data.filter((c) => c.position.code === positionCode);

      const gameItems: GameItem[] = filtered.map((c) => ({
        id: c.id,
        word: c.word,
        imageUrl: c.imageUrl,
        isAlive: c.isAlive,
      }));

      const shuffled = [...gameItems].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setTotalItems(shuffled.length);
      setCategories(CATEGORIES.map((c) => ({ ...c, count: 0 })));
      setCurrentIndex(0);
      setCompleted(false);
      setFailed(false);
      setScore(0);
      setMistakes(0);
      setShowFeedback(null);
      setAlreadySaved(false);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (isAlive: boolean) => {
    if (showFeedback) return;
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    const isCorrect = currentItem.isAlive === isAlive;
    setShowFeedback(isCorrect ? "correct" : "incorrect");

    setTimeout(async () => {
      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        setCategories((prev) =>
          prev.map((c) =>
            c.isAlive === isAlive ? { ...c, count: c.count + 1 } : c,
          ),
        );

        const nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) {
          setCompleted(true);
          if (!alreadySaved) {
            setAlreadySaved(true);
            await progressApi.completeGame({
              childId,
              sound,
              positionCode,
              gameType: "ClassificationGame",
            });
          }
        } else {
          setCurrentIndex(nextIndex);
        }
      } else {
        const newMistakes = mistakes + 1;
        setMistakes(newMistakes);

        if (newMistakes >= MAX_MISTAKES) {
          setFailed(true);
        }
      }

      setShowFeedback(null);
    }, 900);
  };

  const currentItem = items[currentIndex];

  if (isLoading) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Розклади по групах"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      </Screen>
    );
  }

  if (failed) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Розклади по групах"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="close-circle" size={80} color="#EF4444" />

          <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
            Забагато помилок 😔
          </Text>

          <Text className="text-base text-gray-600 text-center mt-2">
            Ти зробив {MAX_MISTAKES} помилок. Спробуй ще раз!
          </Text>

          <Text className="text-sm text-gray-500 text-center mt-1">
            Правильно до зупинки: {score}
          </Text>

          <TouchableOpacity
            className="bg-primary w-64 py-4 rounded-xl mt-8"
            onPress={loadCards}
            activeOpacity={0.85}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text className="text-white text-lg font-bold ml-2">
                Спробувати знову
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-100 w-64 py-4 rounded-xl mt-3"
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text className="text-gray-700 text-lg font-bold text-center">
              До дорожньої карти
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (completed) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Розклади по групах"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="trophy" size={80} color="#FFD700" />

          <Text className="text-3xl font-bold text-gray-800 mt-5">
            Вітаємо! 🎉
          </Text>

          <Text className="text-base text-gray-600 text-center mt-2">
            Ви розподілили всі картинки!
          </Text>

          <Text className="text-lg text-green-500 font-bold mt-4">
            Правильно: {score}/{totalItems}
          </Text>

          <Text className="text-base text-red-500 mt-1">
            Помилок: {mistakes}/{MAX_MISTAKES}
          </Text>

          <Text className="text-sm text-gray-500 text-center mt-1">
            Гру зараховано ✓
          </Text>

          <View className="mt-6 w-full gap-2">
            {CATEGORIES.map((cat) => {
              const final = categories.find((c) => c.isAlive === cat.isAlive);
              return (
                <View
                  key={cat.name}
                  className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xl">{cat.emoji}</Text>
                    <Text className="text-gray-700 font-medium">
                      {cat.name}
                    </Text>
                  </View>
                  <Text className="text-gray-800 font-bold">
                    {final?.count ?? 0}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            className="bg-green-500 w-64 py-4 rounded-xl mt-8"
            onPress={loadCards}
            activeOpacity={0.85}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text className="text-white text-lg font-bold ml-2">
                Грати знову
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-100 w-64 py-4 rounded-xl mt-3"
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text className="text-gray-700 text-lg font-bold text-center">
              До дорожньої карти
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

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

      <View className="flex-1 px-4 pt-2 pb-24">
        <View
          className="bg-white rounded-[32px] shadow-sm px-4 py-4 mb-3 items-center"
          style={{ height: itemCardHeight }}
        >
          <Text className="text-xl text-gray-800 font-extrabold mb-2">
            Живе чи неживе?
          </Text>

          {currentItem && (
            <View className="flex-1 w-full items-center justify-center">
              <Image
                source={{ uri: currentItem.imageUrl }}
                style={{
                  width: imageSize,
                  height: imageSize,
                  marginBottom: 12,
                }}
                resizeMode="contain"
              />
              <Text
                className="text-3xl font-extrabold text-gray-800 text-center"
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {currentItem.word}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row justify-between gap-3 mb-28">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              className="rounded-[24px] justify-center items-center shadow-lg relative"
              style={{
                width: categoryCardWidth,
                height: categoryCardHeight,
                backgroundColor: category.color,
                opacity: showFeedback ? 0.7 : 1,
              }}
              onPress={() => handleCategorySelect(category.isAlive)}
              disabled={!!showFeedback}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 34 }}>{category.emoji}</Text>
              <Text className="text-white text-lg font-bold mt-1">
                {category.name}
              </Text>
              <View className="absolute top-2 right-2 bg-white/30 rounded-full px-2.5 py-0.5">
                <Text className="text-white text-sm font-bold">
                  {category.count}
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
                  showFeedback === "correct" ? "text-green-700" : "text-red-700"
                }`}
              >
                {showFeedback === "correct" ? "Правильно!" : "Спробуй ще раз"}
              </Text>

              {showFeedback === "incorrect" && currentItem && (
                <Text className="text-red-600 text-base text-center mt-2">
                  "{currentItem.word}" –{" "}
                  {currentItem.isAlive ? "живе 🐾" : "неживе 🪨"}
                </Text>
              )}
            </View>
          </View>
        )}

        <GameProgressBar
          current={score}
          total={totalItems}
          correct={score}
          incorrect={mistakes}
          onRestart={loadCards}
          onInstructionPress={openInstruction}
        />
      </View>
    </Screen>
  );
}
