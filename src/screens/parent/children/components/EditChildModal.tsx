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
import {
  childrenApi,
  UpdateChildProfileDto,
} from "../../../../api/childrenApi";
import { ChildDto } from "../../../../api/childrenApi";
import { Button } from "../../../../shared/ui/Button";
import { Input } from "../../../../shared/ui/Input";
import {
  formatProblemSounds,
  parseProblemSounds,
} from "../../../../shared/constants/sounds";
import { ProblemSoundsPicker } from "../../../../shared/ui/ProblemSoundsPicker";
import {
  getChildBirthDateRange,
  isChildAgeAllowed,
  MAX_CHILD_AGE,
  MIN_CHILD_AGE,
} from "../../../../shared/utils/age";

type Props = {
  child: ChildDto & { problemSounds?: string | null };
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export function EditChildModal({ child, visible, onClose, onUpdated }: Props) {
  const { minDate, maxDate } = getChildBirthDateRange();
  const [name, setName] = useState(child.name);
  const [birthDate, setBirthDate] = useState(new Date(child.birthDate));
  const [problemSounds, setProblemSounds] = useState<string[]>(
    parseProblemSounds(child.problemSounds),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Помилка", "Введіть ім'я");
      return;
    }
    if (!isChildAgeAllowed(birthDate)) {
      Alert.alert(
        "Помилка",
        `Вік дитини має бути від ${MIN_CHILD_AGE} до ${MAX_CHILD_AGE} років`,
      );
      return;
    }

    setLoading(true);
    try {
      const dto: UpdateChildProfileDto = {
        name,
        birthDate: birthDate.toISOString(),
        problemSounds:
          problemSounds.length > 0 ? formatProblemSounds(problemSounds) : null,
      };

      await childrenApi.updateChild(child.id, dto);
      onUpdated();
      onClose();
    } catch (e: any) {
      Alert.alert("Помилка", "Не вдалося оновити дані");
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
          Редагувати профіль ✏️
        </Text>

        <View className="space-y-4">
          <Input label="Ім'я" value={name} onChangeText={setName} />

          <View className="space-y-2">
            <Text className="text-sm font-medium text-text-muted ml-1">
              Дата народження
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full h-14 bg-surface px-4 rounded-2xl border border-gray-100 justify-center"
            >
              <Text className="text-text-main text-base">
                {birthDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={isChildAgeAllowed(birthDate) ? birthDate : maxDate}
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
            title="Зберегти зміни"
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
