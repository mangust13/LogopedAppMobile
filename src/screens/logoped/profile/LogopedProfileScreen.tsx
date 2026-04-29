//src/screens/logoped/profile/LogopedProfileScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { useAuthStore } from "../../../store/authStore";
import { cn } from "../../../shared/utils/cn";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

export function LogopedProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert("Вихід", "Ви дійсно хочете вийти з акаунту?", [
      { text: "Скасувати", style: "cancel" },
      { text: "Вийти", style: "destructive", onPress: logout },
    ]);
  };

  const ProfileItem = ({
    icon,
    label,
    value,
    onPress,
    isLink = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    isLink?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        "flex-row items-center py-3 border-b border-gray-100 last:border-0",
        onPress ? "active:opacity-70" : "",
      )}
    >
      <View className="w-8 h-8 rounded-full bg-indigo-50 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#4F46E5" />
      </View>
      <View className="flex-1">
        <Text className="text-text-main font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && (
          <Text
            className="text-text-muted text-sm mr-2 max-w-[150px]"
            numberOfLines={1}
          >
            {value}
          </Text>
        )}
        {isLink && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScreenHeader subtitle="Налаштування" title={"Профіль 💼"} center />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="items-center p-6 bg-white">
          <View className="w-20 h-20 bg-indigo-50 rounded-full items-center justify-center mb-3 border-2 border-indigo-100">
            <Text className="text-3xl font-bold text-indigo-600">
              {email ? email.charAt(0).toUpperCase() : "L"}
            </Text>
          </View>
          <Text className="text-lg font-bold text-text-main mb-1">
            {email || "Спеціаліст"}
          </Text>
          <View className="bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
            <Text className="text-indigo-700 text-xs font-bold uppercase">
              Логопед-дефектолог
            </Text>
          </View>
        </Card>

        <Card className="p-0 px-4">
          <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
            Обліковий запис
          </Text>
          <ProfileItem icon="mail" label="Email" value={email ?? ""} />
          <ProfileItem
            icon="briefcase"
            label="Формат"
            value="Супровід + Контроль"
          />
        </Card>

        <Card className="p-0 px-4">
          <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
            Швидкий доступ
          </Text>
          <ProfileItem
            icon="people"
            label="Список учнів"
            isLink
            onPress={() => navigation.navigate("Children")}
          />
          <ProfileItem
            icon="game-controller"
            label="Каталог ігор"
            isLink
            onPress={() => navigation.navigate("Games")}
          />
          <ProfileItem
            icon="stats-chart"
            label="Загальна статистика"
            isLink
            onPress={() => navigation.navigate("Progress")}
          />
        </Card>

        <Button
          title="Вийти з акаунту"
          onPress={handleLogout}
          variant="ghost"
          className="bg-red-50 border-red-100 mt-4"
          textClassName="text-red-600"
        />

        <Text className="text-center text-xs text-gray-400 mt-2">
          Logoped App v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}
