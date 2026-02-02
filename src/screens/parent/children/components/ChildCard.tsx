import { Text, View, Button, Alert } from "react-native";
import { ChildDto } from "../../../../api/types/child";
import { calcAge } from "../../../../shared/utils/age";

type Props = {
  child: ChildDto & { problemSounds?: string | null };
  onAssignPress: (childId: string) => void;
  onEditPress: (child: ChildDto) => void;
  onDeletePress: (childId: string) => void;
  onUpdated?: () => void;
};

export function ChildCard({
  child,
  onAssignPress,
  onEditPress,
  onDeletePress,
  onUpdated,
}: Props) {
  const hasLogoped = !!child.logopedEmail;

  const handleUpdated = () => {
    if (onUpdated) {
      Alert.alert("Успіх", "Дані дитини оновлено");
      onUpdated();
    }
  };

  return (
    <View style={{ padding: 16, borderWidth: 1, borderRadius: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "500" }}>{child.name}</Text>
      <Text>Вік: {calcAge(child.birthDate)}</Text>
      {hasLogoped && <Text>Логопед: {child.logopedEmail}</Text>}
      {child.problemSounds && child.problemSounds.length > 0 && (
        <Text>Проблемні звуки: {child.problemSounds}</Text>
      )}

      <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
        <Button
          title={hasLogoped ? "Змінити логопеда" : "Додати логопеда"}
          onPress={() => onAssignPress(child.id)}
        />
        <Button
          title="✏️"
          onPress={() => {
            onEditPress(child);
            handleUpdated();
          }}
        />
        <Button
          title="🗑️"
          color="red"
          onPress={() => {
            Alert.alert("Підтвердити видалення", "Видалити дитину?", [
              { text: "Скасувати", style: "cancel" },
              {
                text: "Видалити",
                style: "destructive",
                onPress: () => onDeletePress(child.id),
              },
            ]);
          }}
        />
      </View>
    </View>
  );
}
