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
import { childrenApi, UpdateChildProfileDto } from "../../api/childrenApi";
import { ChildDto } from "../../api/types/child";

type Props = {
  child: ChildDto & { problemSounds?: string | null };
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void; // викликається після успішного оновлення
};

export function EditChildModal({ child, visible, onClose, onUpdated }: Props) {
  const [name, setName] = useState(child.name);
  const [birthDate, setBirthDate] = useState(new Date(child.birthDate));
  const [problemSounds, setProblemSounds] = useState(child.problemSounds || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!birthDate) {
      Alert.alert("Помилка", "Оберіть дату народження");
      return;
    }

    setLoading(true);
    try {
      const dto: UpdateChildProfileDto = {
        name,
        birthDate: birthDate.toISOString(),
        problemSounds: problemSounds
          ? problemSounds
              .split(",")
              .map((s) => s.trim())
              .join(",")
          : null,
      };

      await childrenApi.updateChild(child.id, dto);

      Alert.alert("Успіх", "Дані дитини оновлено");
      onUpdated(); // оновлюємо список у ChildrenScreen
      onClose();
    } catch (e: any) {
      console.log("UPDATE CHILD ERROR", e?.response?.status, e?.response?.data);
      Alert.alert("Помилка", "Не вдалося оновити дані дитини");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          Редагувати дитину
        </Text>

        <TextInput
          placeholder="Імʼя"
          value={name}
          onChangeText={setName}
          style={{ borderWidth: 1, padding: 12, marginTop: 12 }}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{ borderWidth: 1, padding: 12, marginTop: 12 }}
        >
          <Text>{birthDate.toLocaleDateString()}</Text>
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
          placeholder="Проблемні звуки (R,L,S)"
          value={problemSounds}
          onChangeText={setProblemSounds}
          style={{ borderWidth: 1, padding: 12, marginTop: 12 }}
        />

        <View style={{ height: 16 }} />
        <Button
          title={loading ? "Завантаження..." : "Зберегти"}
          onPress={onSubmit}
          disabled={loading}
        />
        <View style={{ height: 8 }} />
        <Button title="Скасувати" onPress={onClose} disabled={loading} />
      </View>
    </Modal>
  );
}
