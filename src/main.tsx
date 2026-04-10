import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installLocalhostImageBlocker, installLocalhostImageRequestBlocker } from "@/utils/images";

installLocalhostImageBlocker();
installLocalhostImageRequestBlocker();
createRoot(document.getElementById("root")!).render(<App />);
