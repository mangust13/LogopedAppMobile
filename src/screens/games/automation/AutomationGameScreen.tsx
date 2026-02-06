// src\screens\games\automation\AutomationGameScreen.tsx
import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { useChildStore } from "../../../store/childStore";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";
import { LevelSelector } from "./components/LevelSelector";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationGame">;

export function AutomationGameScreen({ navigation, route }: Props) {
  const { sound, position, level } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина");

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
    if (!isRunning) return;

    // Емуляція результату
    const mockAccuracy = Math.floor(55 + Math.random() * 40);
    setAccuracy(mockAccuracy);
    setIsRunning(false);
    setModalVisible(true);
  };

  return (
    <Screen>
      <GameSessionHeader
        title={`Звук [${sound}]`}
        childName={childName}
        onExit={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-6">
          <GameTimer mode="elapsed" isRunning={isRunning} resetKey={resetKey} />
        </View>

        <Card className="p-5 mb-6">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Звук
              </Text>
              <Text className="text-2xl font-bold text-primary">[{sound}]</Text>
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Позиція
              </Text>
              <Text className="text-lg font-bold text-text-main">
                {position}
              </Text>
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                Спроба
              </Text>
              <Text className="text-lg font-bold text-text-main">
                #{attempts + 1}
              </Text>
            </View>
          </View>

          <Text className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3 mt-2">
            Складність рівня
          </Text>
          <LevelSelector
            levels={[1, 2, 3]}
            selectedLevel={selectedLevel}
            onSelect={setSelectedLevel}
          />

          <View className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
            <Text className="text-blue-800 text-sm leading-5">
              💡 Повторюйте слова за диктором, слідкуючи за чіткістю вимови
              звука [{sound}].
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <Button
            title={isRunning ? "Завершити вправу" : "Почати вправу"}
            onPress={isRunning ? finishMock : startSession}
            variant={isRunning ? "secondary" : "primary"}
          />
        </View>
      </ScrollView>

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
