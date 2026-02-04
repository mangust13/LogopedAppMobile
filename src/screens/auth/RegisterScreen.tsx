//src\screens\auth\RegisterScreen.tsx
import { useState } from "react";
import { Button, Text, TextInput, View, Alert, Pressable } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";

type Role = "User" | "Logoped";

export function RegisterScreen() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("User");
  const [loading, setLoading] = useState(false);

  // const onRegister = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await authApi.register({
  //       email,
  //       password,
  //       role,
  //     });

  //     await setAuth(res.token, res.role);
  //   } catch (e) {
  //     Alert.alert("Register error", "Failed to register. Try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onRegister = async () => {
  try {
    setLoading(true);

    const res = await authApi.register({
      email,
      password,
      role,
    });

    await setAuth(res.token, res.role, email);
  } catch (e: any) {
    Alert.alert(
      "Register error",
      e?.response?.data?.message ??
        "Failed to register. See console log."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Register</Text>

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

      <Text style={{ fontWeight: "500" }}>Role</Text>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        {(["User", "Logoped"] as Role[]).map((r) => (
          <Pressable
            key={r}
            onPress={() => setRole(r)}
            style={{
              padding: 12,
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor: role === r ? "#ddd" : "transparent",
            }}
          >
            <Text>{r}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ height: 24 }} />

      <Button
        title={loading ? "Loading..." : "Register"}
        onPress={onRegister}
        disabled={loading}
      />
    </Screen>
  );
}
