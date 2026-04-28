import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";
import { GameProgressBar } from "../../../../shared/ui/GameProgressBar";
import { InstructionButton } from "../../../../shared/ui/InstructionButton";
import { useSessionInstruction } from "../../../../hooks/useSessionInstruction";
import { soundCardsApi } from "../../../../api/soundCardsApi";

type Props = NativeStackScreenProps<GamesStackParamList, "SwipeGame">;
type FeedbackType = "correct" | "incorrect" | null;

type SwipeItem = {
  id: number;
  word: string;
  imageUrl: string;
  positionCode: number;
};

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export function SwipeGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;

  const [deck, setDeck] = useState<SwipeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<SwipeItem[]>([]);
  const [retryMode, setRetryMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { showInstruction, openInstruction, closeInstruction } =
    useSessionInstruction("SwipeGame");

  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const instructionText = `Подивіться на картинку. Оберіть веселий зелений смайлик або проведіть вправо, щоб відповісти правильно. Оберіть сумний червоний смайлик або проведіть вліво, щоб відповісти неправильно.`;

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
  }, [currentIndex]);

  const orderCards = (array: SwipeItem[]) =>
    [...array].sort(
      (a, b) =>
        a.positionCode - b.positionCode ||
        a.id - b.id ||
        a.word.localeCompare(b.word, "uk"),
    );

  const preloadImages = (items: SwipeItem[]) => {
    items.forEach((item) => Image.prefetch(item.imageUrl));
  };

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const cards = await soundCardsApi.getBySound(sound);
      const items: SwipeItem[] = cards.map((c) => ({
        id: c.id,
        word: c.word,
        imageUrl: c.imageUrl,
        positionCode: c.position.code,
      }));
      const orderedItems = orderCards(items);
      preloadImages(orderedItems);
      setDeck(orderedItems);
    } catch (e) {
      console.log("Error loading cards:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const initGame = () => {
    loadCards();
    setCurrentIndex(0);
    setCompleted(false);
    setShowFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setWrongItems([]);
    setRetryMode(false);
    position.setValue({ x: 0, y: 0 });
  };

  const retryWrongAnswers = () => {
    if (wrongItems.length === 0) return;

    const orderedWrongItems = orderCards(wrongItems);
    preloadImages(orderedWrongItems);

    setDeck(orderedWrongItems);
    setCurrentIndex(0);
    setCompleted(false);
    setShowFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setWrongItems([]);
    setRetryMode(true);
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleAnswer = (isCorrect: boolean, direction: "left" | "right") => {
    if (completed || showFeedback) return;

    const currentItem = deck[currentIndex];
    if (!currentItem) return;

    setShowFeedback(isCorrect ? "correct" : "incorrect");

    Animated.timing(position, {
      toValue: { x: direction === "right" ? width : -width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      setTimeout(() => {
        if (isCorrect) {
          setCorrectCount((prev) => prev + 1);
        } else {
          setIncorrectCount((prev) => prev + 1);
          setWrongItems((prev) =>
            prev.some((item) => item.id === currentItem.id)
              ? prev
              : [...prev, currentItem],
          );
        }

        const nextIndex = currentIndex + 1;

        if (nextIndex < deck.length) {
          setCurrentIndex(nextIndex);
        } else {
          setCompleted(true);
        }

        setShowFeedback(null);
      }, 350);
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (showFeedback || completed) return;
      position.x.setValue(e.translationX);
    })
    .onEnd((e) => {
      if (showFeedback || completed) return;

      if (e.translationX > SWIPE_THRESHOLD) {
        handleAnswer(true, "right");
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        handleAnswer(false, "left");
      } else {
        resetPosition();
      }
    });

  const renderCard = () => {
    const item = deck[currentIndex];
    if (!item) return null;

    return (
      <Animated.View
        key={item.id}
        className="w-full h-full rounded-3xl bg-white shadow-lg overflow-hidden"
        style={{
          transform: [{ translateX: position.x }, { rotate }],
        }}
      >
        <Image
          key={item.imageUrl}
          // source={{ uri: item.imageUrl }}
          source={{ uri: `${item.imageUrl}?t=${Date.now()}` }}
          className="w-full h-4/5"
          resizeMode="cover"
        />
        <View className="p-4 items-center justify-center flex-1">
          <Text className="text-3xl font-bold text-gray-800">{item.word}</Text>
        </View>
      </Animated.View>
    );
  };

  const currentProgress = completed
    ? deck.length
    : Math.min(currentIndex + 1, deck.length);

  if (isLoading) {
    return (
      <GestureHandlerRootView className="flex-1">
        <Screen>
          <BackHeader
            subtitle={`Звук ${sound}`}
            title="Гортай картинки"
            onBackPress={() => navigation.goBack()}
          />
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        </Screen>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Гортай картинки"
          onBackPress={() => navigation.goBack()}
        />

        {showInstruction && (
          <VoiceInstruction text={instructionText} onClose={closeInstruction} />
        )}

        {completed ? (
          <View className="flex-1 justify-center items-center p-8">
            <Ionicons
              name={
                wrongItems.length === 0 ? "checkmark-circle" : "refresh-circle"
              }
              size={80}
              color={wrongItems.length === 0 ? "#4CAF50" : "#F59E0B"}
            />
            <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
              {wrongItems.length === 0
                ? "Вправу завершено!"
                : "Раунд завершено!"}
            </Text>
            <Text className="text-base text-gray-600 mt-3 text-center">
              Правильно: {correctCount}
            </Text>
            <Text className="text-base text-gray-600 mt-1 text-center">
              Неправильно: {incorrectCount}
            </Text>

            {wrongItems.length > 0 && (
              <TouchableOpacity
                className="bg-orange-500 px-8 py-4 rounded-xl mt-8"
                onPress={retryWrongAnswers}
              >
                <Text className="text-white text-lg font-bold">
                  Пройти помилки ще раз
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-green-500 px-8 py-4 rounded-xl mt-4"
              onPress={initGame}
            >
              <Text className="text-white text-lg font-bold">Почати знову</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 px-5 pt-5 pb-24 items-center justify-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View
                className="items-center justify-center"
                style={{ width: width - 40, height: 420 }}
              >
                {renderCard()}
              </Animated.View>
            </GestureDetector>

            <View className="flex-row justify-center gap-10 mt-8">
              <TouchableOpacity
                className="w-20 h-20 rounded-full bg-red-400 justify-center items-center shadow-lg"
                onPress={() => handleAnswer(false, "left")}
                disabled={!!showFeedback}
              >
                <Ionicons name="sad" size={34} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-20 h-20 rounded-full bg-green-500 justify-center items-center shadow-lg"
                onPress={() => handleAnswer(true, "right")}
                disabled={!!showFeedback}
              >
                <Ionicons name="happy" size={34} color="#fff" />
              </TouchableOpacity>
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
                    {showFeedback === "correct"
                      ? "Правильно, молодець!"
                      : "Неправильно!"}
                  </Text>
                </View>
              </View>
            )}

            <GameProgressBar
              current={currentProgress}
              total={deck.length}
              correct={correctCount}
              incorrect={incorrectCount}
              onRestart={initGame}
              label={retryMode ? "Повтор помилок" : "Прогрес"}
            />
          </View>
        )}

        {!showInstruction && !completed && (
          <InstructionButton onPress={openInstruction} />
        )}

        {!showInstruction && completed && (
          <InstructionButton onPress={openInstruction} bottom={24} />
        )}
      </Screen>
    </GestureHandlerRootView>
  );
}
