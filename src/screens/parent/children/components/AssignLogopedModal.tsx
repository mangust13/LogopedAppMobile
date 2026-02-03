import { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { logopedApi, LogopedDto } from "../../../../api/logopedApi";
import { childrenApi } from "../../../../api/childrenApi";

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
        console.log("LOAD LOGOPEDS ERROR", e?.response?.data);
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
      console.log("ASSIGN LOGOPED ERROR", e?.response?.data);
      Alert.alert("Error", "Assign failed");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            marginTop: 16,
            marginBottom: 8,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Обрати логопеда
        </Text>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={{ borderWidth: 1, borderRadius: 6 }}>
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
              <Picker.Item label="— Оберіть логопеда —" value={EMPTY} />
              {logopeds.map((l) => (
                <Picker.Item
                  key={l.id}
                  label={l.name ?? l.email}
                  value={l.email}
                />
              ))}
            </Picker>
          </View>
        )}

        <View style={{ height: 16 }} />
        <TouchableOpacity
          onPress={onAssign}
          disabled={!selected || loading}
          style={{
            backgroundColor: selected && !loading ? "#4CAF50" : "#ccc",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: selected && !loading ? "#fff" : "#666",
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            Призначити
          </Text>
        </TouchableOpacity>

        <View style={{ height: 8 }} />
        <Button title="Скасувати" onPress={onClose} />
      </View>
    </Modal>
  );
}
