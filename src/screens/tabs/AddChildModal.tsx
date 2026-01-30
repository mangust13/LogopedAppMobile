import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { childrenApi } from "../../api/childrenApi";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddChildModal({ visible, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [problemSounds, setProblemSounds] = useState("");

  const onSubmit = async () => {
    if (!birthDate) {
      Alert.alert("Помилка", "Оберіть дату народження");
      return;
    }

    try {
      await childrenApi.createChild({
        name,
        birthDate: birthDate.toISOString(),
        problemSounds: problemSounds
          .split(",")
          .map((s) => s.trim())
          .join(","),
      });
      onCreated();
      onClose();

      setName("");
      setBirthDate(null);
      setProblemSounds("");
    } catch (e: any) {
      console.log("CREATE CHILD ERROR", e?.response?.status, e?.response?.data);
      Alert.alert("Помилка", "Не вдалося створити дитину");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Додати дитину</Text>

        <TextInput
          placeholder="Імʼя"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, padding: 12, marginTop: 12 }}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            borderWidth: 1,
            padding: 12,
            marginTop: 12,
          }}
        >
          <Text>
            {birthDate
              ? birthDate.toLocaleDateString()
              : "Дата народження (натисніть для вибору)"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) setBirthDate(selectedDate);
            }}
          />
        )}

        <TextInput
          placeholder="Problem sounds (R,L,S)"
          value={problemSounds}
          onChangeText={setProblemSounds}
          style={{ borderWidth: 1, padding: 12, marginTop: 12 }}
        />

        <View style={{ height: 16 }} />
        <Button title="Створити" onPress={onSubmit} />
        <View style={{ height: 8 }} />
        <Button title="Скасувати" onPress={onClose} />
      </View>
    </Modal>
  );
}
