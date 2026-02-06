// src\navigation\games\GamesStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamesCatalogScreen } from "../../screens/games/catalog/GamesCatalogScreen";
import { PreparationListScreen } from "../../screens/games/preparation/PreparationListScreen";
import { PreparationGameScreen } from "../../screens/games/preparation/PreparationGameScreen";
import { AutomationListScreen } from "../../screens/games/automation/AutomationListScreen";
import { AutomationGameScreen } from "../../screens/games/automation/AutomationGameScreen";
import { DifferentiationListScreen } from "../../screens/games/differentiation/DifferentiationListScreen";
import { DifferentiationGameScreen } from "../../screens/games/differentiation/DifferentiationGameScreen";

export type GamesActor = "User" | "Logoped";

export type GamesStackParamList = {
  GamesCatalog: { actor: GamesActor };
  PreparationList: undefined;
  PreparationGame: {
    title: string;
    instruction: string;
    durationSec: number;
    difficulty: "Легко" | "Середньо" | "Складно";
  };
  AutomationList: undefined;
  AutomationGame: {
    sound: string;
    position: "Початок" | "Середина" | "Кінець";
    level: number;
  };
  DifferentiationList: undefined;
  DifferentiationGame: {
    title: string;
    prompt: string;
    correctAnswer: string;
    options: string[];
  };
};

type Props = {
  actor: GamesActor;
};

const Stack = createNativeStackNavigator<GamesStackParamList>();

export function GamesStack({ actor }: Props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GamesCatalog"
        component={GamesCatalogScreen}
        initialParams={{ actor }}
      />
      <Stack.Screen name="PreparationList" component={PreparationListScreen} />
      <Stack.Screen name="PreparationGame" component={PreparationGameScreen} />
      <Stack.Screen name="AutomationList" component={AutomationListScreen} />
      <Stack.Screen name="AutomationGame" component={AutomationGameScreen} />
      <Stack.Screen
        name="DifferentiationList"
        component={DifferentiationListScreen}
      />
      <Stack.Screen
        name="DifferentiationGame"
        component={DifferentiationGameScreen}
      />
    </Stack.Navigator>
  );
}
