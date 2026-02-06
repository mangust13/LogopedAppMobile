// src/screens/logoped/children/components/ChildRow.tsx

import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../../navigation/RootNavigator";
import { ChildDto } from "../../../../api/types/child";
import { Card } from "../../../../shared/ui/Card";
import { calcAge } from "../../../../shared/utils/age";

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
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ChildProgress", {
          childId: Number(child.id),
          childName: child.name,
        })
      }
    >
      <Card className="p-4 border border-gray-100 flex-row items-center">
        {/* Аватар */}
        <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4 border border-blue-100">
          <Text className="text-xl font-bold text-blue-600">
            {child.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Інформація */}
        <View className="flex-1">
          <Text className="text-lg font-bold text-text-main mb-1">
            {child.name}
          </Text>

          <View className="flex-row items-center mb-1">
            <Text className="text-sm text-text-muted mr-3">
              Вік: {calcAge(child.birthDate)}
            </Text>
          </View>

          {child.problemSounds && (
            <View className="flex-row flex-wrap items-center gap-1 mt-1">
              <Text className="text-xs text-text-muted mr-1">
                Проблемні звуки:
              </Text>

              {child.problemSounds.split(",").map((sound, i) => (
                <View
                  key={i}
                  className="bg-red-50 px-1.5 py-0.5 rounded border border-red-100"
                >
                  <Text className="text-[10px] font-bold text-red-600">
                    {sound.trim()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </Card>
    </TouchableOpacity>
  );
}
