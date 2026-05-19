import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
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
import { userApi } from "../../../api/userApi";
import { Ionicons } from "@expo/vector-icons";

export function LogopedProfileScreen() {
  const navigation = useNavigation<any>();
  const email = useAuthStore((s) => s.email);
  const firstName = useAuthStore((s) => s.firstName);
  const lastName = useAuthStore((s) => s.lastName);
  const setProfile = useAuthStore((s) => s.setProfile);

  const { handleLogout, handleDeleteAccount } = useProfileAccountActions();

  const [editing, setEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(firstName ?? "");
  const [lastNameInput, setLastNameInput] = useState(lastName ?? "");
  const [saving, setSaving] = useState(false);

  const fullName =
    firstName || lastName
      ? `${firstName ?? ""} ${lastName ?? ""}`.trim()
      : null;

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await userApi.updateProfile({
        firstName: firstNameInput.trim() || undefined,
        lastName: lastNameInput.trim() || undefined,
      });
      setProfile(updated.firstName ?? null, updated.lastName ?? null);
      setEditing(false);
    } catch {
      Alert.alert("Помилка", "Не вдалося зберегти");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFirstNameInput(firstName ?? "");
    setLastNameInput(lastName ?? "");
    setEditing(false);
  };

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
          fallbackName={fullName ?? "Спеціаліст"}
          fallbackInitial={firstName?.[0]?.toUpperCase() ?? "L"}
          badgeText="Логопед-дефектолог"
          avatarClassName="bg-indigo-50 border-indigo-100"
          avatarTextClassName="text-indigo-600"
          badgeClassName="bg-indigo-100 border-indigo-200"
          badgeTextClassName="text-indigo-700"
        />

        {/* Редагування імені */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-text-main">
              Особисті дані
            </Text>

            {!editing ? (
              <TouchableOpacity
                onPress={() => setEditing(true)}
                className="flex-row items-center gap-1"
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={14} color="#4F46E5" />
                <Text className="text-indigo-600 text-sm font-semibold">
                  Редагувати
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
                <Text className="text-gray-400 text-sm font-semibold">
                  Скасувати
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View className="gap-3">
              <View>
                <Text className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Ім'я
                </Text>
                <TextInput
                  value={firstNameInput}
                  onChangeText={setFirstNameInput}
                  placeholder="Введіть ім'я"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                  Прізвище
                </Text>
                <TextInput
                  value={lastNameInput}
                  onChangeText={setLastNameInput}
                  placeholder="Введіть прізвище"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
                />
              </View>

              <TouchableOpacity
                onPress={handleSave}
                disabled={saving}
                className="bg-indigo-600 rounded-xl py-3 items-center mt-1"
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Зберегти
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-2">
              <View className="flex-row items-center justify-between py-2 border-b border-gray-50">
                <Text className="text-gray-500 text-sm">Ім'я</Text>
                <Text className="text-text-main font-semibold text-sm">
                  {firstName ?? "—"}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-500 text-sm">Прізвище</Text>
                <Text className="text-text-main font-semibold text-sm">
                  {lastName ?? "—"}
                </Text>
              </View>
            </View>
          )}
        </View>

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
