import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage"; // Import RegisterPage
import "./App.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />{" "}
      {/* Add route for RegisterPage */}
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
  </Router>
);

export default App;
