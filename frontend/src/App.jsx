import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import AppRoutes from "./components/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { DarkModeProvider } from "./context/DarkModeContext.jsx";
function App() {
  return (
    <Router>
      <DarkModeProvider>
        <UserProvider>
          <AppRoutes />
        </UserProvider>
      </DarkModeProvider>
    </Router>
  );
}

export default App;
