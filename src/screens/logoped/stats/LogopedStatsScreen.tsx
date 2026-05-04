// src/screens/logoped/stats/LogopedStatsScreen.tsx
import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import { sessionsApi, SessionDto } from "../../../api/sessionsApi";
import { logopedApi } from "../../../api/logopedApi";
import { ChildDto } from "../../../api/childrenApi";
import { AddSessionModal } from "./components/AddSessionModal";
import { SessionCard } from "./components/SessionCard";

export function LogopedStatsScreen() {
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionDto | null>(null);
  const [filterChildId, setFilterChildId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsData, childrenData] = await Promise.all([
        sessionsApi.getMySessions(),
        logopedApi.getLogopedChildren(),
      ]);
      setSessions(sessionsData);
      setChildren(childrenData);
    } catch {
      Alert.alert("Помилка", "Не вдалося завантажити дані");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleDelete = (sessionId: number) => {
    Alert.alert("Видалити заняття?", "Цю дію не можна скасувати", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          try {
            await sessionsApi.delete(sessionId);
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
          } catch {
            Alert.alert("Помилка", "Не вдалося видалити заняття");
          }
        },
      },
    ]);
  };

  const getChildName = (childId: number) =>
    children.find((c) => Number(c.id) === childId)?.name ?? "Невідомо";

  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const sessionsToday = sessions.filter(
    (s) => new Date(s.date).toDateString() === todayStr,
  ).length;

  const sessionsWeek = sessions.filter(
    (s) => new Date(s.date) >= weekAgo,
  ).length;

  const sessionsMonth = sessions.filter(
    (s) => new Date(s.date) >= monthAgo,
  ).length;

  const stats = [
    {
      label: "Сьогодні",
      value: sessionsToday,
      icon: "today-outline",
      color: "#3B82F6",
      bg: "bg-blue-50",
    },
    {
      label: "Цей тиждень",
      value: sessionsWeek,
      icon: "calendar-outline",
      color: "#9333EA",
      bg: "bg-purple-50",
    },
    {
      label: "Цей місяць",
      value: sessionsMonth,
      icon: "stats-chart-outline",
      color: "#16A34A",
      bg: "bg-green-50",
    },
    {
      label: "Всього",
      value: sessions.length,
      icon: "layers-outline",
      color: "#EA580C",
      bg: "bg-orange-50",
    },
  ];

  const filteredSessions = filterChildId
    ? sessions.filter((s) => s.childId === filterChildId)
    : sessions;

  return (
    <Screen>
      <ScreenHeader subtitle="Дашборд" title="Моя активність 📈" center />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 120,
            gap: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap gap-3 justify-between">
            {stats.map((s) => (
              <Card
                key={s.label}
                className="w-[47%] p-4 items-center justify-center aspect-square"
              >
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${s.bg}`}
                >
                  <Ionicons name={s.icon as any} size={24} color={s.color} />
                </View>
                <Text className="text-3xl font-bold text-text-main mb-1">
                  {s.value}
                </Text>
                <Text className="text-xs text-text-muted text-center font-bold uppercase tracking-wide">
                  {s.label}
                </Text>
              </Card>
            ))}
          </View>

          {children.length > 0 && (
            <View>
              <Text className="text-base font-bold text-text-main mb-3">
                Фільтр по учню
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                <TouchableOpacity
                  onPress={() => setFilterChildId(null)}
                  className={`px-4 py-2 rounded-full border ${
                    filterChildId === null
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-200"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      filterChildId === null ? "text-white" : "text-gray-600"
                    }`}
                  >
                    Всі
                  </Text>
                </TouchableOpacity>

                {children.map((child) => {
                  const isSelected = filterChildId === Number(child.id);
                  return (
                    <TouchableOpacity
                      key={child.id}
                      onPress={() =>
                        setFilterChildId(isSelected ? null : Number(child.id))
                      }
                      className={`px-4 py-2 rounded-full border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {child.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-bold text-text-main">
                Проведені заняття
              </Text>
              <Text className="text-sm text-gray-400">
                {filteredSessions.length}
              </Text>
            </View>

            {filteredSessions.length === 0 ? (
              <View className="py-10 items-center gap-3">
                <Ionicons name="calendar-outline" size={44} color="#CBD5E1" />
                <Text className="text-gray-400 text-base">Занять ще немає</Text>
                <Text className="text-gray-300 text-sm text-center">
                  Натисніть + щоб додати перше заняття
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    childName={getChildName(session.childId)}
                    onEdit={() => setEditingSession(session)}
                    onDelete={() => handleDelete(session.id)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center"
        style={{
          shadowColor: "#6C63FF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddSessionModal
        visible={showAddModal || !!editingSession}
        session={editingSession}
        children={children}
        onClose={() => {
          setShowAddModal(false);
          setEditingSession(null);
        }}
        onSaved={() => {
          setShowAddModal(false);
          setEditingSession(null);
          load();
        }}
      />
    </Screen>
  );
}
