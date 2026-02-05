// src/screens/tabs/components/SummaryCard.tsx
import { View, Text } from "react-native";
import { cn } from "../utils/cn";

type Props = {
  label: string;
  value: string | number;
  className?: string;
  variant?: "default" | "accent";
};

export function SummaryCard({
  label,
  value,
  className,
  variant = "default",
}: Props) {
  return (
    <View
      className={cn(
        "flex-1 p-4 rounded-2xl shadow-sm border border-gray-100 min-w-[100px]",
        variant === "default"
          ? "bg-surface"
          : "bg-primary/10 border-primary/20",
        className,
      )}
    >
      <Text
        className={cn(
          "text-xs font-medium uppercase tracking-wider mb-2",
          variant === "default" ? "text-text-muted" : "text-primary-dark",
        )}
      >
        {label}
      </Text>

      <Text
        className={cn(
          "text-2xl font-bold",
          variant === "default" ? "text-primary" : "text-primary-dark",
        )}
      >
        {value}
      </Text>
    </View>
  );
}
