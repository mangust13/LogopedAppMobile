import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GamesCatalogScreen } from "../../screens/games/catalog/GamesCatalogScreen";
import { PreparationCategoriesScreen } from "../../screens/games/preparation/PreparationCategoriesScreen";
import { PreparationExerciseGalleryScreen } from "../../screens/games/preparation/PreparationExerciseGalleryScreen";
import { PreparationExerciseDetailScreen } from "../../screens/games/preparation/PreparationExerciseDetailScreen";
import { LogopedCreateComplexScreen } from "../../screens/games/preparation/LogopedCreateComplexScreen";
import { LogopedComplexListScreen } from "../../screens/games/preparation/LogopedComplexListScreen";
import { LogopedAssignComplexScreen } from "../../screens/games/preparation/LogopedAssignComplexScreen";
import { AutomationListScreen } from "../../screens/games/automation/AutomationListScreen";
import { AutomationGamesScreen } from "../../screens/games/automation/AutomationGamesScreen";
import { SwipeGameScreen } from "../../screens/games/automation/gameTypes/SwipeGameScreen";
import { MatchingGameScreen } from "../../screens/games/automation/gameTypes/MatchingGameScreen";
import { ClassificationGameScreen } from "../../screens/games/automation/gameTypes/ClassificationGameScreen";
import { SoundRoadmapScreen } from "../../screens/games/automation/SoundRoadmapScreen";

export type GamesActor = "User" | "Logoped";

export type GamesStackParamList = {
  GamesCatalog: { actor: GamesActor };
  PreparationCategories: undefined;
  PreparationExerciseGallery: { complexId: number; complexTitle: string };
  PreparationExerciseDetail: {
    exerciseId: number;
    title: string;
    videoPath?: string;
    description: string;
    iconName?: string;
  };
  LogopedCreateComplex: {
    complexId: number;
    isEditing?: boolean;
    onComplexCreated?: () => void;
  };
  LogopedAssignComplex: { complexId: number; complexTitle: string };
  LogopedComplexList: undefined;
  AutomationList: undefined;
  AutomationGames: { sound: string };
  SoundRoadmap: { sound: string; childId: number };
  SwipeGame: { sound: string; positionCode: number; childId: number };
  MatchingGame: { sound: string; positionCode: number; childId: number };
  ClassificationGame: { sound: string; positionCode: number; childId: number };
};

type Props = { actor: GamesActor };

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
      <Stack.Screen
        name="LogopedComplexList"
        component={LogopedComplexListScreen}
      />
      <Stack.Screen
        name="LogopedAssignComplex"
        component={LogopedAssignComplexScreen}
      />
      <Stack.Screen name="AutomationList" component={AutomationListScreen} />
      <Stack.Screen name="AutomationGames" component={AutomationGamesScreen} />
      <Stack.Screen name="SoundRoadmap" component={SoundRoadmapScreen} />
      <Stack.Screen name="SwipeGame" component={SwipeGameScreen} />
      <Stack.Screen name="MatchingGame" component={MatchingGameScreen} />
      <Stack.Screen
        name="ClassificationGame"
        component={ClassificationGameScreen}
      />
    </Stack.Navigator>
  );
}
