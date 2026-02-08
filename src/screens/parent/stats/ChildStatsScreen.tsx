// src/screens/parent/stats/ChildStatsScreen.tsx

import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useChildStore } from "../../../store/childStore";
import { useProgress } from "../../../hooks/useProgress";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

import { AttemptItem } from "./components/AttemptItem";
import { StatsOverview } from "./components/StatsOverview";
import { WeeklyChart } from "./components/WeeklyChart";

export function ChildStatsScreen() {
  const navigation = useNavigation<any>();

  const selectedChildId = useChildStore((s) => s.selectedChildId);
  const selectedChild = useChildStore((s) => s.selectedChild);

  const { summary, last, trend, loading, refresh } = useProgress(
    selectedChildId ?? undefined,
  );

  if (!selectedChildId || !selectedChild) {
    return (
      <Screen className="justify-center items-center px-6">
        <Text className="text-xl font-bold text-text-main text-center mb-2">
          Не обрано дитину 🤷‍♂️
        </Text>
        <Text className="text-text-muted text-center mb-6">
          Перейдіть на головну, щоб обрати профіль дитини.
        </Text>
        <Button
          title="На головну"
          onPress={() => navigation.navigate("Home")}
          className="w-full"
        />
      </Screen>
    );
  }

  if (loading && !summary) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader subtitle="Статистика" title={selectedChild.name} center />

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refresh}
        ListHeaderComponent={
          <View>
            {summary && (
              <StatsOverview
                avgAccuracy={summary.avgAccuracy}
                totalAttempts={summary.totalAttempts}
              />
            )}

            {trend && trend.length > 0 && <WeeklyChart data={trend} />}

            <Text className="text-lg font-bold text-text-main mb-3 mt-2">
              Історія занять 📜
            </Text>
          </View>
        }
        data={last}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AttemptItem item={item} />}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-gray-400">Поки що немає записів</Text>
          </View>
        }
      />
    </Screen>
  );
}
