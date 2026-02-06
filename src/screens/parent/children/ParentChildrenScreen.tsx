//src/screens/parent/children/ParentChildrenScreen.tsx
import { useEffect, useState } from "react";
import { FlatList, View, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../../../shared/ui/Screen";
import { Button } from "../../../shared/ui/Button";
import { Text } from "react-native"; // Або імпорт твого Text компонента, якщо є
import { childrenApi } from "../../../api/childrenApi";
import { ChildDto } from "../../../api/types/child";
import { ChildCard } from "./components/ChildCard";
import { AddChildModal } from "./components/AddChildModal";
import { AssignLogopedModal } from "./components/AssignLogopedModal";
import { EditChildModal } from "./components/EditChildModal";
import { useChildStore } from "../../../store/childStore";
import ScreenHeader from "../../../shared/ui/ScreenHeader ";

export function ParentChildrenScreen() {
  const navigation = useNavigation<any>();

  const selectedChild = useChildStore((s) => s.selectedChild);
  const setSelectedChild = useChildStore((s) => s.setSelectedChild);

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddChild, setShowAddChild] = useState(false);
  const [assignChildId, setAssignChildId] = useState<number | null>(null);

  const [editChild, setEditChild] = useState<ChildDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await childrenApi.getMyChildren();
      setChildren(data);

      if (data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const assignSelectedChild = assignChildId
    ? children.find((c) => c.id === assignChildId)
    : undefined;

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Header */}
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
            onViewProgress={() => {
              setSelectedChild(item);
              navigation.navigate("Progress");
            }}
            onAssignPress={(id) => setAssignChildId(id)}
            onEditPress={(child) => {
              setEditChild(child);
              setShowEditModal(true);
            }}
            onDeletePress={async (id) => {
              try {
                await childrenApi.deleteChild(id);
                loadChildren();
              } catch {
                Alert.alert("Error", "Failed to delete child");
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

      {showEditModal && editChild && (
        <EditChildModal
          child={editChild}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={loadChildren}
        />
      )}

      <AddChildModal
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
        onCreated={loadChildren}
      />

      {assignChildId && assignSelectedChild && (
        <AssignLogopedModal
          key={assignChildId}
          childId={assignChildId}
          visible
          onClose={() => setAssignChildId(null)}
          onAssigned={loadChildren}
          currentLogopedEmail={assignSelectedChild.logopedEmail ?? null}
        />
      )}
    </Screen>
  );
}
