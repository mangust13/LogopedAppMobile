import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { useChildStore } from "../../../store/childStore";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";

type Props = NativeStackScreenProps<GamesStackParamList, "PreparationGame">;

export function PreparationGameScreen({ navigation, route }: Props) {
  const { title, instruction, durationSec, difficulty } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина не вибрана");

  const [isRunning, setIsRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState<string>("mock-session");

  const startSession = () => {
    setSessionId(`prep-${Date.now()}`);
    setAccuracy(0);
    setSuccess(false);
    setModalVisible(false);
    setIsRunning(true);
    setResetKey((prev) => prev + 1);
  };

  const finishByTimer = () => {
    const mockAccuracy = Math.floor(65 + Math.random() * 31);
    setAccuracy(mockAccuracy);
    setSuccess(mockAccuracy >= 75);
    setIsRunning(false);
    setModalVisible(true);
  };

  return (
    <Screen>
      <GameSessionHeader title={title} childName={childName} onExit={() => navigation.goBack()} />

      <GameTimer
        mode="countdown"
        seconds={durationSec}
        isRunning={isRunning}
        resetKey={resetKey}
        onComplete={finishByTimer}
      />

      <View style={styles.card}>
        <Text style={styles.label}>Інструкція</Text>
        <Text style={styles.text}>{instruction}</Text>
        <Text style={styles.meta}>Складність: {difficulty}</Text>

        <Pressable style={styles.startButton} onPress={startSession}>
          <Text style={styles.startText}>{isRunning ? "Перезапустити" : "Почати"}</Text>
        </Pressable>
      </View>

      <GameResultModal
        visible={modalVisible}
        success={success}
        accuracy={accuracy}
        sessionId={sessionId}
        onRetry={startSession}
        onFinish={() => {
          setModalVisible(false);
          navigation.goBack();
        }}
        onGoToProgress={() => {
          setModalVisible(false);
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
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1a202c",
  },
  meta: {
    fontSize: 13,
    color: "#4a5568",
  },
  startButton: {
    marginTop: 4,
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
});
