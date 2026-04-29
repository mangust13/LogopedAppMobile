//src/screens/parent/children/components/AddChildModal.tsx
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { childrenApi } from "../../../../api/childrenApi";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import { formatProblemSounds } from "../../../../shared/constants/sounds";
import { ProblemSoundsPicker } from "../../../../shared/ui/ProblemSoundsPicker";
import {
  getChildBirthDateRange,
  isChildAgeAllowed,
  MAX_CHILD_AGE,
  MIN_CHILD_AGE,
} from "../../../../shared/utils/age";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddChildModal({ visible, onClose, onCreated }: Props) {
  const { minDate, maxDate } = getChildBirthDateRange();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [problemSounds, setProblemSounds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) return Alert.alert("Помилка", "Введіть ім'я");
    if (!birthDate) return Alert.alert("Помилка", "Оберіть дату народження");
    if (!isChildAgeAllowed(birthDate)) {
      return Alert.alert(
        "Помилка",
        `Вік дитини має бути від ${MIN_CHILD_AGE} до ${MAX_CHILD_AGE} років`,
      );
    }

    setLoading(true);
    try {
      await childrenApi.createChild({
        name,
        birthDate: birthDate.toISOString(),
        problemSounds: formatProblemSounds(problemSounds),
      });

      onCreated(); // ✅ Оновлюємо список дітей
      onClose(); // ✅ Закриваємо модалку

      setName("");
      setBirthDate(null);
      setProblemSounds([]);
    } catch {
      Alert.alert("Помилка", "Не вдалося створити профіль");
    } finally {
      setLoading(false);
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
          Додати дитину 👶
        </Text>

        <View className="space-y-4">
          <Input
            label="Ім'я"
            placeholder="Введіть ім'я"
            value={name}
            onChangeText={setName}
          />

          <View className="space-y-2">
            <Text className="text-sm font-medium text-text-muted ml-1">
              Дата народження
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full h-14 bg-surface px-4 rounded-2xl border border-gray-100 justify-center"
            >
              <Text
                className={
                  birthDate
                    ? "text-text-main text-base"
                    : "text-gray-400 text-base"
                }
              >
                {birthDate ? birthDate.toLocaleDateString() : "Оберіть дату"}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate || maxDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setBirthDate(selectedDate);
              }}
            />
          )}

          <ProblemSoundsPicker
            value={problemSounds}
            onChange={setProblemSounds}
          />
        </View>

        <View className="mt-auto space-y-3 mb-6">
          <Button
            title="Створити профіль"
            onPress={onSubmit}
            isLoading={loading}
          />
          <Button
            title="Скасувати"
            variant="ghost"
            onPress={onClose}
            disabled={loading}
          />
        </View>
      </View>
    </Modal>
  );
}
