import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

import { childrenApi } from "../../../api/childrenApi";
import { ChildDto } from "../../../api/types/child";
import { useChildStore } from "../../../store/childStore";
import { useProgress } from "../../../hooks/useProgress";

import { ChildSelector } from "./components/ChildSelector";
import { HabitTracker } from "./components/HabitTracker";
import { SoundProgressBar } from "./components/SoundProgressBar";
import { BadgesGrid } from "./components/BadgesGrid";
import { buildHabit } from "../../../shared/utils/habit";

export function HomeParentScreen() {
  const navigation = useNavigation<any>();

  const {
    selectedChild,
    selectedChildId,
    setSelectedChild,
    setSelectedChildData,
  } = useChildStore();

  const [children, setChildren] = useState<ChildDto[]>([]);
  const [loading, setLoading] = useState(true);

  const { last: attempts } = useProgress(selectedChildId ?? undefined);

  const load = async () => {
    setLoading(true);

    try {
      const data = await childrenApi.getMyChildren();
      setChildren(data);

      if (data.length === 0) {
        setLoading(false);
        return;
      }

      const found = data.find((c) => Number(c.id) === selectedChildId);

      if (!found) {
        setSelectedChild(data[0]);
      } else if (selectedChildId && !selectedChild) {
        setSelectedChildData(found);
      }
    } catch (e) {
      console.warn("Failed to load children", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [selectedChildId]),
  );

  if (loading) {
    return <View style={styles.container} />;
  }

  if (children.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Домашня сторінка</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Children")}
        >
          <Text style={styles.primaryText}>Додати дитину</Text>
        </Pressable>
      </View>
    );
  }

  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Оберіть дитину</Text>

        <ChildSelector
          children={children}
          selectedChildId={selectedChildId}
          onSelect={setSelectedChild}
        />
      </View>
    );
  }

  const habit = buildHabit(attempts ?? []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Домашня сторінка</Text>

      {children.length > 1 && (
        <ChildSelector
          children={children}
          selectedChildId={selectedChildId}
          onSelect={setSelectedChild}
        />
      )}

      {/* Active child */}
      <View style={styles.card}>
        <Text style={styles.childName}>{selectedChild.name}</Text>
        <Text style={styles.meta}>
          Проблемні звуки: {selectedChild.problemSounds ?? "–"}
        </Text>
      </View>

      {/* Habit tracker */}
      <HabitTracker streak={habit.streak} days={habit.days} />

      {/* Sound progress */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>Прогрес по звуках</Text>

        <SoundProgressBar sound="р" progress={65} />
        <SoundProgressBar sound="с" progress={80} />
        <SoundProgressBar sound="ш" progress={40} />
      </View>

      {/* Badges */}
      <BadgesGrid />

      {/* Today plan */}
      <View style={styles.card}>
        <Text style={styles.subtitle}>План на сьогодні</Text>
        <Text>• Артикуляційна вправа</Text>
        <Text>• Гра на автоматизацію</Text>

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Почати заняття</Text>
        </Pressable>
      </View>

      {/* CTA */}
      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Progress")}
      >
        <Text style={styles.secondaryText}>Переглянути прогрес</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 8,
  },
  childName: {
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    color: "#6b7280",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  secondaryText: {
    fontWeight: "600",
  },
});
