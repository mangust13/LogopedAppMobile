// src\navigation\games\GamesStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamesCatalogScreen } from "../../screens/games/catalog/GamesCatalogScreen";
import { PreparationCategoriesScreen } from "../../screens/games/preparation/PreparationCategoriesScreen";
import { PreparationExerciseGalleryScreen } from "../../screens/games/preparation/PreparationExerciseGalleryScreen";
import { PreparationExerciseDetailScreen } from "../../screens/games/preparation/PreparationExerciseDetailScreen";
import { LogopedCreateComplexScreen } from "../../screens/games/preparation/LogopedCreateComplexScreen";

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
    videoPath?: string;
    description: string;
    iconName: string;
  };

  LogopedCreateComplex: {
    categoryId: string;
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
    </Stack.Navigator>
  );
}
