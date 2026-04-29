import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../../../navigation/RootNavigator";
import { ChildDto } from "../../../../api/childrenApi";
import { Card } from "../../../../shared/ui/Card";
import { calcAge } from "../../../../shared/utils/age";
import { parseProblemSounds } from "../../../../shared/constants/sounds";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ChildProgress"
>;

type Props = {
  child: ChildDto;
  onEditProblemSounds: (child: ChildDto) => void;
};

export function ChildRow({ child, onEditProblemSounds }: Props) {
  const navigation = useNavigation<NavigationProp>();

  const childName = child.name || "Без імені";
  const birthDate = child.birthDate || "";
  const problemSounds = parseProblemSounds(child.problemSounds || "");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ChildProgress", {
          childId: Number(child.id),
          childName,
        })
      }
    >
      <Card className="p-4 border border-gray-100 flex-row items-center">
        <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4 border border-blue-100">
          <Text className="text-xl font-bold text-blue-600">
            {childName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-text-main mb-1">
            {childName}
          </Text>

          <View className="flex-row items-center mb-1">
            <Text className="text-sm text-text-muted mr-3">
              Вік: {birthDate ? calcAge(birthDate) : "не вказано"}
            </Text>
          </View>

          {problemSounds.length > 0 && (
            <View className="flex-row flex-wrap items-center gap-1 mt-1">
              <Text className="text-xs text-text-muted mr-1">
                Проблемні звуки:
              </Text>

              {problemSounds.map((sound, i) => (
                <View
                  key={`${sound}-${i}`}
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

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onEditProblemSounds(child);
            }}
            className="p-2 rounded-full bg-gray-50"
          >
            <Ionicons name="pencil-outline" size={18} color="#6B7280" />
          </TouchableOpacity>

          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
