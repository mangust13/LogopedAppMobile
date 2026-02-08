// src/screens/parent/children/ParentChildrenScreen.tsx
import { useCallback, useState } from "react";
import { FlatList, View, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { Text } from "react-native";

import { childrenApi } from "../../../api/childrenApi";
import { ChildDto } from "../../../api/types/child";
import { ChildCard } from "./components/ChildCard";
import { AddChildModal } from "./components/AddChildModal";
import { useChildStore } from "../../../store/childStore";
import ScreenHeader from "../../../shared/ui/ScreenHeader";

export function ParentChildrenScreen() {
  const navigation = useNavigation<any>();

  const { selectedChild, setSelectedChild } = useChildStore();

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);

  const loadChildren = async () => {
    try {
      setLoading(true);

      const data = await childrenApi.getMyChildren();
      setChildren(data);

      if (data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    } catch (e) {
      Alert.alert("Помилка", "Не вдалося завантажити дітей");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, []),
  );

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Мої діти 👶" center />

      <FlatList
        data={children}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-400 mb-4">Список порожній</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            onViewProgress={() =>
              navigation.navigate("ChildProgress", {
                childId: item.id,
                childName: item.name,
              })
            }
            onAssignPress={(id) => console.log("Assign logoped for", id)}
            onEditPress={(child) => console.log("Edit child", child.name)}
            onDeletePress={async (id) => {
              try {
                await childrenApi.deleteChild(id);
                loadChildren();
              } catch {
                Alert.alert("Помилка", "Не вдалося видалити дитину");
              }
            }}
          />
        )}
      />

      <View className="absolute bottom-6 left-6 right-6">
        <Button
          title="+ Додати дитину"
          onPress={() => setShowAddChild(true)}
          className="shadow-lg shadow-primary/40"
        />
      </View>

      <AddChildModal
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
        onCreated={() => {
          setShowAddChild(false);
          loadChildren();
        }}
      />
    </Screen>
  );
}
