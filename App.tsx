import { useEffect } from "react";
import { LogBox } from "react-native";
import { AppRoot } from "./src/app/AppRoot";
import "./global.css";
import { wakeUpServices } from "./src/shared/utils/wakeUpServices";
import { useAuthStore } from "./src/store/authStore";
import { jwtDecode } from "jwt-decode";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

export default function App() {
  useEffect(() => {
    wakeUpServices();

    const checkTokenValidity = async () => {
      await useAuthStore.getState().hydrate();
      const token = useAuthStore.getState().token;

      if (token) {
        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            await useAuthStore.getState().logout();
          }
        } catch (error) {
          await useAuthStore.getState().logout();
        }
      }
    };

    checkTokenValidity();
  }, []);

  return <AppRoot />;
}
