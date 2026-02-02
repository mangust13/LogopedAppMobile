import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/tabs/HomeScreen";
import { ChildrenEntry } from "../screens/tabs/ChildrenEntry";
import { ProgressEntry } from "../screens/tabs/ProgressEntry";
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
      <Tabs.Screen name="Children" component={ChildrenEntry} />
      <Tabs.Screen name="Progress" component={ProgressEntry} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
