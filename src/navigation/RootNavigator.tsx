// src/navigation/RootNavigator.tsx
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { jwtDecode } from "jwt-decode";

import { SplashScreen } from "../screens/SplashScreen";
import { AuthStack } from "./AuthStack";
import { AppTabs } from "./AppTabs";

import { ChildStatsScreen } from "../screens/parent/stats/ChildStatsScreen";
import { LogopedStudentStatsScreen } from "../screens/logoped/stats/LogopedStudentStatsScreen";

import { useAuthStore } from "../store/authStore";
import { NavigatorScreenParams } from "@react-navigation/native";
import { AppTabsParamList } from "./AppTabs";

export type RootStackParamList = {
  Splash: undefined;
  App: NavigatorScreenParams<AppTabsParamList>;
  Auth: undefined;
  ChildProgress: { childId: number; childName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const initializeAuth = async () => {
      await hydrate();

      if (token) {
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            await logout();
          }
        } catch (error) {
          await logout();
        }
      }
    };

    initializeAuth();
  }, [hydrate, token, logout]);

  // Визначаємо, чи валідний токен
  const isTokenValid = () => {
    if (!token) return false;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  const isAuthenticated = token && isTokenValid();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isHydrated && <Stack.Screen name="Splash" component={SplashScreen} />}

        {isHydrated && !isAuthenticated && (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}

        {isHydrated && isAuthenticated && (
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
