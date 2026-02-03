import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, resetKey]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

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
    <View style={styles.container}>
      <Text style={styles.label}>{mode === "countdown" ? "Залишилось" : "Минуло"}</Text>
      <Text style={styles.value}>{formatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#edf2f7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 2,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a202c",
  },
});
