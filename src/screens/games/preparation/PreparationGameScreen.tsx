// src\screens\games\preparation\PreparationGameScreen.tsx
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { useChildStore } from "../../../store/childStore";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { GameSessionHeader } from "../shared/GameSessionHeader";
import { GameTimer } from "../shared/GameTimer";
import { GameResultModal } from "../shared/GameResultModal";

type Props = NativeStackScreenProps<GamesStackParamList, "PreparationGame">;

export function PreparationGameScreen({ navigation, route }: Props) {
  const { title, instruction, durationSec, difficulty } = route.params;
  const childName = useChildStore((s) => s.selectedChild?.name ?? "Дитина");

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
    // Емуляція результату (в реальному додатку тут була б обробка ML або ручна оцінка)
    const mockAccuracy = Math.floor(65 + Math.random() * 31); // 65-95%
    setAccuracy(mockAccuracy);
    setSuccess(mockAccuracy >= 75);
    setIsRunning(false);
    setModalVisible(true);
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
        <View className="items-center py-8">
          <GameTimer
            mode="countdown"
            seconds={durationSec}
            isRunning={isRunning}
            resetKey={resetKey}
            onComplete={finishByTimer}
          />
        </View>

        <Card className="p-5 mb-6">
          <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Інструкція
          </Text>
          <Text className="text-lg text-text-main font-medium leading-7 mb-4">
            {instruction}
          </Text>

          <View className="flex-row items-center">
            <Text className="text-sm text-text-muted mr-2">Складність:</Text>
            <View className="bg-gray-100 px-2 py-1 rounded">
              <Text className="text-xs font-bold text-gray-700">
                {difficulty}
              </Text>
            </View>
          </View>
        </Card>

        <Button
          title={isRunning ? "Перезапустити" : "Почати вправу"}
          onPress={startSession}
          variant={isRunning ? "secondary" : "primary"}
        />
      </ScrollView>

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
