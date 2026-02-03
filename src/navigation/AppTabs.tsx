import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeEntry } from "../screens/tabs/HomeEntry";
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
      <Tabs.Screen name="Home" component={HomeEntry} />
      <Tabs.Screen name="Children" component={ChildrenEntry} />
      <Tabs.Screen name="Progress" component={ProgressEntry} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
