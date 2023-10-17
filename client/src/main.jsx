import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/authcontext";
import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);
