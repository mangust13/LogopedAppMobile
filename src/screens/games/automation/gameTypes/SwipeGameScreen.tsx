import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<GamesStackParamList, "SwipeGame">;
type FeedbackType = "correct" | "incorrect" | null;

type SwipeItem = {
  id: number;
  word: string;
  image: string;
};

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export function SwipeGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;

  const [deck, setDeck] = useState<SwipeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showFeedback, setShowFeedback] = useState<FeedbackType>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<SwipeItem[]>([]);
  const [retryMode, setRetryMode] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ["-10deg", "0deg", "10deg"],
    extrapolate: "clamp",
  });

  const allImages: SwipeItem[] = [
    { id: 1, word: "Абрикос", image: "https://via.placeholder.com/400" },
    { id: 2, word: "Ананас", image: "https://via.placeholder.com/400" },
    { id: 3, word: "Автобус", image: "https://via.placeholder.com/400" },
    { id: 4, word: "Акула", image: "https://via.placeholder.com/400" },
    { id: 5, word: "Банан", image: "https://via.placeholder.com/400" },
    { id: 6, word: "Кіт", image: "https://via.placeholder.com/400" },
    { id: 7, word: "Лимон", image: "https://via.placeholder.com/400" },
    { id: 8, word: "Мишка", image: "https://via.placeholder.com/400" },
  ];

  const instructionText = `Подивіться на картинку. Якщо слово починається на звук ${sound}, оберіть вправо. Якщо ні — вліво.`;

  useEffect(() => {
    initGame();
  }, []);

  const normalizeValue = (value: string) => value.trim().toLowerCase();

  const isMatchBySound = (word: string) =>
    normalizeValue(word).startsWith(normalizeValue(sound));

  const shuffleArray = (array: SwipeItem[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const initGame = () => {
    setDeck(shuffleArray(allImages));
    setCurrentIndex(0);
    setCompleted(false);
    setShowFeedback(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setWrongItems([]);
    setRetryMode(false);
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleAnswer = (pickedMatch: boolean, direction: "left" | "right") => {
    if (completed || showFeedback) return;

    const currentItem = deck[currentIndex];
    if (!currentItem) return;

    const isCorrect = pickedMatch === isMatchBySound(currentItem.word);

    setShowFeedback(isCorrect ? "correct" : "incorrect");

    Animated.timing(position, {
      toValue: { x: direction === "right" ? width : -width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (isCorrect) {
        setCorrectCount((p) => p + 1);
      } else {
        setIncorrectCount((p) => p + 1);
        setWrongItems((p) =>
          p.some((i) => i.id === currentItem.id) ? p : [...p, currentItem],
        );
      }

      const next = currentIndex + 1;

      if (next < deck.length) {
        setCurrentIndex(next);
      } else {
        setCompleted(true);
      }

      position.setValue({ x: 0, y: 0 });
      setShowFeedback(null);
    }, 800);
  };

  // ✅ NEW GESTURE API (заміна PanGestureHandler)
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
        className="w-full h-full rounded-3xl bg-white shadow-lg overflow-hidden"
        style={{
          transform: [{ translateX: position.x }, { rotate }],
        }}
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-4/5 object-cover"
        />
        <View className="p-4 items-center justify-center flex-1">
          <Text className="text-3xl font-bold text-gray-800">{item.word}</Text>
        </View>
      </Animated.View>
    );
  };

  const progress = completed
    ? deck.length
    : Math.min(currentIndex + 1, deck.length);

  const progressPercent = deck.length > 0 ? (progress / deck.length) * 100 : 0;

  return (
    <GestureHandlerRootView className="flex-1">
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Гортай картинки"
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
            <Ionicons
              name={
                wrongItems.length === 0 ? "checkmark-circle" : "refresh-circle"
              }
              size={80}
              color={wrongItems.length === 0 ? "#4CAF50" : "#F59E0B"}
            />

            <Text className="text-2xl font-bold mt-5 text-center">
              {wrongItems.length === 0
                ? "Вправу завершено!"
                : "Раунд завершено!"}
            </Text>
          </View>
        ) : (
          <View className="flex-1 px-5 pt-5 pb-28 items-center justify-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={{ width: width - 40, height: 420 }}
                className="items-center justify-center"
              >
                {renderCard()}
              </Animated.View>
            </GestureDetector>

            {/* buttons */}
            <View className="flex-row justify-center gap-6 mt-6">
              <TouchableOpacity
                className="w-16 h-16 rounded-full bg-red-400 justify-center items-center"
                onPress={() => handleAnswer(false, "left")}
              >
                <Ionicons name="sad" size={30} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-16 h-16 rounded-full bg-green-500 justify-center items-center"
                onPress={() => handleAnswer(true, "right")}
              >
                <Ionicons name="happy" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Screen>
    </GestureHandlerRootView>
  );
}
