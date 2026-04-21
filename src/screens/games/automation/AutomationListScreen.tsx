import React from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../../shared/ui/Screen";
import { BackHeader } from "../../../shared/ui/BackHeader";
import { GamesStackParamList } from "../../../navigation/games/GamesStack";

type Props = NativeStackScreenProps<GamesStackParamList, "AutomationList">;

const ukrainianAlphabet = [
  { letter: "А", color: "#FFD966" },
  { letter: "Б", color: "#F8A15F" },
  { letter: "В", color: "#F47C7C" },
  { letter: "Г", color: "#F47C7C" },
  { letter: "Д", color: "#F8A15F" },
  { letter: "Е", color: "#FFD966" },
  { letter: "Є", color: "#B6D7A8" },
  { letter: "Ж", color: "#6FA8DC" },
  { letter: "З", color: "#6FA8DC" },
  { letter: "И", color: "#9FC5E8" },
  { letter: "І", color: "#6FA8DC" },
  { letter: "Й", color: "#D5A6BD" },
  { letter: "К", color: "#6FA8DC" },
  { letter: "Л", color: "#B6D7A8" },
  { letter: "М", color: "#D5A6BD" },
  { letter: "Н", color: "#9FC5E8" },
  { letter: "О", color: "#B6D7A8" },
  { letter: "П", color: "#F8A15F" },
  { letter: "Р", color: "#F47C7C" },
  { letter: "С", color: "#F8A15F" },
  { letter: "Т", color: "#FFD966" },
  { letter: "У", color: "#D5A6BD" },
  { letter: "Ф", color: "#6FA8DC" },
  { letter: "Х", color: "#B6D7A8" },
  { letter: "Ц", color: "#B6D7A8" },
  { letter: "Ш", color: "#D5A6BD" },
  { letter: "Щ", color: "#B6D7A8" },
  { letter: "Ю", color: "#F47C7C" },
  { letter: "Я", color: "#D5A6BD" },
];

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
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 100,
        }}
      >
        <View className="flex-row flex-wrap justify-between">
          {ukrainianAlphabet.map((item, index) => (
            <TouchableOpacity
              key={`${item.letter}-${index}`}
              style={[styles.letterBox, { backgroundColor: item.color }]}
              onPress={() =>
                navigation.navigate("AutomationGames", { sound: item.letter })
              }
              className="rounded-2xl mb-4 shadow-sm"
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

const styles = StyleSheet.create({
  letterBox: {
    width: "18%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
});
