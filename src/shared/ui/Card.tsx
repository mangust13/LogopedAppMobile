import { View, ViewProps } from "react-native";

export const Card = ({ children, className, ...props }: ViewProps) => {
  return (
    <View
      className={`bg-surface p-5 rounded-3xl shadow-sm shadow-gray-200 border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
