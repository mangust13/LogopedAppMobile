// src/screens/tabs/components/TrendChart.tsx
import { View, StyleSheet } from 'react-native';
import { TrendPointDto } from '../../../api/types/progress';

export function TrendChart({ data }: { data: TrendPointDto[] }) {
  const max = Math.max(...data.map(d => d.value), 100);

  return (
    <View style={styles.container}>
      {data.map((d, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: `${(d.value / max) * 100}%` },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    flex: 1,
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
});
