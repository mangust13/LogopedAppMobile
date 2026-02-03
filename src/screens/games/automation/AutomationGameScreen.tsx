import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { useChildStore } from "../../../store/childStore";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";
import { LevelSelector } from "./components/LevelSelector";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationGame">;

export function AutomationGameScreen({ navigation, route }: Props) {
  const { sound, position, level } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина не вибрана");

  const [selectedLevel, setSelectedLevel] = useState(level);
  const [attempts, setAttempts] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  const success = useMemo(() => accuracy >= 75, [accuracy]);

  const startSession = () => {
    setAttempts((prev) => prev + 1);
    setModalVisible(false);
    setIsRunning(true);
    setResetKey((prev) => prev + 1);
  };

  const finishMock = () => {
    if (!isRunning) {
      return;
    }

    const mockAccuracy = Math.floor(55 + Math.random() * 40);
    setAccuracy(mockAccuracy);
    setIsRunning(false);
    setModalVisible(true);
  };

  return (
    <Screen>
      <GameSessionHeader
        title={`Автоматизація [${sound}]`}
        childName={childName}
        onExit={() => navigation.goBack()}
      />

      <GameTimer mode="elapsed" isRunning={isRunning} resetKey={resetKey} />

      <View style={styles.card}>
        <Text style={styles.label}>Параметри</Text>
        <Text style={styles.text}>Звук: {sound}</Text>
        <Text style={styles.text}>Позиція: {position}</Text>
        <Text style={styles.text}>Спроб: {attempts}</Text>

        <Text style={styles.levelTitle}>Складність</Text>
        <LevelSelector
          levels={[1, 2, 3]}
          selectedLevel={selectedLevel}
          onSelect={setSelectedLevel}
        />

        <View style={styles.actions}>
          <Pressable style={styles.startButton} onPress={startSession}>
            <Text style={styles.startText}>Почати</Text>
          </Pressable>

          <Pressable style={styles.finishButton} onPress={finishMock}>
            <Text style={styles.finishText}>Завершити спробу (mock)</Text>
          </Pressable>
        </View>
      </View>

      <GameResultModal
        visible={modalVisible}
        success={success}
        accuracy={accuracy}
        sessionId={`auto-${Date.now()}`}
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
    color: "#1a202c",
  },
  levelTitle: {
    fontSize: 14,
    color: "#2d3748",
    fontWeight: "700",
    marginTop: 2,
  },
  actions: {
    gap: 8,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: "#2f855a",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  startText: {
    color: "#fff",
    fontWeight: "700",
  },
  finishButton: {
    backgroundColor: "#edf2f7",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },
  finishText: {
    color: "#2d3748",
    fontWeight: "700",
  },
});
