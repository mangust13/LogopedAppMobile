import { useNavigation } from "@react-navigation/native";
import { Text, ScrollView } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { useAuthStore } from "../../../store/authStore";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import {
  ProfileAccountSection,
  ProfileHeaderCard,
  ProfileItem,
  ProfileSection,
} from "../../../shared/ui/ProfileSection";
import { useProfileAccountActions } from "../../../hooks/useProfileAccountActions";

export function LogopedProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const { handleLogout, handleDeleteAccount } = useProfileAccountActions();

  return (
    <Screen>
      <ScreenHeader subtitle="Налаштування" title="Профіль 💼" center />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard
          email={email}
          fallbackName="Спеціаліст"
          fallbackInitial="L"
          badgeText="Логопед-дефектолог"
          avatarClassName="bg-indigo-50 border-indigo-100"
          avatarTextClassName="text-indigo-600"
          badgeClassName="bg-indigo-100 border-indigo-200"
          badgeTextClassName="text-indigo-700"
        />

        <ProfileSection title="Обліковий запис">
          <ProfileItem
            icon="mail"
            label="Email"
            value={email ?? ""}
            iconBgClassName="bg-indigo-50"
            iconColor="#4F46E5"
          />

          <ProfileItem
            icon="briefcase"
            label="Формат"
            value="Супровід + Контроль"
            showDivider={false}
            iconBgClassName="bg-indigo-50"
            iconColor="#4F46E5"
          />
        </ProfileSection>

        <ProfileSection title="Швидкий доступ">
          <ProfileItem
            icon="people"
            label="Список учнів"
            isLink
            onPress={() => navigation.navigate("Children")}
            iconBgClassName="bg-indigo-50"
            iconColor="#4F46E5"
          />

          <ProfileItem
            icon="game-controller"
            label="Каталог ігор"
            isLink
            onPress={() => navigation.navigate("Games")}
            iconBgClassName="bg-indigo-50"
            iconColor="#4F46E5"
          />

          <ProfileItem
            icon="stats-chart"
            label="Загальна статистика"
            isLink
            showDivider={false}
            onPress={() => navigation.navigate("Progress")}
            iconBgClassName="bg-indigo-50"
            iconColor="#4F46E5"
          />
        </ProfileSection>

        <ProfileAccountSection
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          iconBgClassName="bg-indigo-50"
          iconColor="#4F46E5"
        />

        <Text className="text-center text-xs text-gray-400 mt-2">
          Logoped App v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}
