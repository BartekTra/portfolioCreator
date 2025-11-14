// context/DarkModeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const DarkModeContext = createContext(null);

// Funkcja pomocnicza do inicjalizacji trybu ciemnego
const getInitialDarkMode = () => {
  // PRIORYTET 1: Sprawdź localStorage
  const saved = localStorage.getItem("darkMode");
  if (saved !== null) {
    return saved === "true";
  }
  // PRIORYTET 2: Jeśli nie ma w localStorage, użyj preferencji przeglądarki
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

// Ustaw klasę dark synchronicznie przed pierwszym renderem
const initialDarkMode = getInitialDarkMode();
if (initialDarkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    // Zastosuj klasę dark do elementu html
    console.log("Dark mode changed to:", isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      console.log("Added 'dark' class to html");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Removed 'dark' class from html");
    }
    // Zapisz preferencje użytkownika do localStorage
    localStorage.setItem("darkMode", isDarkMode.toString());
    console.log("Updated localStorage to:", isDarkMode);
  }, [isDarkMode]);

  // Nasłuchuj zmian preferencji przeglądarki, ale tylko jeśli użytkownik nie ustawił własnej preferencji
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      // Aktualizuj tylko jeśli nie ma zapisanej preferencji w localStorage
      // Sprawdzamy bezpośrednio localStorage, aby mieć aktualną wartość
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    // Dodaj listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback dla starszych przeglądarek
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleDarkMode = () => {
    // Zawsze zapisuj do localStorage gdy użytkownik kliknie przycisk
    // To oznacza, że użytkownik wyraźnie ustawił preferencję
    console.log("toggleDarkMode called, current state:", isDarkMode);
    setIsDarkMode((prev) => {
      const newValue = !prev;
      console.log("Setting dark mode to:", newValue);
      // Zapisz natychmiast do localStorage
      localStorage.setItem("darkMode", newValue.toString());
      console.log("Saved to localStorage:", newValue);
      return newValue;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

