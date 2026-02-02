// src/screens/logoped/children/components/ChildRow.tsx
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/RootNavigator";
import { ChildDto } from "../../../../api/types/child";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChildProgress"
>;

type Props = {
  child: ChildDto;
};

export function ChildRow({ child }: Props) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{child.name}</Text>

      <Text style={{ marginTop: 4, color: "#6b7280" }}>
        Дата народження: {child.birthDate}
      </Text>

      {child.problemSounds && (
        <Text style={{ marginTop: 4, color: "#374151" }}>
          Проблемні звуки: {child.problemSounds}
        </Text>
      )}

      <View style={{ height: 8 }} />

      <Pressable
        onPress={() =>
          navigation.navigate("ChildProgress", { childId: Number(child.id) })
        }
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          alignSelf: "flex-start",
          borderRadius: 8,
          backgroundColor: "#2563eb",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Переглянути прогрес
        </Text>
      </Pressable>
    </View>
  );
}
