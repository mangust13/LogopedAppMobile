//src/screens/parent/stats/components/StatsOverview.tsx
import { View, Text } from "react-native";
import { Card } from "../../../../shared/ui/Card";

type Props = {
  avgAccuracy: number;
  totalAttempts: number;
};

export function StatsOverview({ avgAccuracy, totalAttempts }: Props) {
  return (
    <View className="flex-row gap-3 mb-4">
      <Card className="flex-1 bg-primary/5 border-primary/20 items-center p-3">
        <Text className="text-3xl font-bold text-primary">{avgAccuracy}%</Text>
        <Text className="text-xs text-text-muted font-bold uppercase mt-1">
          Середня точність
        </Text>
      </Card>

      <Card className="flex-1 bg-secondary/5 border-secondary/20 items-center p-3">
        <Text className="text-3xl font-bold text-secondary">
          {totalAttempts}
        </Text>
        <Text className="text-xs text-text-muted font-bold uppercase mt-1">
          Всього вправ
        </Text>
      </Card>
    </View>
  );
}
