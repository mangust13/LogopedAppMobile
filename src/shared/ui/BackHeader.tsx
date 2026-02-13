// src/shared/ui/BackHeader.tsx

import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  onBackPress?: () => void;
};

export function BackHeader({ title, onBackPress }: Props) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
      <TouchableOpacity onPress={handleBack} className="mr-3">
        <Ionicons name="chevron-back" size={28} color="#007AFF" />
      </TouchableOpacity>

      <Text
        className="text-xl font-bold text-black flex-1 text-center mr-8"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}
