import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
  onRestart: () => void;
  onInstructionPress?: () => void;
  label?: string;
  moves?: number;
};

export function GameProgressBar({
  current,
  total,
  correct,
  incorrect,
  onRestart,
  onInstructionPress,
  label = "Прогрес",
  moves,
}: Props) {
  const safeTotal = Math.max(total, 1);
  const progressPercent = Math.max(
    0,
    Math.min((current / safeTotal) * 100, 100),
  );

  return (
    <View className="absolute left-4 right-4 bottom-4 bg-white rounded-2xl px-4 py-3 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <View>
          <Text className="text-xs font-bold text-gray-400">{label}</Text>
          <Text className="text-sm font-extrabold text-gray-900">
            {current}/{total}
          </Text>
        </View>

        <View className="flex-row items-center">
          {moves !== undefined && (
            <View className="flex-row items-center mr-3">
              <Ionicons name="footsteps" size={18} color="#6C63FF" />
              <Text className="text-sm font-extrabold text-gray-900 ml-1">
                {moves}
              </Text>
            </View>
          )}

          <View className="flex-row items-center mr-3">
            <Ionicons name="checkmark" size={18} color="#6FCF97" />
            <Text className="text-sm font-extrabold text-gray-900 ml-1">
              {correct}
            </Text>
          </View>

          <View className="flex-row items-center mr-3">
            <Ionicons name="close" size={18} color="#EB5757" />
            <Text className="text-sm font-extrabold text-gray-900 ml-1">
              {incorrect}
            </Text>
          </View>

          {onInstructionPress && (
            <TouchableOpacity
              onPress={onInstructionPress}
              className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-2"
              activeOpacity={0.8}
            >
              <Ionicons name="help" size={20} color="#3B82F6" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={onRestart}
            className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={20} color="#EB5757" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </View>
    </View>
  );
}
