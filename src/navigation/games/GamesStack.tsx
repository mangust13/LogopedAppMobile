// src\navigation\games\GamesStack.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamesCatalogScreen } from "../../screens/games/catalog/GamesCatalogScreen";
import { PreparationCategoriesScreen } from "../../screens/games/preparation/PreparationCategoriesScreen";
import { PreparationExerciseGalleryScreen } from "../../screens/games/preparation/PreparationExerciseGalleryScreen";
import { PreparationExerciseDetailScreen } from "../../screens/games/preparation/PreparationExerciseDetailScreen";
import { LogopedCreateComplexScreen } from "../../screens/games/preparation/LogopedCreateComplexScreen";
import { AutomationListScreen } from "../../screens/games/automation/AutomationListScreen";
import { AutomationGameScreen } from "../../screens/games/automation/AutomationGameScreen";
import { DifferentiationListScreen } from "../../screens/games/differentiation/DifferentiationListScreen";
import { DifferentiationGameScreen } from "../../screens/games/differentiation/DifferentiationGameScreen";

export type GamesActor = "User" | "Logoped";

export type GamesStackParamList = {
  GamesCatalog: { actor: GamesActor };

  PreparationCategories: undefined;

  PreparationExerciseGallery: {
    categoryId: string;
    categoryTitle: string;
  };

  PreparationExerciseDetail: {
    exerciseId: number;
    title: string;
    videoUrl?: string;
    description: string;
    iconName: string;
  };

  LogopedCreateComplex: {
    categoryId: string;
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

      <Stack.Screen
        name="PreparationCategories"
        component={PreparationCategoriesScreen}
      />
      <Stack.Screen
        name="PreparationExerciseGallery"
        component={PreparationExerciseGalleryScreen}
      />
      <Stack.Screen
        name="PreparationExerciseDetail"
        component={PreparationExerciseDetailScreen}
      />
      <Stack.Screen
        name="LogopedCreateComplex"
        component={LogopedCreateComplexScreen}
        options={{ presentation: "modal" }}
      />

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
