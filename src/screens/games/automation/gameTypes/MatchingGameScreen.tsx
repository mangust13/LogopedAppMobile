import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";
import { InstructionButton } from "../../../../shared/ui/InstructionButton";
import { useSessionInstruction } from "../../../../hooks/useSessionInstruction";

type Props = NativeStackScreenProps<GamesStackParamList, "MatchingGame">;

const GRID_COLS = 2;
const GRID_ROWS = 3;
const CARD_MARGIN = 10;
const HORIZONTAL_PADDING = 40;
const TOP_CONTENT_HEIGHT = 80;
const BOTTOM_CONTENT_HEIGHT = 230;
const CARD_SCALE = 0.88;

type Card = {
  id: number;
  word: string;
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

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  const { showInstruction, openInstruction, closeInstruction } =
    useSessionInstruction("MatchingGame");

  const mockWords = [
    { id: 1, word: "Абрикос" },
    { id: 2, word: "Ананас" },
    { id: 3, word: "Автобус" },
  ];

  const instructionText =
    "Натискайте на картки, відкривайте їх і знайдіть дві однакові.";

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const selectedWords = mockWords.slice(0, 3);
    let gameCards: Card[] = [];

    selectedWords.forEach((word) => {
      gameCards.push(
        {
          id: word.id * 2 - 1,
          word: word.word,
          flipped: false,
          matched: false,
        },
        {
          id: word.id * 2,
          word: word.word,
          flipped: false,
          matched: false,
        },
      );
    });

    gameCards = shuffleArray(gameCards);
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setCompleted(false);
  };

  const shuffleArray = (array: Card[]) => {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
  };

  const handleCardPress = (id: number) => {
    if (flippedCards.length === 2) return;

    const newCards = [...cards];
    const cardIndex = newCards.findIndex((card) => card.id === id);

    if (cardIndex === -1) return;
    if (newCards[cardIndex].flipped || newCards[cardIndex].matched) return;

    newCards[cardIndex].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardIndex];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [first, second] = newFlippedCards;

      if (newCards[first].word === newCards[second].word) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards([...newCards]);
        setFlippedCards([]);

        if (newCards.every((card) => card.matched)) {
          setCompleted(true);
        }
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const renderCard = (card: Card) => (
    <TouchableOpacity
      key={card.id}
      onPress={() => handleCardPress(card.id)}
      disabled={card.flipped || card.matched}
      style={{
        width: cardSize,
        height: cardSize,
        margin: CARD_MARGIN,
      }}
      className={`rounded-2xl justify-center items-center shadow-sm ${
        card.matched
          ? "bg-green-200"
          : card.flipped
            ? "bg-white border-2 border-gray-200"
            : "bg-primary"
      }`}
    >
      {card.flipped || card.matched ? (
        <Text
          className="font-bold text-gray-800 text-center px-2"
          style={{ fontSize: cardSize * 0.18 }}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {card.word}
        </Text>
      ) : (
        <Text
          className="font-bold text-white"
          style={{ fontSize: cardSize * 0.4 }}
        >
          {sound.toUpperCase()}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (completed) {
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

        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />

          <Text className="text-2xl font-bold text-gray-800 mt-5 text-center">
            Вітаємо!
          </Text>

          <Text className="text-lg text-gray-600 mt-2 text-center">
            Ви знайшли всі пари за {moves} ходів
          </Text>

          <TouchableOpacity
            className="bg-green-500 px-8 py-4 rounded-xl mt-8"
            onPress={initGame}
          >
            <Text className="text-white text-lg font-bold">Грати знову</Text>
          </TouchableOpacity>
        </View>

        {!showInstruction && (
          <InstructionButton onPress={openInstruction} bottom={24} />
        )}
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

      <View className="flex-1 px-5 pb-6">
        <Text className="text-center text-xl text-gray-600 mt-3 mb-2">
          Ходів: {moves}
        </Text>

        <View className="flex-1 justify-center items-center">
          <View
            className="flex-row flex-wrap justify-center items-center"
            style={{ width: gridWidth }}
          >
            {cards.map((card) => renderCard(card))}
          </View>
        </View>

        <View className="h-28" />

        <TouchableOpacity
          className="bg-red-400 py-4 rounded-2xl items-center"
          onPress={initGame}
        >
          <Text className="text-white font-bold text-base">Почати заново</Text>
        </TouchableOpacity>
      </View>

      {!showInstruction && (
        <InstructionButton onPress={openInstruction} bottom={104} />
      )}
    </Screen>
  );
}
