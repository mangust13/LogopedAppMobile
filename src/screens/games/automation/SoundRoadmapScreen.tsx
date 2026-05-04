import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { Card } from "../../../shared/ui/Card";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import {
  progressApi,
  SoundRoadmapDto,
  PositionStatusDto,
  GameStatusDto,
} from "../../../api/progressApi";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<GamesStackParamList, "SoundRoadmap">;

type GameRoute = "SwipeGame" | "MatchingGame" | "ClassificationGame";

const GAME_ORDER = ["SwipeGame", "MatchingGame", "ClassificationGame"];

const GAME_META: Record<
  string,
  { icon: string; color: string; route: GameRoute }
> = {
  SwipeGame: { icon: "image-multiple", color: "#4CAF50", route: "SwipeGame" },
  MatchingGame: {
    icon: "cards-playing-outline",
    color: "#FF9800",
    route: "MatchingGame",
  },
  ClassificationGame: {
    icon: "view-grid-outline",
    color: "#9C27B0",
    route: "ClassificationGame",
  },
};

export function SoundRoadmapScreen({ navigation, route }: Props) {
  const { sound, childId } = route.params;
  const [roadmap, setRoadmap] = useState<SoundRoadmapDto | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await progressApi.getRoadmap(childId, sound);
      setRoadmap(data);
    } catch {
      Alert.alert("Помилка", "Не вдалося завантажити прогрес");
    } finally {
      setLoading(false);
    }
  }, [childId, sound]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleGamePress = (
    position: PositionStatusDto,
    gameType: string,
    isGameUnlocked: boolean,
  ) => {
    if (!isGameUnlocked) return;

    const meta = GAME_META[gameType];
    if (!meta) return;

    navigation.navigate(meta.route, {
      sound,
      positionCode: position.positionCode,
      childId,
    });
  };

  if (loading) {
    return (
      <Screen>
        <BackHeader
          subtitle={`Звук ${sound}`}
          title="Дорожня карта"
          onBackPress={() => navigation.goBack()}
        />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Дорожня карта"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Card className="p-4 mb-6 flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="font-bold text-text-main text-base mb-2">
              Загальний прогрес
            </Text>
            <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full rounded-full bg-primary"
                style={{ width: `${roadmap?.progressPercent ?? 0}%` }}
              />
            </View>
          </View>
          <Text className="text-2xl font-bold text-primary">
            {roadmap?.progressPercent ?? 0}%
          </Text>
        </Card>

        <View className="gap-4">
          {roadmap?.positions.map((position, posIndex) => (
            <PositionBlock
              key={position.positionCode}
              position={position}
              posIndex={posIndex}
              isLast={posIndex === (roadmap?.positions.length ?? 0) - 1}
              onGamePress={(gameType, isGameUnlocked) =>
                handleGamePress(position, gameType, isGameUnlocked)
              }
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

type PositionBlockProps = {
  position: PositionStatusDto;
  posIndex: number;
  isLast: boolean;
  onGamePress: (gameType: string, isGameUnlocked: boolean) => void;
};

function PositionBlock({
  position,
  posIndex,
  isLast,
  onGamePress,
}: PositionBlockProps) {
  const allCompleted = position.games.every((g) => g.isCompleted);

  const isGameUnlocked = (game: GameStatusDto): boolean => {
    if (!position.isUnlocked) return false;

    const gameIndex = GAME_ORDER.indexOf(game.gameType);
    if (gameIndex === 0) return true;

    const prevGameType = GAME_ORDER[gameIndex - 1];
    const prevGame = position.games.find((g) => g.gameType === prevGameType);
    return prevGame?.isCompleted ?? false;
  };

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2 mb-1">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            allCompleted
              ? "bg-green-500"
              : position.isUnlocked
                ? "bg-primary"
                : "bg-gray-200"
          }`}
        >
          {allCompleted ? (
            <Ionicons name="checkmark" size={18} color="#fff" />
          ) : (
            <Text className="text-white font-bold text-sm">{posIndex + 1}</Text>
          )}
        </View>

        <Text
          className={`font-bold text-base ${
            position.isUnlocked ? "text-text-main" : "text-gray-400"
          }`}
        >
          {position.displayName}
        </Text>

        {!position.isUnlocked && (
          <Ionicons name="lock-closed" size={16} color="#CBD5E1" />
        )}

        {allCompleted && (
          <View className="ml-auto bg-green-100 px-2 py-0.5 rounded-full">
            <Text className="text-green-700 text-xs font-bold">Пройдено</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-3">
        {position.games.map((game) => {
          const meta = GAME_META[game.gameType];
          if (!meta) return null;

          const unlocked = isGameUnlocked(game);

          return (
            <GameTile
              key={game.gameType}
              game={game}
              meta={meta}
              isUnlocked={unlocked}
              onPress={() => onGamePress(game.gameType, unlocked)}
            />
          );
        })}
      </View>

      {!isLast && (
        <View className="items-center my-1">
          <View
            className={`w-0.5 h-6 ${
              allCompleted ? "bg-green-400" : "bg-gray-200"
            }`}
          />
        </View>
      )}
    </View>
  );
}

type GameTileProps = {
  game: GameStatusDto;
  meta: { icon: string; color: string };
  isUnlocked: boolean;
  onPress: () => void;
};

function GameTile({ game, meta, isUnlocked, onPress }: GameTileProps) {
  const isLocked = !isUnlocked;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
      className="flex-1"
    >
      <View
        className={`rounded-2xl p-3 items-center gap-2 border ${
          game.isCompleted
            ? "bg-green-50 border-green-200"
            : isLocked
              ? "bg-gray-50 border-gray-100"
              : "bg-white border-gray-100"
        }`}
        style={
          !isLocked && !game.isCompleted
            ? {
                shadowColor: meta.color,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }
            : undefined
        }
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{
            backgroundColor: isLocked
              ? "#F1F5F9"
              : game.isCompleted
                ? "#DCFCE7"
                : meta.color + "22",
          }}
        >
          {isLocked ? (
            <Ionicons name="lock-closed" size={22} color="#CBD5E1" />
          ) : game.isCompleted ? (
            <View className="relative items-center justify-center w-full h-full">
              <MaterialCommunityIcons
                name={meta.icon as any}
                size={22}
                color="#22C55E"
              />
              <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            </View>
          ) : (
            <MaterialCommunityIcons
              name={meta.icon as any}
              size={26}
              color={meta.color}
            />
          )}
        </View>

        <Text
          className={`text-xs font-semibold text-center leading-4 ${
            isLocked
              ? "text-gray-300"
              : game.isCompleted
                ? "text-green-700"
                : "text-text-main"
          }`}
          numberOfLines={2}
        >
          {game.displayName}
        </Text>

        {game.isCompleted && (
          <Text className="text-[10px] text-green-500 font-medium">
            Пройти ще раз
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
