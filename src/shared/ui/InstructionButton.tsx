import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  bottom?: number;
};

export function InstructionButton({ onPress, bottom = 92 }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ bottom }}
      className="absolute right-5 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
    >
      <Ionicons name="help" size={28} color="#fff" />
    </TouchableOpacity>
  );
}
