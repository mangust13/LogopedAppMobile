//src/screens/parent/children/components/ChildCard.tsx
import { Text, View, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ChildDto } from "../../../../api/types/child";
import { calcAge } from "../../../../shared/utils/age";
import { Card } from "../../../../shared/ui/Card";
import { Button } from "../../../../shared/ui/Button";
import { cn } from "../../../../shared/utils/cn";

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
    if (onUpdated) onUpdated();
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити профіль?",
      `Ви впевнені, що хочете видалити профіль "${child.name}"? Цю дію неможливо скасувати.`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => onDeletePress(child.id),
        },
      ],
    );
  };

  return (
    <Card className="mb-4 p-4">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3 border border-primary/20">
            <Text className="text-lg font-bold text-primary">
              {child.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-bold text-text-main">
              {child.name}
            </Text>
            <Text className="text-sm text-text-muted">
              Вік: {calcAge(child.birthDate)}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-1">
          <TouchableOpacity
            onPress={() => {
              onEditPress(child);
              handleUpdated();
            }}
            className="p-2 rounded-full bg-gray-50"
          >
            <Ionicons name="pencil-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2 rounded-full bg-red-50"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4">
        {child.problemSounds && child.problemSounds.length > 0 && (
          <View className="mb-4">
            {child.problemSounds && child.problemSounds.length > 0 && (
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-xs text-text-muted ml-1">
                  Проблемні звуки:
                </Text>

                {child.problemSounds.split(",").map((sound, index) => (
                  <View
                    key={index}
                    className="bg-red-50 px-2 py-0.5 rounded border border-red-100"
                  >
                    <Text className="text-red-600 font-bold text-xs">
                      {sound.trim()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View
          className={cn(
            "flex-row items-center px-3 py-2 rounded-lg border",
            hasLogoped
              ? "bg-green-50 border-green-100"
              : "bg-gray-50 border-gray-100",
          )}
        >
          <Ionicons
            name={hasLogoped ? "medkit" : "alert-circle-outline"}
            size={16}
            color={hasLogoped ? "#15803d" : "#9CA3AF"}
            style={{ marginRight: 6 }}
          />
          <Text
            className={cn(
              "text-xs font-medium flex-1",
              hasLogoped ? "text-green-700" : "text-text-muted",
            )}
          >
            {hasLogoped
              ? `Логопед: ${child.logopedEmail}`
              : "Логопед не призначений"}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Button
          title="Прогрес"
          onPress={onViewProgress}
          className="flex-1 h-10"
        />
        <Button
          title={hasLogoped ? "Логопед" : "+ Логопед"}
          variant="outline"
          onPress={() => onAssignPress(child.id)}
          className="flex-1 h-10"
        />
      </View>
    </Card>
  );
}
