// src/screens/parent/children/ParentChildrenScreen.tsx
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { childrenApi } from "../../../api/childrenApi";
import { ChildDto } from "../../../api/types/child";
import { ChildCard } from "./components/ChildCard";
import { AddChildModal } from "./components/AddChildModal";
import { AssignLogopedModal } from "./components/AssignLogopedModal";
import { EditChildModal } from "./components/EditChildModal";

export function ParentChildrenScreen() {
  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddChild, setShowAddChild] = useState(false);
  const [assignChildId, setAssignChildId] = useState<string | null>(null);

  const [editChild, setEditChild] = useState<ChildDto | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadChildren = async () => {
    try {
      setLoading(true);
      const data = await childrenApi.getMyChildren();
      setChildren(data);
    } catch (e) {
      console.error("LOAD CHILDREN ERROR", e);
      Alert.alert("Error", "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const selectedChild = assignChildId
    ? children.find((c) => c.id === assignChildId)
    : undefined;

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>👶 Мої діти</Text>
      <View style={{ height: 16 }} />

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ChildCard
            child={item}
            onAssignPress={(id) => setAssignChildId(id)}
            onEditPress={(child) => {
              setEditChild(child);
              setShowEditModal(true);
            }}
            onDeletePress={async (id) => {
              try {
                await childrenApi.deleteChild(id);
                loadChildren();
              } catch (e) {
                console.error("DELETE CHILD ERROR", e);
                Alert.alert("Error", "Failed to delete child");
              }
            }}
          />
        )}
      />

      {showEditModal && editChild && (
        <EditChildModal
          child={editChild}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={loadChildren}
        />
      )}

      <View style={{ height: 16 }} />
      <Button title="+ Додати дитину" onPress={() => setShowAddChild(true)} />

      <AddChildModal
        visible={showAddChild}
        onClose={() => setShowAddChild(false)}
        onCreated={loadChildren}
      />

      {assignChildId && selectedChild && (
        <AssignLogopedModal
          key={assignChildId}
          childId={assignChildId}
          visible={!!assignChildId && !!selectedChild}
          onClose={() => setAssignChildId(null)}
          onAssigned={loadChildren}
          currentLogopedEmail={selectedChild.logopedEmail ?? null}
        />
      )}
    </Screen>
  );
}
