//src\screens\games\shared\GameSessionHeader.tsx
import { Pressable, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  childName: string;
  onExit: () => void;
};

export function GameSessionHeader({ title, childName, onExit }: Props) {
  const handleExit = () => {
    Alert.alert(
      "Завершити заняття?",
      "Прогрес поточної вправи може бути втрачено.",
      [
        { text: "Продовжити", style: "cancel" },
        { text: "Вийти", style: "destructive", onPress: onExit },
      ],
    );
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
      <View className="flex-1 mr-4">
        <Text className="text-sm text-text-muted font-bold uppercase tracking-wider mb-1">
          {childName}
        </Text>
        <Text className="text-xl font-bold text-text-main" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleExit}
        className="w-10 h-10 rounded-full bg-red-50 items-center justify-center border border-red-100"
      >
        <Ionicons name="close" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
}
