import { useEffect, useState } from "react";
import { FlatList, View, ActivityIndicator, Alert, Text } from "react-native";
import { Screen } from "../../../shared/ui/Screen";
import { logopedApi } from "../../../api/logopedApi";
import { ChildDto } from "../../../api/childrenApi";
import { ChildRow } from "./components/ChildRow";
import ScreenHeader from "../../../shared/ui/ScreenHeader";
import { EditProblemSoundsModal } from "./components/EditProblemSoundsModal";

export function LogopedChildrenScreen() {
  const [children, setChildren] = useState<ChildDto[]>([]);
  const [selectedChildForEdit, setSelectedChildForEdit] =
    useState<ChildDto | null>(null);
  const [loading, setLoading] = useState(true);

  const loadChildren = async () => {
    try {
      setLoading(true);

      const data = await logopedApi.getLogopedChildren();

      const normalizedChildren = data.map((child) => ({
        ...child,
        name: child.name || "Без імені",
        birthDate: child.birthDate || "",
        problemSounds: child.problemSounds || "",
        logopedEmail: child.logopedEmail || null,
        avatarUrl: child.avatarUrl || null,
      }));

      setChildren(normalizedChildren);
    } catch (e) {
      console.error("LOAD LOGOPED CHILDREN ERROR", e);
      Alert.alert("Помилка", "Не вдалося завантажити дітей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadChildren();
  }, []);

  if (loading) {
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#6C63FF" />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader subtitle="Кабінет" title="Мої учні 🎓" center />

      <FlatList
        data={children}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 100,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Text className="text-gray-400">У вас поки немає учнів</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChildRow
            child={item}
            onEditProblemSounds={setSelectedChildForEdit}
          />
        )}
      />

      {selectedChildForEdit && (
        <EditProblemSoundsModal
          child={selectedChildForEdit}
          visible={!!selectedChildForEdit}
          onClose={() => setSelectedChildForEdit(null)}
          onUpdated={loadChildren}
        />
      )}
    </Screen>
  );
}
