import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../../navigation/games/GamesStack";
import { Ionicons } from "@expo/vector-icons";
import { BackHeader } from "../../../../shared/ui/BackHeader";
import { VoiceInstruction } from "../../../../shared/ui/VoiceInstruction";

type Props = NativeStackScreenProps<GamesStackParamList, "MatchingGame">;

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 80) / 3;

type Card = {
  id: number;
  word: string;
  image: string;
  flipped: boolean;
  matched: boolean;
};

export function MatchingGameScreen({ navigation, route }: Props) {
  const { sound } = route.params;

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);

  const mockWords = [
    { id: 1, word: "Абрикос", image: "https://via.placeholder.com/150" },
    { id: 2, word: "Ананас", image: "https://via.placeholder.com/150" },
    { id: 3, word: "Автобус", image: "https://via.placeholder.com/150" },
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
      const card1: Card = {
        id: word.id * 2 - 1,
        word: word.word,
        image: word.image,
        flipped: false,
        matched: false,
      };

      const card2: Card = {
        id: word.id * 2,
        word: word.word,
        image: word.image,
        flipped: false,
        matched: false,
      };

      gameCards.push(card1, card2);
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

      const firstCardIndex = newFlippedCards[0];
      const secondCardIndex = newFlippedCards[1];

      if (newCards[firstCardIndex].word === newCards[secondCardIndex].word) {
        newCards[firstCardIndex].matched = true;
        newCards[secondCardIndex].matched = true;
        setCards([...newCards]);
        setFlippedCards([]);

        if (newCards.every((card) => card.matched)) {
          setCompleted(true);
        }
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstCardIndex].flipped = false;
          resetCards[secondCardIndex].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const renderCard = (card: Card) => {
    return (
      <TouchableOpacity
        key={card.id}
        className={`rounded-xl justify-center items-center shadow-lg ${
          card.flipped || card.matched
            ? card.matched
              ? "bg-green-200"
              : "bg-white"
            : "bg-blue-400"
        }`}
        style={{ width: CARD_SIZE, height: CARD_SIZE, margin: 5 }}
        onPress={() => handleCardPress(card.id)}
        disabled={card.flipped || card.matched}
      >
        {card.flipped || card.matched ? (
          <View className="items-center p-2">
            <Image
              source={{ uri: card.image }}
              style={{ width: CARD_SIZE - 30, height: CARD_SIZE - 50 }}
              className="object-contain"
            />
            <Text className="text-sm font-bold text-center mt-1">
              {card.word}
            </Text>
          </View>
        ) : (
          <View className="w-full h-full justify-center items-center">
            <Text className="text-3xl font-bold text-white">{sound}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Знайди однакові"
        onBackPress={() => navigation.goBack()}
      />

      {showInstruction && (
        <VoiceInstruction
          text={instructionText}
          onClose={() => setShowInstruction(false)}
        />
      )}

      <View className="flex-1 p-5">
        {completed ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text className="text-2xl font-bold text-gray-800 mt-5">
              Вітаємо!
            </Text>
            <Text className="text-lg text-gray-600 mt-2">
              Ви знайшли всі пари за {moves} ходів
            </Text>
            <TouchableOpacity
              className="bg-green-500 px-8 py-4 rounded-xl mt-8"
              onPress={initGame}
            >
              <Text className="text-white text-lg font-bold">Грати знову</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="mb-5 items-center">
              <Text className="text-lg text-gray-800">Ходів: {moves}</Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-2">
              {cards.map((card) => renderCard(card))}
            </View>

            <TouchableOpacity
              className="bg-red-400 py-3 px-6 rounded-xl mt-8 self-center"
              onPress={initGame}
            >
              <Text className="text-white font-bold">Почати заново</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {!showInstruction && (
        <TouchableOpacity
          className="absolute right-5 bottom-6 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
          onPress={() => setShowInstruction(true)}
        >
          <Ionicons name="help" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </Screen>
  );
}
