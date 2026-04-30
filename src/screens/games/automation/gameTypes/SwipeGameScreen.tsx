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

  const instructionText =
    "Подивіться на картинку. Оберіть веселий зелений смайлик або проведіть вправо, щоб відповісти правильно. Оберіть сумний червоний смайлик або проведіть вліво, щоб відповісти неправильно.";

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
          source={{ uri: item.imageUrl }}
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
          <View className="flex-1 justify-center items-center px-8">
            <Ionicons name="trophy" size={80} color="#FFD700" />

            <Text className="text-3xl font-bold text-gray-800 mt-5 text-center">
              Гру завершено! 🎉
            </Text>

            <Text className="text-base text-gray-600 text-center mt-2">
              Правильно: {correctCount}/{deck.length}
            </Text>

            <Text className="text-base text-red-500 text-center mt-1">
              Помилок: {incorrectCount}
            </Text>

            {wrongItems.length > 0 && !retryMode && (
              <TouchableOpacity
                className="bg-primary w-64 py-4 rounded-xl mt-8"
                onPress={retryWrongAnswers}
                activeOpacity={0.85}
              >
                <Text className="text-white text-lg font-bold text-center">
                  Повторити помилки
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="bg-red-500 w-64 py-4 rounded-xl mt-4"
              onPress={initGame}
              activeOpacity={0.85}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                <Text className="text-white text-lg font-bold ml-2">
                  Почати заново
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 px-4 pt-3 pb-24">
            <View className="flex-1 justify-center items-center">
              <View className="w-full h-[82%]">
                <GestureDetector gesture={panGesture}>
                  {renderCard() as React.ReactElement}
                </GestureDetector>
              </View>

              <View className="flex-row items-center justify-center mt-5">
                <TouchableOpacity
                  onPress={() => handleAnswer(false, "left")}
                  disabled={!!showFeedback}
                  className="w-20 h-20 rounded-full bg-red-500 items-center justify-center mx-5 shadow-lg"
                  activeOpacity={0.85}
                >
                  <Ionicons name="sad" size={42} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleAnswer(true, "right")}
                  disabled={!!showFeedback}
                  className="w-20 h-20 rounded-full bg-green-500 items-center justify-center mx-5 shadow-lg"
                  activeOpacity={0.85}
                >
                  <Ionicons name="happy" size={42} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {showFeedback && (
              <View className="absolute inset-0 items-center justify-center pointer-events-none">
                <View
                  className={`w-24 h-24 rounded-full items-center justify-center ${
                    showFeedback === "correct" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <Ionicons
                    name={showFeedback === "correct" ? "checkmark" : "close"}
                    size={60}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            )}

            <GameProgressBar
              current={currentProgress}
              total={deck.length}
              correct={correctCount}
              incorrect={incorrectCount}
              onRestart={initGame}
              onInstructionPress={openInstruction}
            />
          </View>
        )}
      </Screen>
    </GestureHandlerRootView>
  );
}
