//src\screens\auth\LoginScreen.tsx
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
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Помилка", "Будь ласка, заповніть всі поля");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login({ email, password });
      await setAuth(res.token, res.role, email);
    } catch (e) {
      Alert.alert("Помилка входу", "Невірні дані або проблема з мережею");
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
          onChangeText={setEmail}
        />

        <Input
          label="Пароль"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
