import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BackHeader } from "../../../shared/ui/BackHeader";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationGames">;

const games = [
  {
    title: "Гортай картинки",
    icon: "image-multiple",
    color: "#4CAF50",
    route: "SwipeGame" as const,
  },
  {
    title: "Знайди однакові",
    icon: "cards-playing-outline",
    color: "#FF9800",
    route: "MatchingGame" as const,
  },
  {
    title: "Розклади по групах",
    icon: "view-grid-outline",
    color: "#9C27B0",
    route: "ClassificationGame" as const,
  },
];

export function AutomationGamesScreen({ navigation, route }: Props) {
  const { sound } = route.params;

  return (
    <Screen>
      <BackHeader
        subtitle={`Звук ${sound}`}
        title="Ігри"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-6 pt-4 pb-24"
      >
        <View className="mb-5 bg-blue-50 border border-blue-200 rounded-2xl py-3 px-4">
          <Text className="text-lg font-bold text-gray-800 text-center">
            Оберіть гру
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {games.map((game) => (
            <TouchableOpacity
              key={game.route}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(game.route, { sound })}
              className="w-[48%] bg-white rounded-2xl px-3 py-6 mb-4 items-center justify-center min-h-[190px]
                         shadow-md"
            >
              <View
                className="w-[90px] h-[90px] rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: game.color }}
              >
                <MaterialCommunityIcons
                  name={game.icon as any}
                  size={44}
                  color="#fff"
                />
              </View>

              <Text className="text-[18px] font-extrabold text-gray-800 text-center leading-6">
                {game.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
