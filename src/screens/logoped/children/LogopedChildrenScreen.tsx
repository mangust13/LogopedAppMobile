// src/screens/logoped/children/LogopedChildrenScreen.tsx
import { useEffect, useState } from "react";
import { FlatList, Text, View, ActivityIndicator, Alert } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { logopedApi } from "../../../api/logopedApi";
import { ChildDto } from "../../../api/types/child";
import { ChildRow } from "./components/ChildRow";

export function LogopedChildrenScreen() {
  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await logopedApi.getLogopedChildren();
      setChildren(data);
    } catch (e) {
      console.error("LOAD LOGOPED CHILDREN ERROR", e);
      Alert.alert("Error", "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>🧑‍🏫 Мої учні</Text>
      <View style={{ height: 16 }} />

      <FlatList
        data={children}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <ChildRow child={item} />}
      />
    </Screen>
  );
}
