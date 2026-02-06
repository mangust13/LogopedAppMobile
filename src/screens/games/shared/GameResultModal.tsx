//src\screens\games\shared\GameResultModal.tsx
import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";

type Props = {
  visible: boolean;
  success: boolean;
  accuracy: number;
  sessionId?: string;
  onRetry: () => void;
  onFinish: () => void;
  onGoToProgress: () => void;
};

export function GameResultModal({
  visible,
  success,
  accuracy,
  sessionId,
  onRetry,
  onFinish,
  onGoToProgress,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onFinish}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <Card className="w-full p-6 items-center">
          {/* Іконка результату */}
          <View className="mb-4">
            {success ? (
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center border-4 border-green-50">
                <Text className="text-4xl">🎉</Text>
              </View>
            ) : (
              <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center border-4 border-orange-50">
                <Text className="text-4xl">💪</Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-text-main mb-2 text-center">
            {success ? "Чудова робота!" : "Гарна спроба!"}
          </Text>

          <Text className="text-text-muted text-center mb-6">
            {success
              ? "Ти впорався із завданням на відмінно."
              : "Не засмучуйся, наступного разу вийде краще!"}
          </Text>

          {/* Результати */}
          <View className="w-full flex-row gap-3 mb-8">
            <View className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center">
              <Text className="text-2xl font-bold text-primary">
                {accuracy}%
              </Text>
              <Text className="text-xs text-text-muted font-bold uppercase">
                Точність
              </Text>
            </View>
            <View className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center justify-center">
              <Text className="text-xs text-text-muted font-bold uppercase text-center">
                Session ID
              </Text>
              <Text className="text-xs text-gray-400 mt-1" numberOfLines={1}>
                #{sessionId ? sessionId.slice(-6) : "TEST"}
              </Text>
            </View>
          </View>

          {/* Кнопки */}
          <View className="w-full gap-3">
            <Button title="Спробувати ще раз" onPress={onRetry} />

            <Button
              title="До списку ігор"
              variant="outline"
              onPress={onFinish}
            />

            <Button
              title="Подивитись прогрес"
              variant="ghost"
              onPress={onGoToProgress}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
}
