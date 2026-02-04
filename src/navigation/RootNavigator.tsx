// src/navigation/RootNavigator.tsx
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen } from "../screens/SplashScreen";
import { AuthStack } from "./AuthStack";
import { AppTabs } from "./AppTabs";
import { ChildStatsScreen } from "../screens/parent/stats/ChildProgressScreen";

import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  App: undefined;
  Auth: undefined;
  ChildProgress: { childId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    if (!token) {
      hydrate();
    }
  }, [hydrate, token]);

  if (!isHydrated) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <>
            <Stack.Screen
              name="App"
              component={AppTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChildProgress"
              component={ChildStatsScreen}
              options={{ title: "Прогрес дитини" }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
