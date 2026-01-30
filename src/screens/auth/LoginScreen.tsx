import { useState } from "react";
import { Button, Text, TextInput, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen } from "../../shared/ui/Screen";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList } from "../../navigation/AuthStack";

export function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);

      const res = await authApi.login({ email, password });
      await setAuth(res.token, res.role);
    } catch (e) {
      Alert.alert("Login error", "Invalid credentials or network issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Login</Text>

      <View style={{ height: 16 }} />

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <View style={{ height: 12 }} />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <View style={{ height: 16 }} />

      <Button
        title={loading ? "Loading..." : "Login"}
        onPress={onLogin}
        disabled={loading}
      />

      <View style={{ height: 16 }} />

      <Text
        style={{ textAlign: "center", color: "blue" }}
        onPress={() => navigation.navigate("Register")}
      >
        Don’t have an account? Register
      </Text>
    </Screen>
  );
}
