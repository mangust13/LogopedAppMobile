import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../utils/cn";

type Props = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function BackHeader({
  title,
  subtitle,
  onBackPress,
  titleClassName,
  subtitleClassName,
}: Props) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="w-full self-stretch flex-row items-center px-4 py-2 bg-white border-b border-gray-100">
      <TouchableOpacity
        onPress={handleBack}
        className="w-10 h-10 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={26} color="#007AFF" />
      </TouchableOpacity>

      <View className="flex-1 items-center px-2">
        {subtitle ? (
          <>
            <Text
              className={cn(
                "text-text-muted text-xs uppercase font-bold tracking-widest",
                subtitleClassName,
              )}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
            <Text
              className={cn("text-xl font-bold text-primary", titleClassName)}
              numberOfLines={1}
            >
              {title}
            </Text>
          </>
        ) : (
          <Text
            className={cn(
              "text-xl font-bold text-black text-center",
              titleClassName,
            )}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      <View className="w-10" />
    </View>
  );
}
