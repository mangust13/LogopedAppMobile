import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

type Props = {
  text: string;
  audioUrl?: string;
  onClose: () => void;
};

export function VoiceInstruction({ text, onClose }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const stopAudio = async () => {
    await Speech.stop();
    setIsPlaying(false);
  };

  const playAudio = async () => {
    try {
      await Speech.stop();
      setIsPlaying(true);

      Speech.speak(text, {
        language: "uk-UA",
        rate: 0.95,
        pitch: 1,
        onDone: () => setIsPlaying(false),
        onStopped: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch {
      setIsPlaying(false);
    }
  };

  const handleClose = async () => {
    await stopAudio();
    onClose();
  };

  return (
    <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
      <View className="bg-white mx-5 rounded-2xl p-5 max-w-[320px] w-full">
        <View className="flex-row items-center mb-4">
          <Ionicons name="information-circle" size={24} color="#4CAF50" />
          <Text className="text-lg font-bold flex-1 ml-2">Інструкція</Text>

          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-500 mb-5 leading-6">{text}</Text>

        <View className="gap-3">
          <TouchableOpacity
            onPress={isPlaying ? stopAudio : playAudio}
            className={`flex-row justify-center items-center py-3 rounded-lg ${
              isPlaying ? "bg-orange-500" : "bg-blue-500"
            }`}
          >
            <Ionicons
              name={isPlaying ? "stop" : "volume-high"}
              size={20}
              color="#fff"
            />
            <Text className="text-white ml-2 font-semibold">
              {isPlaying ? "Зупинити голос" : "Прослухати інструкцію"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClose}
            className="bg-green-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-bold">Почати гру</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
