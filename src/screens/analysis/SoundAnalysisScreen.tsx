import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAudioRecorder, RecordingPresets } from "expo-audio";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import {
  speechApi,
  SoundWordDto,
  AnalyzeResponse,
} from "../../api/types/speechApi";
import { childrenApi } from "../../api/childrenApi";
import { useChildStore } from "../../store/childStore";
import { cn } from "../../shared/utils/cn";
import { http } from "../../api/http";

type SoundResult = {
  sound: string;
  attempts: { word: string; is_correct: boolean; score: number }[];
};

export function SoundAnalysisScreen() {
  const navigation = useNavigation<any>();
  const { selectedChild, setSelectedChild } = useChildStore();

  const [soundWords, setSoundWords] = useState<SoundWordDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SoundResult[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [problemSounds, setProblemSounds] = useState<string[]>([]);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    loadSoundWords();
  }, []);

  const loadSoundWords = async () => {
    try {
      console.log("Base URL:", http.defaults.baseURL);
      console.log("Full URL:", `${http.defaults.baseURL}/speech/sound-words`);
      const words = await speechApi.getSoundWords();
      setSoundWords(words);
    } catch (e: any) {
      console.log("Error data:", JSON.stringify(e?.response?.data));
      console.log("Status:", e?.response?.status);
      console.log("Message:", e?.message);
      console.log("Request URL:", e?.config?.url);
      Alert.alert("Помилка", e?.message ?? "Невідома помилка");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch {
      Alert.alert("Помилка", "Не вдалося розпочати запис");
    }
  };

  const stopAndAnalyze = async () => {
    if (!isRecording) return;

    try {
      setIsRecording(false);
      setIsAnalyzing(true);

      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      console.log("Audio URI:", uri);

      if (!uri) {
        Alert.alert("Помилка", "Не вдалося отримати запис");
        return;
      }

      const current = soundWords[currentIndex];
      console.log("Current word:", current.word, "Sound:", current.sound);

      const response = await speechApi.analyze(
        uri,
        current.word,
        current.sound,
      );
      console.log("Response:", JSON.stringify(response));

      updateResults(current.sound, current.word, response);
      goToNext();
    } catch (e: any) {
      console.log("Analyze error message:", e?.message);
      console.log("Analyze error status:", e?.response?.status);
      console.log("Analyze error data:", JSON.stringify(e?.response?.data));
      console.log("Analyze error config url:", e?.config?.url);
      Alert.alert("Помилка", "Не вдалося проаналізувати запис");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateResults = (
    sound: string,
    word: string,
    response: AnalyzeResponse,
  ) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.sound === sound);
      const attempt = {
        word,
        is_correct: response.is_correct,
        score: response.pronunciation_score,
      };

      if (existing) {
        return prev.map((r) =>
          r.sound === sound ? { ...r, attempts: [...r.attempts, attempt] } : r,
        );
      }

      return [...prev, { sound, attempts: [attempt] }];
    });
  };

  const goToNext = () => {
    if (currentIndex + 1 >= soundWords.length) {
      finishAnalysis();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const finishAnalysis = () => {
    const problematic = results
      .filter((r) => {
        const correctCount = r.attempts.filter((a) => a.is_correct).length;
        return correctCount / r.attempts.length < 0.5;
      })
      .map((r) => r.sound);

    setProblemSounds(problematic);
    setIsDone(true);
    saveResults(problematic);
  };

  const saveResults = async (problematic: string[]) => {
    if (!selectedChild) return;

    try {
      const problemSoundsStr = problematic.join(", ");
      await childrenApi.updateChild(selectedChild.id, {
        name: selectedChild.name,
        birthDate: selectedChild.birthDate,
        problemSounds: problemSoundsStr,
      });

      setSelectedChild({ ...selectedChild, problemSounds: problemSoundsStr });
    } catch {
      Alert.alert("Увага", "Результати аналізу не вдалося зберегти");
    }
  };

  const progress = soundWords.length > 0 ? currentIndex / soundWords.length : 0;

  if (isLoading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  if (isDone) {
    return (
      <Screen className="px-6 pt-12">
        <Text className="text-3xl font-bold text-primary mb-2">
          Аналіз завершено 🎉
        </Text>
        <Text className="text-text-muted text-base mb-8">
          Ось результати первинного аналізу вимови
        </Text>

        {problemSounds.length === 0 ? (
          <View className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-6">
            <Text className="text-green-700 font-bold text-lg mb-1">
              Чудово! 🌟
            </Text>
            <Text className="text-green-600">
              Проблемних звуків не виявлено
            </Text>
          </View>
        ) : (
          <View className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
            <Text className="text-orange-700 font-bold text-lg mb-3">
              Звуки що потребують уваги:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {problemSounds.map((s) => (
                <View key={s} className="bg-orange-100 px-4 py-2 rounded-full">
                  <Text className="text-orange-700 font-bold text-base">
                    {s.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Button
          title="На головну"
          onPress={() => navigation.navigate("App", { screen: "Home" })}
        />
      </Screen>
    );
  }

  const current = soundWords[currentIndex];

  return (
    <Screen className="px-6 pt-12">
      <View className="mb-6">
        <Text className="text-sm text-text-muted mb-2">
          {currentIndex + 1} / {soundWords.length}
        </Text>
        <View className="h-2 bg-gray-100 rounded-full">
          <View
            className="h-2 bg-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>

      <Text className="text-lg text-text-muted mb-1">Вимовте слово:</Text>
      <Text className="text-5xl font-bold text-primary mb-2">
        {current?.word}
      </Text>
      <Text className="text-sm text-text-muted mb-12">
        Звук:{" "}
        <Text className="font-bold text-primary">
          {current?.sound.toUpperCase()}
        </Text>{" "}
        ({current?.position})
      </Text>

      <View className="items-center">
        {isAnalyzing ? (
          <View className="items-center gap-3">
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text className="text-text-muted">Аналізуємо...</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={isRecording ? stopAndAnalyze : startRecording}
            activeOpacity={0.8}
            className={cn(
              "w-28 h-28 rounded-full items-center justify-center",
              isRecording ? "bg-red-500" : "bg-primary",
            )}
          >
            <Text className="text-white text-4xl">
              {isRecording ? "⏹" : "🎙"}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-text-muted mt-4 text-sm">
          {isRecording ? "Натисніть щоб зупинити" : "Натисніть щоб записати"}
        </Text>
      </View>
    </Screen>
  );
}
