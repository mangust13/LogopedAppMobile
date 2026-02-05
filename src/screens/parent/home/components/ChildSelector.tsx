//src/screens/parent/home/components/ChildSelector.tsx
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChildDto } from "../../../../api/types/child";
import { cn } from "../../../../shared/utils/cn";

type Props = {
  children: ChildDto[];
  selectedChildId: number | null;
  onSelect: (child: ChildDto) => void;
};

export function ChildSelector({ children, selectedChildId, onSelect }: Props) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-lg font-bold text-text-main">Мої діти</Text>
        <Text className="text-sm text-text-muted">{children.length}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
      >
        {children.map((child) => {
          const active = Number(child.id) === selectedChildId;
          const initial = child.name.charAt(0).toUpperCase();

          return (
            <TouchableOpacity
              key={child.id}
              onPress={() => onSelect(child)}
              activeOpacity={0.8}
              className="items-center space-y-2"
            >
              <View
                className={cn(
                  "w-14 h-14 rounded-full items-center justify-center border-2",
                  active
                    ? "bg-primary border-primary shadow-sm shadow-primary/40"
                    : "bg-surface border-gray-200",
                )}
              >
                <Text
                  className={cn(
                    "text-xl font-bold",
                    active ? "text-white" : "text-text-muted",
                  )}
                >
                  {initial}
                </Text>
              </View>

              <Text
                className={cn(
                  "text-xs font-medium",
                  active ? "text-primary" : "text-text-muted",
                )}
              >
                {child.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300 opacity-50">
          <Text className="text-2xl text-gray-400">+</Text>
        </View>
      </ScrollView>
    </View>
  );
}
