import { useState } from "react";
import { View, Text, Alert, Image, Platform } from "react-native";
import { Asset } from "expo-asset";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen } from "../../shared/ui/Screen";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/AuthStack";
import {
  validateLoginForm,
  hasErrors,
  ValidationErrors,
  LoginFields,
} from "../../shared/utils/validation";

const logoModule = require("../../../assets/logo.png");
const logoSource =
  Platform.OS === "web"
    ? { uri: Asset.fromModule(logoModule).uri }
    : logoModule;

export function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<LoginFields>>({});
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    const validationErrors = validateLoginForm({ email, password });
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });
      await setAuth(res.token, res.role, email);
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? "Невірні дані або проблема з мережею";
      Alert.alert("Помилка входу", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen className="pt-12 px-6">
      <View className="items-center mb-8">
        <Image
          source={logoSource}
          className="w-36 h-20 mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-primary mb-2">
          З поверненням! 👋
        </Text>
        <Text className="text-text-muted text-center text-base px-4">
          Увійдіть, щоб продовжити заняття
        </Text>
      </View>

      <View className="space-y-4 w-full">
        <Input
          label="Email"
          placeholder="user@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
        />

        <Input
          label="Пароль"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
        />

        <View className="h-2" />

        <Button title="Увійти" onPress={onLogin} isLoading={loading} />

        <Button
          title="Ще немає акаунту? Реєстрація"
          variant="ghost"
          onPress={() => navigation.navigate("Register")}
          disabled={loading}
          className="mt-2"
        />
      </View>
    </Screen>
  );
}
