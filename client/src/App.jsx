import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "./contexts/authcontext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import NavBar from "./components/NavBar";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (token || path === "/login" || path === "/register") {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const logout = () => {
    setToken(null); // Update state to show user is logged out
    localStorage.removeItem("token"); // Clear token from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, handleNavigation }}>
      <NavBar />
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/homepage" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            token ? <Navigate to="/homepage" replace /> : <RegisterPage />
          }
        />
        <Route
          path="/homepage"
          element={token ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/account"
          element={token ? <MyAccountPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
