import { Text, View, Button, Alert, StyleSheet } from "react-native";
import { ChildDto } from "../../../../api/types/child";
import { calcAge } from "../../../../shared/utils/age";

type Props = {
  child: ChildDto & { problemSounds?: string | null };
  onAssignPress: (childId: number) => void;
  onEditPress: (child: ChildDto) => void;
  onDeletePress: (childId: number) => void;
  onViewProgress: () => void;
  onUpdated?: () => void;
};

export function ChildCard({
  child,
  onAssignPress,
  onEditPress,
  onDeletePress,
  onViewProgress,
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
    <View style={styles.card}>
      <Text style={styles.name}>{child.name}</Text>
      <Text>Вік: {calcAge(child.birthDate)}</Text>

      {hasLogoped && <Text>Логопед: {child.logopedEmail}</Text>}

      {child.problemSounds && child.problemSounds.length > 0 && (
        <Text>Проблемні звуки: {child.problemSounds}</Text>
      )}

      <View style={styles.row}>
        <View style={styles.btn}>
          <Button title="📊 Прогрес" onPress={onViewProgress} />
        </View>

        <View style={styles.btn}>
          <Button
            title={hasLogoped ? "Змінити логопеда" : "Додати логопеда"}
            onPress={() => onAssignPress(child.id)}
          />
        </View>

        <View style={styles.btn}>
          <Button
            title="✏️"
            onPress={() => {
              onEditPress(child);
              handleUpdated();
            }}
          />
        </View>

        <View style={styles.btn}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap", // щоб кнопки не виходили за екран
    gap: 0, // RN не підтримує gap, але залишив для читабельності
  },
  btn: {
    marginRight: 8,
    marginBottom: 8, // щоб було красиво у wrap
    minWidth: 110, // щоб кнопки не були занадто вузькі
  },
});
