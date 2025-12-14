import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";
import { useDarkMode } from "../context/DarkModeContext";
import {
  Home,
  User,
  Settings,
  FolderKanban,
  FolderOpen,
  Moon,
  Sun,
  Languages,
} from "lucide-react";

function MainPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, loading: loadingUser } = useUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (loadingUser)
    return (
      <p className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        {t("common.loading")}
      </p>
    );

  if (!user)
    return (
      <p className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        {t("common.loadingUser")}
      </p>
    );

  return (
    <div className="min-h-18 bg-gray-50 dark:bg-gray-900 border-b-1 border-gray-200 dark:border-gray-700 z-10">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Lewa strona - przyciski */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FolderKanban size={20} />
                <span className="font-medium">{t("navigation.projects")}</span>
              </button>

              <button
                onClick={() => navigate("/title_pages")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Home size={20} />
                <span className="font-medium">{t("navigation.titlePage")}</span>
              </button>

              <button
                onClick={() => navigate("/repositories")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FolderOpen size={20} />
                <span className="font-medium">{t("navigation.portfolio")}</span>
              </button>
            </div>

            {/* Prawa strona - dane użytkownika i przycisk trybu ciemnego */}
            <div className="flex items-center space-x-3">
              {/* Przełącznik języka */}
              <div className="relative group">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title={t("navigation.language")}
                >
                  <Languages size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={() => changeLanguage("pl")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      i18n.language === "pl" || i18n.language.startsWith("pl")
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    Polski
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      i18n.language === "en" || i18n.language.startsWith("en")
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    "Toggle dark mode clicked, current state:",
                    isDarkMode
                  );
                  toggleDarkMode();
                }}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={
                  isDarkMode
                    ? t("darkMode.toggleLight")
                    : t("darkMode.toggleDark")
                }
                type="button"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {user.nickname}
              </span>
              <img
                onClick={() => navigate("/profile")}
                src={user.avatar_url}
                alt={`${user.nickname} avatar`}
                className="w-15 h-15 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.surname}&background=3b82f6&color=fff`;
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MainPage;
