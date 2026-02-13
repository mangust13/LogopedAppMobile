// src/screens/games/preparation/PreparationExerciseDetailScreen.tsx

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { SafeAreaView } from "react-native-safe-area-context";

import { Screen } from "../../../shared/ui/Screen";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { Button } from "../../../shared/ui/Button";
import { ENV } from "../../../config/env";
import { BackHeader } from "../../../shared/ui/BackHeader";

type RouteProps = RouteProp<GamesStackParamList, "PreparationExerciseDetail">;

const { width } = Dimensions.get("window");

export function PreparationExerciseDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { title, description, videoUrl } = route.params;

  const [showDescription, setShowDescription] = useState(false);

  const player = useVideoPlayer(
    videoUrl
      ? { uri: `${ENV.API_BASE_URL}/exercises/${videoUrl}` }
      : { uri: "" },
  );

  const handleOpenDescription = () => {
    if (videoUrl) player.pause();
    setShowDescription(true);
  };

  const handleCloseDescription = () => {
    setShowDescription(false);
    if (videoUrl) player.play();
  };

  if (videoUrl && !showDescription) {
    player.loop = true;
    player.play();
  }

  return (
    <Screen>
      {/* === Header (Стиль як в інших екранах) === */}
      <BackHeader title={title} />

      <View className="flex-1 items-center justify-center px-4 bg-white">
        <View
          className="w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
          style={{ height: width * 0.65 }}
        >
          {videoUrl ? (
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              nativeControls={true}
              contentFit="contain"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="videocam-off" size={48} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2">Відео недоступне</Text>
            </View>
          )}
        </View>
      </View>

      {/* === Bottom Button === */}
      <View className="px-6 pb-8">
        <Button
          title="Опис вправи"
          onPress={handleOpenDescription}
          // Стандартна кнопка (синя)
          className="w-full"
        />
      </View>

      {/* === Modal (Description) === */}
      <Modal
        visible={showDescription}
        animationType="slide"
        transparent
        onRequestClose={handleCloseDescription}
      >
        <View className="flex-1 justify-end">
          {/* Прозорий фон (Touchable), щоб закрити кліком, 
                АЛЕ без bg-black/XX, тому затемнення не буде.
            */}
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={handleCloseDescription}
          />

          {/* Контент модалки */}
          <View className="bg-white rounded-t-3xl h-[50%] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100">
            {/* Drag Indicator */}
            <View className="items-center pt-4 pb-2">
              <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </View>

            <View className="px-6 flex-1 pb-8">
              <View className="flex-row items-center mb-4 gap-3">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                  <Ionicons name="book-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-xl font-bold text-text-main">
                  Інструкція
                </Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-base text-text-main leading-7">
                  {description || "Опис відсутній для цієї вправи."}
                </Text>
              </ScrollView>

              <Button
                title="Зрозуміло"
                onPress={handleCloseDescription}
                variant="outline"
                className="mt-4"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
