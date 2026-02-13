import { useEffect } from "react";
import { AppRoot } from "./src/app/AppRoot";
import "./global.css";
import { wakeUpServices } from "./src/shared/utils/wakeUpServices";

export default function App() {
  useEffect(() => {
    wakeUpServices();
  }, []);

  return <AppRoot />;
}
