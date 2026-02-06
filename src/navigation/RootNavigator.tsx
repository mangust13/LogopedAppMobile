// src/navigation/RootNavigator.tsx
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen } from "../screens/SplashScreen";
import { AuthStack } from "./AuthStack";
import { AppTabs } from "./AppTabs";

import { ChildStatsScreen } from "../screens/parent/stats/ChildStatsScreen";
import { LogopedStudentStatsScreen } from "../screens/logoped/stats/LogopedStudentStatsScreen";

import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  Splash: undefined;
  App: undefined;
  Auth: undefined;
  ChildProgress: { childId: number; childName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isHydrated && <Stack.Screen name="Splash" component={SplashScreen} />}

        {isHydrated && !token && (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}

        {isHydrated && token && (
          <>
            <Stack.Screen name="App" component={AppTabs} />

            <Stack.Screen
              name="ChildProgress"
              component={
                role === "Logoped"
                  ? LogopedStudentStatsScreen
                  : ChildStatsScreen
              }
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
