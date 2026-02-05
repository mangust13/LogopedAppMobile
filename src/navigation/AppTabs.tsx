//src\navigation\AppTabs.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HomeEntry } from "../screens/tabs/HomeEntry";
import { ChildrenEntry } from "../screens/tabs/ChildrenEntry";
import { GamesEntry } from "../screens/games/GamesEntry";
import { ProgressEntry } from "../screens/tabs/ProgressEntry";
import { ProfileEntry } from "../screens/tabs/ProfileEntry";

export type AppTabsParamList = {
  Home: undefined;
  Children: undefined;
  Games: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 12,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Children") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Games") {
            iconName = focused ? "game-controller" : "game-controller-outline";
            return (
              <Ionicons
                name={iconName}
                size={30}
                color={color}
                style={{ marginBottom: -3 }}
              />
            );
          } else if (route.name === "Progress") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeEntry}
        options={{ title: "Головна" }}
      />
      <Tabs.Screen
        name="Games"
        component={GamesEntry}
        options={{ title: "Ігри" }}
      />
      <Tabs.Screen
        name="Children"
        component={ChildrenEntry}
        options={{ title: "Діти" }}
      />
      <Tabs.Screen
        name="Progress"
        component={ProgressEntry}
        options={{ title: "Прогрес" }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileEntry}
        options={{ title: "Профіль" }}
      />
    </Tabs.Navigator>
  );
}
