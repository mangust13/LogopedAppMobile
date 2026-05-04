import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { Screen } from "../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { Button } from "../../../shared/ui/Button";
import { ENV } from "../../../config/env";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { activityApi } from "../../../api/activityApi";
import { useChildStore } from "../../../store/childStore";

type RouteProps = RouteProp<GamesStackParamList, "PreparationExerciseDetail">;

const { width } = Dimensions.get("window");

export function PreparationExerciseDetailScreen() {
  const route = useRoute<RouteProps>();
  const { title, videoPath, description } = route.params;
  const selectedChildId = useChildStore((s) => s.selectedChildId);

  const [showDescription, setShowDescription] = useState(false);

  const player = useVideoPlayer(
    videoPath
      ? { uri: `${ENV.API_BASE_URL}/exercises/${videoPath}` }
      : { uri: "" },
  );

  useEffect(() => {
    if (videoPath) {
      player.loop = true;
      player.pause();
    }

    if (selectedChildId) {
      activityApi.track(selectedChildId, "Exercise").catch(() => {});
    }
  }, []);

  const handleOpenDescription = () => {
    if (videoPath) player.pause();
    setShowDescription(true);
  };

  return (
    <Screen>
      <BackHeader title={title} />

      <View className="flex-1 items-center justify-center px-4 bg-white">
        <View
          className="w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
          style={{ height: width * 0.65 }}
        >
          {videoPath ? (
            <VideoView
              style={{ width: "100%", height: "100%" }}
              player={player}
              nativeControls={true}
              contentFit="contain"
              fullscreenOptions={{ enable: true }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="videocam-off" size={48} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2">Відео недоступне</Text>
            </View>
          )}
        </View>
      </View>

      <View className="px-6 pb-8">
        <Button
          title="Опис вправи"
          onPress={handleOpenDescription}
          className="w-full"
        />
      </View>

      <Modal
        visible={showDescription}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDescription(false)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowDescription(false)}
          />

          <View className="bg-white rounded-t-3xl h-[50%] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-gray-100">
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
                onPress={() => setShowDescription(false)}
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
