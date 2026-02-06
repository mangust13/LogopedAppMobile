//src/screens/parent/children/components/AssignLogopedModal.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { logopedApi, LogopedDto } from "../../../../api/logopedApi";
import { childrenApi } from "../../../../api/childrenApi";
import { Button } from "../../../../shared/ui/Button";
import { Screen } from "../../../../shared/ui/Screen";

type Props = {
  childId: number;
  visible: boolean;
  onClose: () => void;
  onAssigned: () => void;
  currentLogopedEmail?: string | null;
};

const EMPTY = "__empty__";

export function AssignLogopedModal({
  childId,
  visible,
  onClose,
  onAssigned,
  currentLogopedEmail,
}: Props) {
  const [logopeds, setLogopeds] = useState<LogopedDto[]>([]);
  const [selected, setSelected] = useState<LogopedDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setLoading(true);
    logopedApi
      .getAll()
      .then((data) => {
        setLogopeds(data);
        const found = data.find((l) => l.email === currentLogopedEmail);
        setSelected(found ?? null);
      })
      .catch((e) => {
        Alert.alert("Error", "Failed to load logopeds");
      })
      .finally(() => setLoading(false));
  }, [visible, currentLogopedEmail]);

  const onAssign = async () => {
    if (!selected) return;
    try {
      await childrenApi.assignLogoped(childId, selected.email);
      onAssigned();
      onClose();
      setSelected(null);
    } catch (e: any) {
      Alert.alert("Error", "Assign failed");
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
          <ActivityIndicator size="large" className="text-primary" />
        ) : (
          <View className="border border-gray-200 rounded-2xl bg-surface overflow-hidden mb-6">
            <Picker
              selectedValue={selected?.email ?? EMPTY}
              onValueChange={(value) => {
                if (value === EMPTY) {
                  setSelected(null);
                  return;
                }
                const found = logopeds.find((l) => l.email === value);
                setSelected(found ?? null);
              }}
            >
              <Picker.Item
                label="— Оберіть зі списку —"
                value={EMPTY}
                color="#9CA3AF"
              />
              {logopeds.map((l) => (
                <Picker.Item
                  key={l.id}
                  label={`${l.name ?? "Логопед"} (${l.email})`}
                  value={l.email}
                  color="#2D3748"
                />
              ))}
            </Picker>
          </View>
        )}

        <View className="mt-auto space-y-3 mb-6">
          <Button
            title="Призначити"
            onPress={onAssign}
            disabled={!selected || loading}
          />
          <Button title="Скасувати" variant="ghost" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
