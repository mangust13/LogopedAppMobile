import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { childrenApi, ChildDto } from "../../../api/childrenApi";
import { progressApi, SoundProgressSummaryDto } from "../../../api/progressApi";
import { activityApi, StreakDto } from "../../../api/activityApi";
import { useChildStore } from "../../../store/childStore";
import { parseProblemSounds } from "../../../shared/constants/sounds";

import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";

import { ChildSelector } from "./components/ChildSelector";
import { SoundProgressBar } from "./components/SoundProgressBar";
import { StreakCard } from "./components/StreakCard";

import ScreenHeader from "../../../shared/ui/ScreenHeader";
import { AddChildModal } from "../children/components/AddChildModal";

export function HomeParentScreen() {
  const navigation = useNavigation<any>();

  const {
    selectedChild,
    selectedChildId,
    setSelectedChild,
    setSelectedChildData,
  } = useChildStore();

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(true);
  const [soundProgress, setSoundProgress] = useState<SoundProgressSummaryDto[]>(
    [],
  );
  const [streak, setStreak] = useState<StreakDto | null>(null);
  const [activeDates, setActiveDates] = useState<string[]>([]);

  const loadStreak = useCallback(async (childId: number) => {
    try {
      const [streakData, datesData] = await Promise.all([
        activityApi.getStreak(childId),
        activityApi.getActiveDates(childId),
      ]);
      setStreak(streakData);
      setActiveDates(datesData);
    } catch {
      setStreak(null);
      setActiveDates([]);
    }
  }, []);

  const loadSoundProgress = useCallback(
    async (childId: number, child: ChildDto) => {
      const sounds = parseProblemSounds(child.problemSounds);
      if (sounds.length === 0) return;

      try {
        const data = await progressApi.getSoundsSummary(childId, sounds);
        setSoundProgress(data);
      } catch {
        setSoundProgress([]);
      }
    },
    [],
  );

  const load = useCallback(async (): Promise<{
    childId: number;
    child: ChildDto;
  } | null> => {
    setLoading(true);
    try {
      const data = await childrenApi.getMyChildren();
      setChildren(data);

      if (data.length === 0) return null;

      const found = data.find((c) => Number(c.id) === selectedChildId);

      if (!found) {
        setSelectedChild(data[0]);
        return { childId: Number(data[0].id), child: data[0] };
      }

      if (selectedChildId && !selectedChild) {
        setSelectedChildData(found);
      }

      return { childId: Number(found.id), child: found };
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedChildId, selectedChild]);

  const loadAll = useCallback(async () => {
    const result = await load();
    if (!result) return;

    const { childId, child } = result;

    await Promise.all([loadSoundProgress(childId, child), loadStreak(childId)]);
  }, [load, loadSoundProgress, loadStreak]);

  useFocusEffect(
    useCallback(() => {
      void loadAll();
    }, [loadAll]),
  );

  const renderContent = () => {
    if (loading && children.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-primary font-bold">Завантаження...</Text>
        </View>
      );
    }

    if (children.length === 0) {
      return (
        <View className="flex-1 justify-center px-6">
          <View className="bg-surface rounded-3xl p-6 border border-gray-100">
            <View className="items-center mb-6">
              <Text className="text-[72px] leading-[80px]">🐣</Text>
              <Text className="text-2xl font-bold text-center mb-2">
                Привіт!
              </Text>
              <Text className="text-text-muted text-center">
                Щоб почати, додайте профіль вашої дитини
              </Text>
            </View>
            <Button
              title="Додати дитину"
              onPress={() => setShowAddChild(true)}
              className="w-full"
            />
          </View>
        </View>
      );
    }

    if (!selectedChild) {
      return (
        <View className="flex-1 justify-center px-6">
          <Text className="text-2xl font-bold text-center mb-6">
            Хто сьогодні займається?
          </Text>
          <ChildSelector
            children={children}
            selectedChildId={selectedChildId}
            onSelect={setSelectedChild}
            onAddChild={() => setShowAddChild(true)}
          />
        </View>
      );
    }

    return (
      <>
        <ScreenHeader title="Головна" center />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 40,
            gap: 20,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadAll} />
          }
        >
          <ChildSelector
            children={children}
            selectedChildId={selectedChildId}
            onSelect={setSelectedChild}
            onAddChild={() => setShowAddChild(true)}
          />

          {streak && <StreakCard streak={streak} activeDates={activeDates} />}

          <Card className="border-l-4 border-l-primary">
            <Text className="text-lg font-bold mb-4">План на сьогодні 📝</Text>
            <Button
              title="🎙 Аналіз вимови"
              variant="outline"
              onPress={() => navigation.navigate("SoundAnalysis")}
              className="h-12"
            />
            <Button
              title="Почати заняття"
              onPress={() => navigation.navigate("Games")}
              className="h-12 mt-3"
            />
          </Card>

          {soundProgress.length > 0 && (
            <Card>
              <Text className="text-lg font-bold mb-4">Звуки в роботі</Text>
              {soundProgress.map((sp) => (
                <SoundProgressBar
                  key={sp.sound}
                  sound={sp.sound.toUpperCase()}
                  progress={sp.progressPercent}
                />
              ))}
              <Button
                title="Детальна статистика"
                variant="ghost"
                className="mt-2"
                onPress={() => navigation.navigate("Progress")}
              />
            </Card>
          )}
        </ScrollView>
      </>
    );
  };

  return (
    <Screen className="px-0 pb-0">
      {renderContent()}
      <AddChildModal
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
        onCreated={() => {
          setShowAddChild(false);
          navigation.navigate("Children");
        }}
      />
    </Screen>
  );
}
