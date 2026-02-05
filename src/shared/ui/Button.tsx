import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { cn } from "../utils/cn";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  isLoading,
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-primary active:bg-primary-dark shadow-sm shadow-primary/30",
    secondary:
      "bg-secondary active:bg-secondary-light shadow-sm shadow-secondary/30",
    ghost: "bg-transparent",
  };

  const textVariants = {
    primary: "text-white font-bold text-lg",
    secondary: "text-white font-bold text-lg",
    ghost: "text-primary font-semibold text-base",
  };

  return (
    <TouchableOpacity
      disabled={isLoading || props.disabled}
      className={cn(
        "h-14 rounded-2xl flex-row justify-center items-center px-6",
        variants[variant],
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "ghost" ? "#6C63FF" : "#FFF"} />
      ) : (
        <Text className={textVariants[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
