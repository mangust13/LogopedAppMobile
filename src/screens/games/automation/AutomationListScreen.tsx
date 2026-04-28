import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";
import type { GamesStackParamList } from "../../../navigation/games/GamesStack";
import { UKRAINIAN_SOUND_OPTIONS } from "../../../shared/constants/sounds";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationList">;

export function AutomationListScreen({ navigation }: Props) {
  return (
    <Screen>
      <BackHeader
        subtitle="Автоматизація"
        title="Всі вправи"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-6"
      >
        <View className="flex-1 flex-row flex-wrap justify-center items-center gap-4">
          {UKRAINIAN_SOUND_OPTIONS.map((item, index) => (
            <TouchableOpacity
              key={`${item.letter}-${index}`}
              onPress={() =>
                navigation.navigate("AutomationGames", {
                  sound: item.letter,
                })
              }
              className="w-[30%] aspect-square rounded-2xl items-center justify-center shadow-sm"
              style={{ backgroundColor: item.color }}
            >
              <Text className="text-white text-4xl font-bold">
                {item.letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
