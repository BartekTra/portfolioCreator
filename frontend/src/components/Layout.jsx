import React from "react";
import MainPage from "./MainPage";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      {children}
    </div>
  );
}

export default Layout;

