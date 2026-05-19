import { useNavigation } from "@react-navigation/native";
import { Text, ScrollView } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { useAuthStore } from "../../../store/authStore";
import { useChildStore } from "../../../store/childStore";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import {
  ProfileAccountSection,
  ProfileHeaderCard,
  ProfileItem,
  ProfileSection,
} from "../../../shared/ui/ProfileSection";
import { useProfileAccountActions } from "../../../hooks/useProfileAccountActions";

export function ParentProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const selectedChild = useChildStore((s) => s.selectedChild);
  const { handleLogout, handleDeleteAccount } = useProfileAccountActions();

  return (
    <Screen>
      <ScreenHeader subtitle="Налаштування" title="Профіль ⚙️" center />

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
          fallbackName="Користувач"
          fallbackInitial="U"
          badgeText="Батьківський акаунт"
          avatarClassName="bg-primary/10 border-primary/20"
          avatarTextClassName="text-primary"
          badgeClassName="bg-green-100 border-green-200"
          badgeTextClassName="text-green-700"
        />

        <ProfileSection title="Інформація">
          <ProfileItem
            icon="people"
            label="Активна дитина"
            value={selectedChild?.name ?? "Не обрано"}
          />

          <ProfileItem icon="mail" label="Email" value={email ?? ""} />

          {/* <ProfileItem
            icon="alarm"
            label="Нагадування"
            value="19:00"
            showDivider={false}
          /> */}
        </ProfileSection>

        <ProfileSection title="Керування">
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
            showDivider={false}
            onPress={() => navigation.navigate("Progress")}
          />
        </ProfileSection>

        <ProfileAccountSection
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />

        <Text className="text-center text-xs text-gray-400 mt-2">
          Logoped App v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}
