// src/screens/tabs/components/SummaryCard.tsx
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
};

export function SummaryCard({ label, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
});
