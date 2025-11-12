// src/components/Auth.tsx
import React, { useEffect, useState } from "react";
import Login from "./LoginPage";
import Register from "./RegisterPage";
import MainPage from "./MainPage";
import { useUser } from "../context/UserContext";
import RegisterSecondStage from "./RegisterSecondStage";

const AuthViewHelper = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState("login");
  const [emailForMutation, setEmailForMutation] = useState("");
  const [passwordForMutation, setPasswordForMutation] = useState("");

  const switchToRegister = () => setCurrentView("register");
  const switchToRegisterSecondStage = () =>
    setCurrentView("registerSecondStage");

  const setEmail = (email) => setEmailForMutation(email);
  const setPassword = (password) => setPasswordForMutation(password);

  const { user } = useUser();

  return (
    <div>
      {currentView === "register" && (
        <Register
          onSuccess={switchToLogin}
          onSwitchToLogin={switchToLogin}
          onSwitchToRegisterSecondStage={switchToRegisterSecondStage}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      )}
      {currentView === "registerSecondStage" && <RegisterSecondStage 
        chosenEmail={emailForMutation}
        chosenPassword={passwordForMutation}
      />}
    </div>
  );
};

export default AuthViewHelper;
