import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logopedApi, LogopedDto } from "../../../../api/logopedApi";
import { childrenApi } from "../../../../api/childrenApi";
import { Button } from "../../../../shared/ui/Button";

type Props = {
  childId: number;
  visible: boolean;
  onClose: () => void;
  onAssigned: () => void;
  currentLogopedEmail?: string | null;
};

const normalizeEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? "";

export function AssignLogopedModal({
  childId,
  visible,
  onClose,
  onAssigned,
  currentLogopedEmail,
}: Props) {
  const [logopeds, setLogopeds] = useState<LogopedDto[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);

    logopedApi
      .getAll()
      .then((data) => {
        setLogopeds(data);

        const currentEmail = normalizeEmail(currentLogopedEmail);
        const found = data.find(
          (logoped) => normalizeEmail(logoped.email) === currentEmail,
        );

        setSelectedEmail(found?.email ?? "");
      })
      .catch(() => {
        Alert.alert("Помилка", "Не вдалося завантажити логопедів");
      })
      .finally(() => setLoading(false));
  }, [visible, currentLogopedEmail]);

  const onAssign = async () => {
    if (!selectedEmail) return;

    try {
      await childrenApi.assignLogoped(childId, selectedEmail);
      onAssigned();
      onClose();
    } catch {
      Alert.alert("Помилка", "Не вдалося призначити логопеда");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-background p-6">
        <Text className="text-2xl font-bold text-text-main mb-6 mt-4">
          Обрати логопеда 👨‍⚕️
        </Text>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#6C63FF" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {logopeds.map((logoped) => {
              const isSelected =
                normalizeEmail(logoped.email) === normalizeEmail(selectedEmail);

              return (
                <TouchableOpacity
                  key={`${logoped.id}-${logoped.email}`}
                  activeOpacity={0.75}
                  onPress={() => setSelectedEmail(logoped.email)}
                  className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
                    isSelected
                      ? "bg-blue-50 border-blue-400"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <View className="w-11 h-11 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Text className="text-blue-700 font-bold text-lg">
                      {(logoped.name || logoped.email || "Л")
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-base font-semibold text-text-main">
                      {logoped.name || "Логопед"}
                    </Text>
                    <Text className="text-sm text-text-muted mt-0.5">
                      {logoped.email}
                    </Text>
                  </View>

                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isSelected ? "#3B82F6" : "#CBD5E1"}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View className="mt-auto mb-6 gap-3">
          <Button
            title="Призначити"
            onPress={onAssign}
            disabled={!selectedEmail || loading}
          />
          <Button title="Скасувати" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
