// src\screens\games\differentiation\DifferentiationGameScreen.tsx

import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { useChildStore } from "../../../store/childStore";
import { ChoiceCard } from "./components/ChoiceCard";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";

type Props = NativeStackScreenProps<GamesStackParamList, "DifferentiationGame">;

export function DifferentiationGameScreen({ navigation, route }: Props) {
  const { title, prompt, options, correctAnswer } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина");

  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setStarted(true);
    setRunning(true);
    setSelected(null);
    setAccuracy(0);
    setShowResult(false);
    setResetKey((prev) => prev + 1);
  };

  const handleChoice = (value: string) => {
    if (!running) return;

    setSelected(value);

    const correct = value.toLowerCase() === correctAnswer.toLowerCase();
    const mockAccuracy = correct ? 100 : 0;
    setAccuracy(mockAccuracy);

    // Затримка перед показом результату
    setTimeout(() => {
      setRunning(false);
      setShowResult(true);
    }, 800);
  };

  return (
    <Screen>
      <GameSessionHeader
        title={title}
        childName={childName}
        onExit={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-6">
          <GameTimer
            mode="countdown"
            seconds={40}
            isRunning={running}
            resetKey={resetKey}
            onComplete={() => {
              setAccuracy(0);
              setRunning(false);
              setShowResult(true);
            }}
          />
        </View>

        <Card className="p-5 mb-6">
          <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Завдання
          </Text>
          <Text className="text-xl font-bold text-text-main mb-6 leading-7">
            {prompt}
          </Text>

          {!started ? (
            <View className="py-4 items-center">
              <Text className="text-text-muted text-center mb-4">
                Натисніть "Почати", щоб побачити варіанти відповідей.
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {options.map((option) => {
                const isSelected = selected === option;
                return (
                  <ChoiceCard
                    key={option}
                    label={option}
                    selected={isSelected}
                    correct={
                      isSelected &&
                      option.toLowerCase() === correctAnswer.toLowerCase()
                    }
                    disabled={!running}
                    onPress={() => handleChoice(option)}
                  />
                );
              })}
            </View>
          )}
        </Card>

        {!started && <Button title="Почати гру" onPress={startGame} />}
      </ScrollView>

      <GameResultModal
        visible={showResult}
        success={accuracy >= 75}
        accuracy={accuracy}
        sessionId={`diff-${Date.now()}`}
        onRetry={startGame}
        onFinish={() => {
          setShowResult(false);
          navigation.goBack();
        }}
        onGoToProgress={() => {
          setShowResult(false);
          navigation.getParent()?.navigate("Progress" as never);
        }}
      />
    </Screen>
  );
}
