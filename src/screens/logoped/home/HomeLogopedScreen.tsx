import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";

import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import { sessionsApi, SessionDto } from "../../../api/sessionsApi";
import { logopedApi } from "../../../api/logopedApi";
import { activityApi, InactiveChildDto } from "../../../api/activityApi";
import { ChildDto } from "../../../api/childrenApi";
import { Ionicons } from "@expo/vector-icons";

const INACTIVE_THRESHOLD_DAYS = 3;
const RECENT_SESSIONS_COUNT = 3;

type AttentionLevel = "high" | "medium" | "low";

function getAttentionLevel(daysInactive: number): AttentionLevel {
  if (daysInactive >= 7) return "high";
  if (daysInactive >= 5) return "medium";
  return "low";
}

export function HomeLogopedScreen() {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [children, setChildren] = useState<ChildDto[]>([]);
  const [inactiveChildren, setInactiveChildren] = useState<InactiveChildDto[]>(
    [],
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const [sessionsData, childrenData] = await Promise.all([
        sessionsApi.getMySessions(),
        logopedApi.getLogopedChildren(),
      ]);

      setSessions(sessionsData);
      setChildren(childrenData);

      if (childrenData.length > 0) {
        const childIds = childrenData.map((c) => Number(c.id));
        const inactive = await activityApi.getInactiveChildren(
          childIds,
          INACTIVE_THRESHOLD_DAYS,
        );
        setInactiveChildren(inactive);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const today = new Date().toDateString();

  const todaysSessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === today,
  );

  const todaysUniqueChildren = new Set(todaysSessions.map((s) => s.childId))
    .size;

  const recentSessions = sessions.slice(0, RECENT_SESSIONS_COUNT);

  const getChildName = (childId: number) =>
    children.find((c) => Number(c.id) === childId)?.name ?? "Невідомо";

  const Stat = ({ label, value }: { label: string; value: any }) => (
    <View className="items-center flex-1">
      <Text className="text-2xl font-bold text-primary mb-1">{value}</Text>
      <Text className="text-xs text-text-muted uppercase font-bold tracking-wider text-center">
        {label}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Головна" center />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
      >
        {/* Сьогодні */}
        <Card>
          <Text className="text-lg font-bold mb-4 text-text-main">
            Сьогодні 📅
          </Text>

          <View className="flex-row justify-between divide-x divide-gray-100">
            <Stat label="Занять" value={todaysSessions.length} />
            <Stat label="Учнів" value={todaysUniqueChildren} />
            <Stat label="Всього учнів" value={children.length} />
          </View>
        </Card>

        {/* Потребують уваги */}
        {inactiveChildren.length > 0 && (
          <Card>
            <Text className="text-lg font-bold mb-3 text-text-main">
              Потребують уваги ⚠️
            </Text>

            <View>
              {inactiveChildren.map((item) => {
                const level = getAttentionLevel(item.daysInactive);
                const childName = getChildName(item.childId);

                return (
                  <View
                    key={item.childId}
                    className={cn(
                      "flex-row justify-between items-center p-3 rounded-xl border mb-2",
                      level === "high" && "bg-red-50 border-red-100",
                      level === "medium" && "bg-orange-50 border-orange-100",
                      level === "low" && "bg-cyan-50 border-cyan-100",
                    )}
                  >
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="font-bold text-text-main">
                          {childName}
                        </Text>
                        <PriorityBadge level={level} />
                      </View>
                      <Text className="text-xs text-text-muted">
                        Немає активності {item.daysInactive}{" "}
                        {item.daysInactive === 1
                          ? "день"
                          : item.daysInactive < 5
                            ? "дні"
                            : "днів"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => navigation.navigate("Children")}
                    >
                      <Text className="text-primary font-bold text-sm">
                        Деталі
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </Card>
        )}

        {recentSessions.length > 0 && (
          <Card>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-text-main">
                Останні заняття 📋
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Progress")}>
                <Text className="text-primary text-sm font-semibold">Всі</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {recentSessions.map((session) => {
                const date = new Date(session.date);
                const dateStr = date.toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "short",
                });
                const timeStr = date.toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <View
                    key={session.id}
                    className="flex-row items-center justify-between py-2 border-b border-gray-50"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                        <Ionicons name="person" size={15} color="#6C63FF" />
                      </View>
                      <View>
                        <Text className="font-semibold text-text-main text-sm">
                          {getChildName(session.childId)}
                        </Text>
                        {session.soundsWorkedOn.length > 0 && (
                          <Text className="text-xs text-gray-400">
                            Звуки:{" "}
                            {session.soundsWorkedOn.join(", ").toUpperCase()}
                          </Text>
                        )}
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-xs text-gray-500 font-medium">
                        {dateStr}
                      </Text>
                      <Text className="text-xs text-gray-400">{timeStr}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        )}

        <View>
          <Text className="text-lg font-bold mb-3 text-text-main">
            Швидкі дії
          </Text>

          <View className="flex-row gap-3">
            <Button
              title="Всі учні"
              variant="secondary"
              className="flex-1"
              onPress={() => navigation.navigate("Children")}
            />
            <Button
              title="Звіти"
              variant="outline"
              className="flex-1"
              onPress={() => navigation.navigate("Progress")}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function PriorityBadge({ level }: { level: AttentionLevel }) {
  const styles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-cyan-100 text-cyan-700",
  };

  const labels = {
    high: "Високий",
    medium: "Середній",
    low: "Низький",
  };

  return (
    <View
      className={cn(
        "px-2 py-0.5 rounded-full ml-2",
        styles[level].split(" ")[0],
      )}
    >
      <Text
        className={cn("text-[10px] font-bold", styles[level].split(" ")[1])}
      >
        {labels[level]}
      </Text>
    </View>
  );
}
