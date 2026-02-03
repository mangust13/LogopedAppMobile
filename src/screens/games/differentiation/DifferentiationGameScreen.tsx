import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { useChildStore } from "../../../store/childStore";
import { ChoiceCard } from "./components/ChoiceCard";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";

type Props = NativeStackScreenProps<GamesStackParamList, "DifferentiationGame">;

export function DifferentiationGameScreen({ navigation, route }: Props) {
  const { title, prompt, options, correctAnswer } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина не вибрана");

  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [accuracy, setAccuracy] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const startGame = () => {
    setStarted(true);
    setRunning(true);
    setSelected(null);
    setFeedback("");
    setAccuracy(0);
    setShowResult(false);
    setResetKey((prev) => prev + 1);
  };

  const handleChoice = (value: string) => {
    if (!running) {
      return;
    }

    setSelected(value);

    const correct = value.toLowerCase() === correctAnswer.toLowerCase();
    setFeedback(correct ? "Правильно!" : "Спробуй ще раз.");

    const mockAccuracy = correct ? 92 : 58;
    setAccuracy(mockAccuracy);

    setTimeout(() => {
      setRunning(false);
      setShowResult(true);
    }, 450);
  };

  return (
    <Screen>
      <GameSessionHeader title={title} childName={childName} onExit={() => navigation.goBack()} />

      <GameTimer mode="countdown" seconds={40} isRunning={running} resetKey={resetKey} />

      <View style={styles.card}>
        <Text style={styles.label}>Інструкція</Text>
        <Text style={styles.prompt}>{prompt}</Text>

        <Pressable style={styles.startButton} onPress={startGame}>
          <Text style={styles.startText}>{started ? "Почати знову" : "Почати"}</Text>
        </Pressable>

        <View style={styles.choices}>
          {options.map((option) => {
            const isSelected = selected === option;
            return (
              <ChoiceCard
                key={option}
                label={option}
                selected={isSelected}
                correct={isSelected && option.toLowerCase() === correctAnswer.toLowerCase()}
                disabled={!running}
                onPress={() => handleChoice(option)}
              />
            );
          })}
        </View>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    gap: 10,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#718096",
    fontWeight: "700",
  },
  prompt: {
    fontSize: 15,
    color: "#1a202c",
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: "#2f855a",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  startText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  choices: {
    gap: 8,
    marginTop: 2,
  },
  feedback: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c5282",
    marginTop: 4,
  },
});
