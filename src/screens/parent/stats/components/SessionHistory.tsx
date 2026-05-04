import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionsApi, SessionDto } from "../../../../api/sessionsApi";

type Props = {
  childId: number;
};

export function SessionHistory({ childId }: Props) {
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionsApi
      .getByChild(childId)
      .then(setSessions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [childId]);

  if (loading) {
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#6C63FF" />
      </View>
    );
  }

  if (sessions.length === 0) {
    return (
      <View className="py-4 items-center gap-2">
        <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
        <Text className="text-gray-400 text-sm">
          Занять з логопедом ще немає
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {sessions.map((session) => {
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
          <View
            key={session.id}
            className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={15} color="#6C63FF" />
                </View>
                <View>
                  <Text className="font-bold text-text-main text-sm">
                    {dateStr}
                  </Text>
                  <Text className="text-gray-400 text-xs">{timeStr}</Text>
                </View>
              </View>

              {session.durationMinutes && (
                <View className="bg-primary/10 px-2.5 py-1 rounded-full">
                  <Text className="text-primary text-xs font-bold">
                    {session.durationMinutes} хв
                  </Text>
                </View>
              )}
            </View>

            {session.soundsWorkedOn.length > 0 && (
              <View className="flex-row flex-wrap gap-2 mb-2 ml-10">
                {session.soundsWorkedOn.map((sound) => (
                  <View
                    key={sound}
                    className="bg-white border border-primary/20 px-2.5 py-0.5 rounded-full"
                  >
                    <Text className="text-primary text-xs font-bold">
                      {sound.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {session.notes && (
              <Text className="text-gray-600 text-sm leading-5 ml-10">
                {session.notes}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
