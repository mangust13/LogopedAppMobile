//src\shared\ui\Screen.tsx
import { PropsWithChildren } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "../utils/cn";

type Props = PropsWithChildren<{
  className?: string;
}>;

export function Screen({ children, className }: Props) {
  return (
    <SafeAreaView
      className={cn("flex-1 bg-background", className)}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      {children}
    </SafeAreaView>
  );
}
