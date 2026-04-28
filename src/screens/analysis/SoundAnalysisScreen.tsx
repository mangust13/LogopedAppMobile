import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAudioRecorder, RecordingPresets } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import { BackHeader } from "../../shared/ui/BackHeader";
import { speechApi, SoundWordDto, AnalyzeResponse } from "../../api/speechApi";
import { childrenApi } from "../../api/childrenApi";
import { useChildStore } from "../../store/childStore";
import { cn } from "../../shared/utils/cn";
import {
  formatProblemSounds,
  parseProblemSounds,
} from "../../shared/constants/sounds";

type SoundResult = {
  sound: string;
  attempts: { word: string; is_correct: boolean; score: number }[];
};

type StepState = "idle" | "recording" | "analyzing" | "result";

type GroupKey = "whistling" | "hissing" | "rl";

type SoundGroup = {
  key: GroupKey;
  label: string;
  emoji: string;
  sounds: string[];
  color: string;
  bgColor: string;
};

const SOUND_GROUPS: SoundGroup[] = [
  {
    key: "whistling",
    label: "Свистячі",
    emoji: "💨",
    sounds: ["с", "з", "ц", "дз"],
    color: "#6FA8DC",
    bgColor: "#EBF3FB",
  },
  {
    key: "hissing",
    label: "Шиплячі",
    emoji: "🐍",
    sounds: ["ш", "ж", "ч", "дж"],
    color: "#F8A15F",
    bgColor: "#FEF3E8",
  },
  {
    key: "rl",
    label: "Р та Л",
    emoji: "🦁",
    sounds: ["р", "л"],
    color: "#F47C7C",
    bgColor: "#FEE9E9",
  },
];

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const POSITION_LABELS: Record<string, string> = {
  початок: "на початку слова",
  середина: "в середині слова",
  кінець: "в кінці слова",
};

export function SoundAnalysisScreen() {
  const navigation = useNavigation<any>();
  const { selectedChild, setSelectedChild } = useChildStore();

  const [selectedGroup, setSelectedGroup] = useState<SoundGroup | null>(null);
  const [allSoundWords, setAllSoundWords] = useState<SoundWordDto[]>([]);
  const [soundWords, setSoundWords] = useState<SoundWordDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SoundResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stepState, setStepState] = useState<StepState>("idle");
  const [lastResponse, setLastResponse] = useState<AnalyzeResponse | null>(
    null,
  );

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    loadSoundWords();
  }, []);

  const loadSoundWords = async () => {
    try {
      const words = await speechApi.getSoundWords();
      setAllSoundWords(words);
    } catch (e: any) {
      Alert.alert("Помилка", e?.message ?? "Не вдалося завантажити слова");
    } finally {
      setIsLoading(false);
    }
  };

  const selectGroup = (group: SoundGroup) => {
    const filtered = allSoundWords.filter((w) =>
      group.sounds.includes(w.sound),
    );
    setSoundWords(filtered);
    setSelectedGroup(group);
    setCurrentIndex(0);
    setResults([]);
    setStepState("idle");
    setLastResponse(null);
  };

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setStepState("recording");
    } catch {
      Alert.alert("Помилка", "Не вдалося розпочати запис");
    }
  };

  const stopAndAnalyze = async () => {
    if (stepState !== "recording") return;
    try {
      setStepState("analyzing");
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        Alert.alert("Помилка", "Не вдалося отримати запис");
        setStepState("idle");
        return;
      }

      const current = soundWords[currentIndex];
      const response = await speechApi.analyze(
        uri,
        current.word,
        current.sound,
      );

      console.log("Azure response:", JSON.stringify(response, null, 2));

      setLastResponse(response);
      setStepState("result");

      setResults((prev) => {
        const existing = prev.find((r) => r.sound === current.sound);
        const attempt = {
          word: current.word,
          is_correct: response.is_correct,
          score: response.pronunciation_score,
        };
        if (existing) {
          return prev.map((r) =>
            r.sound === current.sound
              ? { ...r, attempts: [...r.attempts, attempt] }
              : r,
          );
        }
        return [...prev, { sound: current.sound, attempts: [attempt] }];
      });
    } catch {
      Alert.alert("Помилка", "Не вдалося проаналізувати запис");
      setStepState("idle");
    }
  };

  const goToNext = () => {
    setLastResponse(null);
    setStepState("idle");
    if (currentIndex + 1 >= soundWords.length) {
      finishAnalysis();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex === 0) return;
    setLastResponse(null);
    setStepState("idle");
    setCurrentIndex((prev) => prev - 1);
  };

  const finishAnalysis = () => {
    const problematic = results
      .filter((r) => {
        const correctCount = r.attempts.filter((a) => a.is_correct).length;
        return correctCount / r.attempts.length < 0.5;
      })
      .map((r) => r.sound);
    const allowedProblematic = parseProblemSounds(problematic.join(","));

    saveResults(allowedProblematic);

    navigation.navigate("AnalysisResult", {
      problemSounds: allowedProblematic,
      groupLabel: selectedGroup?.label ?? "",
    });
  };

  const saveResults = async (problematic: string[]) => {
    if (!selectedChild) return;
    try {
      const problemSoundsStr = formatProblemSounds(problematic);
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

  if (!selectedGroup) {
    return (
      <Screen className="px-0 pb-0">
        <BackHeader title="Аналіз вимови" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-6"
        >
          <Text className="text-2xl font-bold text-primary mb-2">
            Оберіть групу звуків 🎯
          </Text>
          <Text className="text-text-muted text-base mb-8">
            Ми перевіримо вимову звуків обраної групи
          </Text>

          <View className="gap-4">
            {SOUND_GROUPS.map((group) => (
              <TouchableOpacity
                key={group.key}
                onPress={() => selectGroup(group)}
                activeOpacity={0.8}
                style={{ backgroundColor: group.bgColor }}
                className="rounded-2xl p-5 border border-gray-100"
              >
                <View className="flex-row items-center mb-3">
                  <Text className="text-3xl mr-3">{group.emoji}</Text>
                  <Text className="text-xl font-bold text-text-main">
                    {group.label}
                  </Text>
                </View>
                <View className="flex-row gap-2 flex-wrap">
                  {group.sounds.map((s) => (
                    <View
                      key={s}
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{ backgroundColor: group.color }}
                    >
                      <Text className="text-white text-xl font-bold">
                        {s.toUpperCase()}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Screen>
    );
  }

  const current = soundWords[currentIndex];

  return (
    <Screen className="px-0 pb-0">
      <BackHeader
        title={capitalize(current?.word ?? "")}
        subtitle={`${selectedGroup.label} • Звук ${current?.sound.toUpperCase()}`}
        onBackPress={() => setSelectedGroup(null)}
      />

      <View className="px-6 pt-6 flex-1 justify-between pb-8">
        <View>
          <View className="mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-text-muted">
                {currentIndex + 1} / {soundWords.length}
              </Text>
              <Text className="text-sm text-text-muted">
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full">
              <View
                className="h-2 bg-primary rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>

          <View className="items-center mb-6">
            <Text className="text-text-muted text-base mb-3">
              Вимовте слово:
            </Text>
            <Text className="text-7xl font-bold text-primary mb-4">
              {capitalize(current?.word ?? "")}
            </Text>

            <View className="flex-row gap-3">
              <View
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: selectedGroup.bgColor }}
              >
                <Text
                  className="font-bold text-sm"
                  style={{ color: selectedGroup.color }}
                >
                  Звук: {current?.sound.toUpperCase()}
                </Text>
              </View>
              <View className="bg-gray-100 px-4 py-2 rounded-full">
                <Text className="text-text-muted font-bold text-sm">
                  {POSITION_LABELS[current?.position] ?? current?.position}
                </Text>
              </View>
            </View>
          </View>

          {stepState === "result" && lastResponse && (
            <View
              className={cn(
                "rounded-2xl p-5 border",
                lastResponse.is_correct
                  ? "bg-green-50 border-green-100"
                  : "bg-red-50 border-red-100",
              )}
            >
              <Text
                className={cn(
                  "text-xl font-bold mb-1",
                  lastResponse.is_correct ? "text-green-700" : "text-red-700",
                )}
              >
                {lastResponse.is_correct ? "Чудово! ✅" : "Є помилки ❌"}
              </Text>
              <Text
                className={cn(
                  "text-sm mb-1",
                  lastResponse.is_correct ? "text-green-600" : "text-red-600",
                )}
              >
                Розпізнано: "{lastResponse.recognized_text}"
              </Text>
              <Text
                className={cn(
                  "text-sm font-bold",
                  lastResponse.is_correct ? "text-green-700" : "text-red-700",
                )}
              >
                Оцінка вимови: {Math.round(lastResponse.pronunciation_score)}%
              </Text>
              <Button title="Далі →" onPress={goToNext} className="mt-4" />
            </View>
          )}
        </View>

        {stepState !== "result" && (
          <View className="items-center gap-6">
            {stepState === "analyzing" ? (
              <View className="items-center gap-3">
                <ActivityIndicator size="large" color="#6C63FF" />
                <Text className="text-text-muted">Аналізуємо...</Text>
              </View>
            ) : (
              <View className="items-center gap-3">
                <TouchableOpacity
                  onPress={
                    stepState === "recording" ? stopAndAnalyze : startRecording
                  }
                  activeOpacity={0.8}
                  className={cn(
                    "w-24 h-24 rounded-full items-center justify-center",
                    stepState === "recording" ? "bg-red-500" : "bg-primary",
                  )}
                >
                  <Text className="text-white text-4xl">
                    {stepState === "recording" ? "⏹" : "🎙"}
                  </Text>
                </TouchableOpacity>
                <Text className="text-text-muted text-sm">
                  {stepState === "recording"
                    ? "Натисніть щоб зупинити"
                    : "Натисніть щоб записати"}
                </Text>
              </View>
            )}

            <View className="flex-row items-center gap-6">
              <TouchableOpacity
                onPress={goToPrev}
                disabled={currentIndex === 0}
                className={cn(
                  "w-12 h-12 rounded-full items-center justify-center border",
                  currentIndex === 0
                    ? "border-gray-200 bg-gray-50"
                    : "border-primary bg-white",
                )}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={currentIndex === 0 ? "#CBD5E1" : "#6C63FF"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={goToNext}
                className="w-12 h-12 rounded-full items-center justify-center border border-primary bg-white"
              >
                <Ionicons name="chevron-forward" size={22} color="#6C63FF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
