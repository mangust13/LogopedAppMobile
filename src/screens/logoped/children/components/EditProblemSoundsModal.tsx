import { useEffect, useState } from "react";
import { Alert, Modal, Text, View } from "react-native";
import { ChildDto, UpdateChildProfileDto } from "../../../../api/childrenApi";
import { logopedApi } from "../../../../api/logopedApi";
import {
  formatProblemSounds,
  parseProblemSounds,
} from "../../../../shared/constants/sounds";
import { ProblemSoundsPicker } from "../../../../shared/ui/ProblemSoundsPicker";
import { Button } from "../../../../shared/ui/Button";

type Props = {
  child: ChildDto;
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export function EditProblemSoundsModal({
  child,
  visible,
  onClose,
  onUpdated,
}: Props) {
  const [problemSounds, setProblemSounds] = useState<string[]>(
    parseProblemSounds(child.problemSounds),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const parsedSounds = parseProblemSounds(child.problemSounds);
    setProblemSounds(parsedSounds);
  }, [visible, child]);

  const onSubmit = async () => {
    setLoading(true);

    const formattedProblemSounds =
      problemSounds.length > 0 ? formatProblemSounds(problemSounds) : null;

    const dto: UpdateChildProfileDto = {
      name: child.name,
      birthDate: child.birthDate,
      problemSounds: formattedProblemSounds,
    };

    console.log("Updating problem sounds started");
    console.log("Selected problemSounds:", problemSounds);
    console.log("Formatted problemSounds:", formattedProblemSounds);
    console.log("Update child id:", child.id);
    console.log("Update dto:", dto);

    try {
      await logopedApi.updateLogopedChild(child.id, dto);

      console.log("Update problem sounds success");

      onUpdated();
      onClose();
    } catch (error: any) {
      Alert.alert("Помилка", "Не вдалося оновити проблемні звуки");
    } finally {
      console.log("Updating problem sounds finished");
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
        <Text className="text-2xl font-bold text-text-main mb-2 mt-4">
          Редагувати звуки
        </Text>

        <Text className="text-text-muted mb-6">{child.name}</Text>

        <ProblemSoundsPicker
          value={problemSounds}
          onChange={(value) => {
            console.log("Problem sounds changed:", value);
            setProblemSounds(value);
          }}
        />

        <View className="mt-auto space-y-3 mb-6">
          <Button title="Зберегти" onPress={onSubmit} isLoading={loading} />

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
