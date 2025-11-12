import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import AuthViewHelper from "./components/AuthViewHelper";
import AppRoutes from "./components/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
function App() {
  return (
    <Router>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

export default App;
