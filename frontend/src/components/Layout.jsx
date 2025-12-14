import React from "react";
import MainPage from "./MainPage";

function Layout({ children }) {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <MainPage />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default Layout;

