//src\screens\parent\home\HomeParentScreen.tsx
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { childrenApi } from "../../../api/childrenApi";
import { ChildDto } from "../../../api/types/child";
import { useChildStore } from "../../../store/childStore";
import { useProgress } from "../../../hooks/useProgress";

import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";

import { ChildSelector } from "./components/ChildSelector";
import { HabitTracker } from "./components/HabitTracker";
import { SoundProgressBar } from "./components/SoundProgressBar";
import { BadgesGrid } from "./components/BadgesGrid";
import { buildHabit } from "../../../shared/utils/habit";
import ScreenHeader from "../../../shared/ui/ScreenHeader ";

export function HomeParentScreen() {
  const navigation = useNavigation<any>();

  const {
    selectedChild,
    selectedChildId,
    setSelectedChild,
    setSelectedChildData,
  } = useChildStore();

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);

  const { last: attempts } = useProgress(selectedChildId ?? undefined);

  const load = async () => {
    setLoading(true);

    try {
      const data = await childrenApi.getMyChildren();
      setChildren(data);

      if (data.length === 0) {
        setLoading(false);
        return;
      }

      const found = data.find((c) => Number(c.id) === selectedChildId);

      if (!found) {
        setSelectedChild(data[0]);
      } else if (selectedChildId && !selectedChild) {
        setSelectedChildData(found);
      }
    } catch (e) {
      console.warn("Failed to load children", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [selectedChildId]),
  );

  if (loading && children.length === 0) {
    return (
      <Screen className="justify-center items-center">
        <Text className="text-primary font-bold">Завантаження...</Text>
      </Screen>
    );
  }

  if (children.length === 0) {
    return (
      <Screen className="justify-center px-6">
        <View className="items-center mb-8">
          <Text className="text-6xl mb-4">🐣</Text>
          <Text className="text-2xl font-bold text-center mb-2">Привіт!</Text>
          <Text className="text-text-muted text-center mb-6">
            Щоб почати, додайте профіль вашої дитини
          </Text>
          <Button
            title="Додати дитину"
            onPress={() => navigation.navigate("Children")}
            className="w-full"
          />
        </View>
      </Screen>
    );
  }

  if (!selectedChild) {
    return (
      <Screen className="justify-center">
        <Text className="text-2xl font-bold text-center mb-6">
          Хто сьогодні займається?
        </Text>
        <ChildSelector
          children={children}
          selectedChildId={selectedChildId}
          onSelect={setSelectedChild}
        />
      </Screen>
    );
  }

  const habit = buildHabit(attempts ?? []);

  return (
    <Screen className="px-0 pb-0">
      {/* Header */}
      <ScreenHeader title="Головна" center />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
      >
        <ChildSelector
          children={children}
          selectedChildId={selectedChildId}
          onSelect={setSelectedChild}
        />

        <HabitTracker streak={habit.streak} days={habit.days} />

        <Card className="border-l-4 border-l-primary">
          <Text className="text-lg font-bold mb-2">План на сьогодні 📝</Text>
          <View className="space-y-2 mb-4">
            <Text className="text-text-main text-base">
              • Артикуляційна гімнастика
            </Text>
            <Text className="text-text-main text-base">
              • Гра "Поймай звук"
            </Text>
          </View>
          <Button
            title="Почати заняття"
            onPress={() => navigation.navigate("Games")}
            className="h-12"
          />
        </Card>

        <Card>
          <Text className="text-lg font-bold mb-4">Звуки в роботі</Text>
          <SoundProgressBar sound="Р" progress={65} />
          <SoundProgressBar sound="С" progress={80} />
          <SoundProgressBar sound="Ш" progress={40} />

          <Button
            title="Детальна статистика"
            variant="ghost"
            className="mt-2"
            onPress={() => navigation.navigate("Progress")}
          />
        </Card>

        <BadgesGrid />
      </ScrollView>
    </Screen>
  );
}
