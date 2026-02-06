//src\screens\games\shared\GameTimer.tsx
import { useEffect, useMemo, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../../shared/utils/cn";

type Props = {
  mode: "countdown" | "elapsed";
  seconds?: number;
  isRunning: boolean;
  resetKey?: number;
  onComplete?: () => void;
};

export function GameTimer({
  mode,
  seconds = 0,
  isRunning,
  resetKey = 0,
  onComplete,
}: Props) {
  const initialValue = mode === "countdown" ? seconds : 0;
  const [value, setValue] = useState(initialValue);

  const progressPercent =
    mode === "countdown" && seconds > 0 ? (value / seconds) * 100 : 100;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, resetKey]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setValue((prev) => {
        if (mode === "countdown") {
          if (prev <= 1) {
            clearInterval(intervalId);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, mode, onComplete, resetKey]);

  const formatted = useMemo(() => {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, "0");
    const secs = (value % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }, [value]);

  return (
    <View className="items-center justify-center">
      {/* Зовнішнє коло (емуляція) */}
      <View
        className={cn(
          "w-48 h-48 rounded-full border-8 items-center justify-center bg-white shadow-sm",
          isRunning ? "border-primary" : "border-gray-200",
        )}
      >
        <View className="items-center">
          <Ionicons
            name={mode === "countdown" ? "timer-outline" : "stopwatch-outline"}
            size={32}
            color="#6B7280"
            style={{ marginBottom: 4 }}
          />
          <Text className="text-5xl font-bold text-text-main tabular-nums tracking-tight">
            {formatted}
          </Text>
          <Text className="text-xs font-bold text-text-muted uppercase mt-1">
            {mode === "countdown" ? "Залишилось" : "Час"}
          </Text>
        </View>
      </View>
    </View>
  );
}
