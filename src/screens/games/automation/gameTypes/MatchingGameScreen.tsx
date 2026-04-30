import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Pressable,
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
import { soundCardsApi, SoundCardDto } from "../../../../api/soundCardsApi";

type Props = NativeStackScreenProps<GamesStackParamList, "MatchingGame">;

const GRID_COLS = 2;
const GRID_ROWS = 3;
const CARD_MARGIN = 8;
const HORIZONTAL_PADDING = 20;
const TOP_CONTENT_HEIGHT = 70;
const BOTTOM_CONTENT_HEIGHT = 150;
const CARD_SCALE = 1;
const PAIRS_PER_LEVEL = 3;
const TOTAL_LEVELS = 5;

type Card = {
  uid: string;
  cardId: number;
  word: string;
  imageUrl: string;
  flipped: boolean;
  matched: boolean;
};

export function MatchingGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;
  const { width, height } = useWindowDimensions();

  const maxCardWidth =
    (width - HORIZONTAL_PADDING - CARD_MARGIN * GRID_COLS * 2) / GRID_COLS;
  const maxCardHeight =
    (height -
      TOP_CONTENT_HEIGHT -
      BOTTOM_CONTENT_HEIGHT -
      CARD_MARGIN * GRID_ROWS * 2) /
    GRID_ROWS;
  const cardSize = Math.floor(
    Math.min(maxCardWidth, maxCardHeight) * CARD_SCALE,
  );
  const gridWidth = (cardSize + CARD_MARGIN * 2) * GRID_COLS;

  const [allCards, setAllCards] = useState<SoundCardDto[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const { showInstruction, openInstruction, closeInstruction } =
    useSessionInstruction("MatchingGame");

  const instructionText =
    "Натискайте на картки, відкривайте їх і знайдіть дві однакові картинки.";

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const data = await soundCardsApi.getBySound(sound);
      setAllCards(data);
      buildLevel(data, 1);
    } catch (e) {
      console.log("Error loading cards:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const buildLevel = (data: SoundCardDto[], lvl: number) => {
    const startIndex = (lvl - 1) * PAIRS_PER_LEVEL;
    const levelCards = data.slice(startIndex, startIndex + PAIRS_PER_LEVEL);

    const gameCards: Card[] = [];
    levelCards.forEach((c) => {
      gameCards.push(
        {
          uid: `${c.id}-a`,
          cardId: c.id,
          word: c.word,
          imageUrl: c.imageUrl,
          flipped: false,
          matched: false,
        },
        {
          uid: `${c.id}-b`,
          cardId: c.id,
          word: c.word,
          imageUrl: c.imageUrl,
          flipped: false,
          matched: false,
        },
      );
    });

    setCards(shuffleArray(gameCards));
    setFlippedUids([]);
    setMoves(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setLevelCompleted(false);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardPress = (uid: string) => {
    if (isChecking) return;

    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;
    if (flippedUids.length >= 2) return;

    const newCards = cards.map((c) =>
      c.uid === uid ? { ...c, flipped: true } : c,
    );
    setCards(newCards);

    const newFlipped = [...flippedUids, uid];
    setFlippedUids(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstUid, secondUid] = newFlipped;
      const first = newCards.find((c) => c.uid === firstUid)!;
      const second = newCards.find((c) => c.uid === secondUid)!;

      if (first.cardId === second.cardId) {
        const matched = newCards.map((c) =>
          c.uid === firstUid || c.uid === secondUid
            ? { ...c, matched: true }
            : c,
        );

        setCorrectCount((prev) => prev + 1);
        setCards(matched);
        setFlippedUids([]);
        setIsChecking(false);

        if (matched.every((c) => c.matched)) {
          setLevelCompleted(true);
          if (level >= TOTAL_LEVELS) {
            setGameCompleted(true);
          }
        }
      } else {
        setIncorrectCount((prev) => prev + 1);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === firstUid || c.uid === secondUid
                ? { ...c, flipped: false }
                : c,
            ),
          );
          setFlippedUids([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const goToNextLevel = () => {
    const nextLevel = level + 1;
    setLevel(nextLevel);
    buildLevel(allCards, nextLevel);
  };

  const restartGame = () => {
    setLevel(1);
    setGameCompleted(false);
    buildLevel(allCards, 1);
  };

  const renderCard = (card: Card) => {
    const isOpen = card.flipped || card.matched;
    const backgroundColor = isOpen
      ? card.matched
        ? "#DCFCE7"
        : "#FFFFFF"
      : "#6C63FF";
    const borderColor = isOpen
      ? card.matched
        ? "#86EFAC"
        : "#E5E7EB"
      : "#6C63FF";

    return (
      <View
        key={card.uid}
        style={{
          width: cardSize,
          height: cardSize,
          margin: CARD_MARGIN,
          borderRadius: 24,
          backgroundColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.14,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Pressable
          onPress={() => handleCardPress(card.uid)}
          disabled={isOpen || isChecking}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor,
            borderWidth: isOpen ? 2 : 0,
            borderColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isOpen ? (
            <Image
              source={{ uri: card.imageUrl }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 22,
              }}
              resizeMode="cover"
            />
          ) : (
            <Text
              className="font-bold text-white"
              style={{ fontSize: cardSize * 0.42 }}
            >
              {sound.toUpperCase()}
            </Text>
          )}
        </Pressable>
      </View>
    );
  };

  if (isLoading) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Знайди однакові"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      </Screen>
    );
  }

  if (gameCompleted) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Знайди однакові"
          onBackPress={() => navigation.goBack()}
        />

        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="trophy" size={80} color="#FFD700" />

          <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
            Всі рівні пройдено! 🎉
          </Text>

          <Text className="text-base text-gray-600 mt-2 text-center">
            Ти знайшов всі пари у {TOTAL_LEVELS} рівнях
          </Text>

          <Text className="text-base text-gray-600 mt-1 text-center">
            Останній рівень: {moves} ходів
          </Text>

          <TouchableOpacity
            className="bg-green-500 w-64 py-4 rounded-xl mt-8"
            onPress={restartGame}
            activeOpacity={0.85}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text className="text-white text-lg font-bold ml-2">
                Грати знову
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  if (levelCompleted) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Знайди однакові"
          onBackPress={() => navigation.goBack()}
        />

        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />

          <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
            Рівень {level} пройдено! ✅
          </Text>

          <Text className="text-lg text-gray-600 mt-2 text-center">
            Ходів: {moves}
          </Text>

          <TouchableOpacity
            className="bg-primary w-64 py-4 rounded-xl mt-8"
            onPress={goToNextLevel}
            activeOpacity={0.85}
          >
            <Text className="text-white text-lg font-bold text-center">
              Наступний рівень →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 w-64 py-4 rounded-xl mt-4"
            onPress={restartGame}
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
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Знайди однакові"
        onBackPress={() => navigation.goBack()}
      />

      {showInstruction && (
        <VoiceInstruction text={instructionText} onClose={closeInstruction} />
      )}

      <View className="flex-1 px-2 pb-24">
        <View className="flex-1 items-center" style={{ paddingTop: 10 }}>
          <View
            className="flex-row flex-wrap justify-center items-center"
            style={{ width: gridWidth }}
          >
            {cards.map((card) => renderCard(card))}
          </View>
        </View>

        <GameProgressBar
          current={level}
          total={TOTAL_LEVELS}
          correct={correctCount}
          incorrect={incorrectCount}
          moves={moves}
          onRestart={restartGame}
          onInstructionPress={openInstruction}
          label="Рівень"
        />
      </View>
    </Screen>
  );
}
