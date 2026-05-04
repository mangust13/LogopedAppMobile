// src/screens/logoped/sessions/components/AddSessionModal.tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionsApi, SessionDto } from "../../../../api/sessionsApi";
import { ChildDto } from "../../../../api/childrenApi";
import { Button } from "../../../../shared/ui/Button";

type Props = {
  visible: boolean;
  session: SessionDto | null;
  children: ChildDto[];
  onClose: () => void;
  onSaved: () => void;
};

export function AddSessionModal({
  visible,
  session,
  children,
  onClose,
  onSaved,
}: Props) {
  const isEditing = !!session;

  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [durationStr, setDurationStr] = useState("");
  const [notes, setNotes] = useState("");
  const [soundsStr, setSoundsStr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      if (session) {
        const d = new Date(session.date);
        setSelectedChildId(session.childId);
        setDateStr(formatDateInput(d));
        setTimeStr(formatTimeInput(d));
        setDurationStr(session.durationMinutes?.toString() ?? "");
        setNotes(session.notes ?? "");
        setSoundsStr(session.soundsWorkedOn.join(", "));
      } else {
        const now = new Date();
        setSelectedChildId(children[0] ? Number(children[0].id) : null);
        setDateStr(formatDateInput(now));
        setTimeStr(formatTimeInput(now));
        setDurationStr("");
        setNotes("");
        setSoundsStr("");
      }
    }
  }, [visible, session, children]);

  const formatDateInput = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTimeInput = (d: Date) => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const parseDateTime = (): Date | null => {
    try {
      const [day, month, year] = dateStr.split(".").map(Number);
      const [hours, minutes] = timeStr
        ? timeStr.split(":").map(Number)
        : [0, 0];

      if (!day || !month || !year) return null;

      return new Date(year, month - 1, day, hours, minutes);
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    if (!selectedChildId) {
      Alert.alert("Помилка", "Оберіть учня");
      return;
    }

    const parsedDate = parseDateTime();
    if (!parsedDate) {
      Alert.alert("Помилка", "Невірний формат дати (ДД.ММ.РРРР)");
      return;
    }

    const duration = durationStr ? parseInt(durationStr) : undefined;
    if (durationStr && (isNaN(duration!) || duration! <= 0)) {
      Alert.alert("Помилка", "Тривалість має бути числом у хвилинах");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        date: parsedDate.toISOString(),
        durationMinutes: duration,
        notes: notes.trim() || undefined,
        soundsWorkedOn: soundsStr.trim() || undefined,
      };

      if (isEditing) {
        await sessionsApi.update(session!.id, payload);
      } else {
        await sessionsApi.create({ ...payload, childId: selectedChildId });
      }

      onSaved();
    } catch {
      Alert.alert("Помилка", "Не вдалося зберегти заняття");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-text-main">
            {isEditing ? "Редагувати заняття" : "Нове заняття"}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 24, gap: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!isEditing && (
            <View>
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Учень *
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {children.map((child) => {
                  const isSelected = selectedChildId === Number(child.id);
                  return (
                    <TouchableOpacity
                      key={child.id}
                      onPress={() => setSelectedChildId(Number(child.id))}
                      className={`px-4 py-2 rounded-full border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {child.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Дата * (ДД.ММ.РРРР)
              </Text>
              <TextInput
                value={dateStr}
                onChangeText={setDateStr}
                placeholder="01.06.2025"
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              />
            </View>

            <View className="w-28">
              <Text className="text-sm font-bold text-gray-700 mb-2">
                Час (ГГ:ХХ)
              </Text>
              <TextInput
                value={timeStr}
                onChangeText={setTimeStr}
                placeholder="10:00"
                keyboardType="numeric"
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              />
            </View>
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Тривалість (хвилин)
            </Text>
            <TextInput
              value={durationStr}
              onChangeText={setDurationStr}
              placeholder="45"
              keyboardType="numeric"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Звуки (через кому)
            </Text>
            <TextInput
              value={soundsStr}
              onChangeText={setSoundsStr}
              placeholder="р, л, с"
              autoCapitalize="none"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
            />
          </View>

          <View>
            <Text className="text-sm font-bold text-gray-700 mb-2">
              Нотатки
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Коментар до заняття..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800"
              style={{ minHeight: 100 }}
            />
          </View>

          <Button
            title={
              saving
                ? "Збереження..."
                : isEditing
                  ? "Зберегти зміни"
                  : "Додати заняття"
            }
            onPress={handleSave}
            disabled={saving}
            className="mt-2"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
