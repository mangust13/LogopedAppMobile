import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { cn } from "../utils/cn";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  isLoading?: boolean;
  textClassName?: string;
}

export function Button({
  title,
  variant = "primary",
  isLoading,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary active:bg-primary-dark shadow-sm shadow-primary/30 border-2 border-transparent",
    secondary:
      "bg-secondary active:bg-secondary-light shadow-sm shadow-secondary/30 border-2 border-transparent",
    ghost: "bg-transparent border-2 border-transparent",
    outline: "bg-transparent border-2 border-primary active:bg-primary/5",
  };

  const textVariants = {
    primary: "text-white font-bold text-lg",
    secondary: "text-white font-bold text-lg",
    ghost: "text-primary font-semibold text-base",
    outline: "text-primary font-bold text-lg",
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
        <ActivityIndicator
          color={
            variant === "primary" || variant === "secondary"
              ? "#FFF"
              : "#6C63FF"
          }
        />
      ) : (
        <Text className={cn(textVariants[variant], textClassName)}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
