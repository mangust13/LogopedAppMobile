// src/screens/logoped/sessions/components/SessionCard.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SessionDto } from "../../../../api/sessionsApi";

type Props = {
  session: SessionDto;
  childName: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function SessionCard({ session, childName, onEdit, onDelete }: Props) {
  const date = new Date(session.date);

  const dateStr = date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeStr = date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
              <Ionicons name="person" size={16} color="#6C63FF" />
            </View>
            <Text className="font-bold text-text-main text-base">
              {childName}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 ml-10">
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
              <Text className="text-xs text-gray-500">{dateStr}</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={13} color="#94A3B8" />
              <Text className="text-xs text-gray-500">{timeStr}</Text>
            </View>

            {session.durationMinutes && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="hourglass-outline" size={13} color="#94A3B8" />
                <Text className="text-xs text-gray-500">
                  {session.durationMinutes} хв
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onEdit}
            className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={15} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className="w-8 h-8 bg-red-50 rounded-full items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={15} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {session.soundsWorkedOn.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-2 ml-10">
          {session.soundsWorkedOn.map((sound) => (
            <View
              key={sound}
              className="bg-primary/10 px-2.5 py-1 rounded-full"
            >
              <Text className="text-primary text-xs font-bold">
                {sound.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {session.notes && (
        <View className="ml-10 bg-gray-50 rounded-xl px-3 py-2">
          <Text className="text-gray-600 text-sm leading-5">
            {session.notes}
          </Text>
        </View>
      )}
    </View>
  );
}
