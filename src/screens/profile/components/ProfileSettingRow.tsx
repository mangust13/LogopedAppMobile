//src\screens\profile\components\ProfileSettingRow.tsx
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
};

export function ProfileSettingRow({ label, value }: Props) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    borderWidth: 1,
    borderColor: "#f1f5f9",
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 10,
    gap: 2,
  },
  settingLabel: {
    fontSize: 13,
    color: "#4b5563",
    fontWeight: "600",
  },
  settingValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
});
