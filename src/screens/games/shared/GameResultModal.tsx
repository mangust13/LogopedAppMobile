import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onFinish}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Молодець!</Text>
          <Text style={styles.status}>
            Результат: {success ? "успішно" : "неуспішно"}
          </Text>
          <Text style={styles.meta}>Точність: {accuracy}% (mock)</Text>
          <Text style={styles.meta}>Session: {sessionId ?? "mock-session"}</Text>

          <Pressable style={[styles.button, styles.primary]} onPress={onRetry}>
            <Text style={[styles.buttonText, styles.primaryText]}>Повторити</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.secondary]} onPress={onFinish}>
            <Text style={[styles.buttonText, styles.secondaryText]}>Завершити</Text>
          </Pressable>

          <Pressable style={[styles.button, styles.progress]} onPress={onGoToProgress}>
            <Text style={[styles.buttonText, styles.progressText]}>
              Перейти до Progress
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a202c",
  },
  status: {
    fontSize: 15,
    color: "#2d3748",
  },
  meta: {
    fontSize: 13,
    color: "#4a5568",
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  primary: {
    backgroundColor: "#2b6cb0",
  },
  primaryText: {
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },
  secondaryText: {
    color: "#2d3748",
  },
  progress: {
    backgroundColor: "#ebf8ff",
    borderWidth: 1,
    borderColor: "#90cdf4",
  },
  progressText: {
    color: "#2c5282",
  },
});
