import { TextInput, TextInputProps, View, Text } from "react-native";
import { cn } from "../utils/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="space-y-2">
      {label && (
        <Text className="text-sm font-medium text-text-muted ml-1">
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          "w-full h-14 bg-surface px-4 rounded-2xl border border-gray-100 text-text-main text-base",
          "focus:border-primary focus:border-2",
          error && "border-error bg-error/5",
          className,
        )}
        placeholderTextColor="#A0AEC0"
        {...props}
      />
      {error && <Text className="text-xs text-error ml-1">{error}</Text>}
    </View>
  );
}
