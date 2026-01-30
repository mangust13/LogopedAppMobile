import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { ChildrenScreen } from "../screens/tabs/ChildrenScreen";
import { ProgressScreen } from "../screens/tabs/ProgressScreen";
import { ProfileScreen } from "../screens/tabs/ProfileScreen";

export type AppTabsParamList = {
  Home: undefined;
  Children: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Tabs = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Children" component={ChildrenScreen} />
      <Tabs.Screen name="Progress" component={ProgressScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
