//src\screens\logoped\stats\LogopedStudentStatsScreen.tsx

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useProgress } from "../../../hooks/useProgress";
import { Screen } from "../../../shared/ui/Screen";
import { RootStackParamList } from "../../../navigation/RootNavigator";

import { AttemptItem } from "../../parent/stats/components/AttemptItem";
import { StatsOverview } from "../../parent/stats/components/StatsOverview";
import { WeeklyChart } from "../../parent/stats/components/WeeklyChart";
import ScreenHeader from "../../../shared/ui/ScreenHeader ";

type ScreenRouteProp = RouteProp<RootStackParamList, "ChildProgress">;

export function LogopedStudentStatsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();

  const { childId, childName } = route.params;

  const { summary, last, trend, loading, refresh } = useProgress(childId);

  if (loading && !summary) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-row items-center bg-white border-b border-gray-100 px-4 py-3">
        {/* Кнопка назад */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center ml-2">
          <Text className="text-lg font-bold text-primary">{childName}</Text>
          <Text className="text-xs text-text-muted mt-0.5">Профіль учня</Text>
        </View>

        <View className="w-10 h-10" />
      </View>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          paddingTop: 20,
        }}
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
              Історія виконання 📜
            </Text>
          </View>
        }
        data={last}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <AttemptItem item={item} />}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-gray-400">Історія занять порожня</Text>
          </View>
        }
      />
    </Screen>
  );
}
