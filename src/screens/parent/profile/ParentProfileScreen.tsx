//src/screens/parent/profile/ParentProfileScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";
import { useAuthStore } from "../../../store/authStore";
import { useChildStore } from "../../../store/childStore";
import { cn } from "../../../shared/utils/cn";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

export function ParentProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const selectedChild = useChildStore((s) => s.selectedChild);

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
      <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
        <Ionicons name={icon} size={18} color="#6C63FF" />
      </View>
      <View className="flex-1">
        <Text className="text-text-main font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="text-text-muted text-sm mr-2">{value}</Text>}
        {isLink && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <ScreenHeader subtitle="Налаштування" title={"Профіль ⚙️"} center />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="items-center p-6">
          <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-3 border-2 border-primary/20">
            <Text className="text-3xl font-bold text-primary">
              {email ? email.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text className="text-lg font-bold text-text-main mb-1">
            {email || "Користувач"}
          </Text>
          <View className="bg-green-100 px-3 py-1 rounded-full">
            <Text className="text-green-700 text-xs font-bold uppercase">
              Батьківський акаунт
            </Text>
          </View>
        </Card>

        <Card className="p-0 px-4">
          <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
            Інформація
          </Text>
          <ProfileItem
            icon="people"
            label="Активна дитина"
            value={selectedChild?.name ?? "Не обрано"}
          />
          <ProfileItem icon="mail" label="Email" value={email ?? ""} />
        </Card>

        <Card className="p-0 px-4">
          <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
            Параметри занять (Демо)
          </Text>
          <ProfileItem icon="alarm" label="Нагадування" value="19:00" />
          <ProfileItem icon="timer" label="Тривалість сесії" value="10 хв" />
          <ProfileItem
            icon="speedometer"
            label="Темп навчання"
            value="М'який"
          />
        </Card>

        <Card className="p-0 px-4">
          <Text className="text-sm font-bold text-text-muted mt-4 mb-2 uppercase">
            Керування
          </Text>
          <ProfileItem
            icon="people-circle"
            label="Керувати дітьми"
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
            label="Загальний прогрес"
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
          Version 1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}
