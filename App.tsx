//App.tsx
import { useEffect } from "react";
import { LogBox } from "react-native";
import { AppRoot } from "./src/app/AppRoot";
import "./global.css";
import { wakeUpServices } from "./src/shared/utils/wakeUpServices";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export default function App() {
  useEffect(() => {
    wakeUpServices();
  }, []);

  return <AppRoot />;
}
