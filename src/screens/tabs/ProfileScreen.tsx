import { Button, Text, View } from "react-native";
import { Screen } from "../../shared/ui/Screen";
import { useAuthStore } from "../../store/authStore";

export function ProfileScreen() {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Profile</Text>
      <View style={{ height: 12 }} />
      <Text>Role: {role ?? "none"}</Text>
      <View style={{ height: 12 }} />
      <Button title="Logout" onPress={logout} />
    </Screen>
  );
}
