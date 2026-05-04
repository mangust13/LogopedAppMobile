import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { RootStackParamList } from "../../../navigation/RootNavigator";
import { SessionHistory } from "../../parent/stats/components/SessionHistory";

type ScreenRouteProp = RouteProp<RootStackParamList, "ChildProgress">;

export function LogopedStudentStatsScreen() {
  const navigation = useNavigation();
  const route = useRoute<ScreenRouteProp>();
  const { childId, childName } = route.params;

  return (
    <Screen>
      <View className="flex-row items-center bg-white border-b border-gray-100 px-4 py-3">
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

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          paddingTop: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg font-bold text-text-main mb-3">
          Заняття з логопедом 📋
        </Text>

        <SessionHistory childId={childId} />
      </ScrollView>
    </Screen>
  );
}
