//src/screens/auth/RegisterScreen.tsx
import { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { cn } from "../../shared/utils/cn";

type Role = "User" | "Logoped";

export function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!email || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть всі поля");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.register({
        email,
        password,
        role,
      });

      await setAuth(res.token, res.role, email);
    } catch (e: any) {
      let message = "Щось пішло не так. Спробуйте пізніше.";

      if (e.response) {
        message =
          e.response.data?.message ?? `Помилка сервера (${e.response.status})`;
      } else if (e.request) {
        message = "Немає зʼєднання з сервером";
      }

      Alert.alert("Помилка реєстрації", message);
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({
    value,
    label,
    description,
  }: {
    value: Role;
    label: string;
    description: string;
  }) => {
    const isSelected = role === value;
    return (
      <TouchableOpacity
        onPress={() => setRole(value)}
        activeOpacity={0.8}
        className={cn(
          "flex-1 p-4 rounded-2xl border-2 items-center justify-center space-y-2",
          isSelected
            ? "border-primary bg-primary/10"
            : "border-gray-200 bg-surface",
        )}
      >
        <Text
          className={cn(
            "text-lg font-bold",
            isSelected ? "text-primary" : "text-text-main",
          )}
        >
          {label}
        </Text>
        <Text className="text-xs text-center text-text-muted">
          {description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Screen className="pt-12 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-primary mb-2">
          Створити акаунт 🚀
        </Text>
        <Text className="text-text-muted text-base">
          Заповніть дані для реєстрації
        </Text>
      </View>

      <View className="space-y-4 w-full">
        <Input
          label="Email"
          placeholder="user@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Пароль"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View>
          <Text className="text-sm font-medium text-text-muted mb-3 ml-1">
            Хто буде користуватися додатком?
          </Text>
          <View className="flex-row gap-4 h-32">
            <RoleCard
              value="User"
              label="Батьки"
              description="Займаюся з дитиною вдома"
            />
            <RoleCard
              value="Logoped"
              label="Логопед"
              description="Проводжу логопедичні заняття"
            />
          </View>
        </View>

        <View className="h-4" />

        <Button
          title="Зареєструватися"
          onPress={onRegister}
          isLoading={loading}
        />

        <Button
          title="Вже є акаунт? Увійти"
          variant="ghost"
          onPress={() => navigation.navigate("Login")}
          disabled={loading}
          className="mt-2"
        />
      </View>
    </Screen>
  );
}
