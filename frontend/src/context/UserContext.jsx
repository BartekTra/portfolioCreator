// context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../axios";
import { useNavigate } from "react-router";
const UserContext = createContext(null);

// Strony, które nie wymagają autentykacji
const PUBLIC_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

// Funkcja sprawdzająca czy ścieżka jest publiczna (w tym udostępnione portfolio)
const isPublicPage = (pathname) => {
  if (PUBLIC_PAGES.includes(pathname)) return true;
  // Sprawdź czy to udostępnione portfolio (/share/:token)
  if (pathname.startsWith("/share/")) return true;
  return false;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const fetchCurrentUser = async () => {
    // Sprawdź czy jesteśmy na stronie udostępnionego portfolio
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/share/")) {
      // Na stronie udostępnionego portfolio nie loguj użytkownika i nie przekierowuj
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/user/current_user")

      console.log(response)

      const data = await response.data;
      setUser(data);
      
      // Przekieruj tylko jeśli jesteśmy na stronie publicznej (ale nie /share/:token)
      if (isPublicPage(currentPath) && !currentPath.startsWith("/share/")) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      
      // Przekieruj do /login tylko jeśli nie jesteśmy już na stronie publicznej
      if (!isPublicPage(currentPath)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Wywołaj endpoint wylogowania
      await api.delete("/auth/sign_out", {
        headers: {
          "client": localStorage.getItem("client"),
          "access-token": localStorage.getItem("access-token"),
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);
      // Kontynuuj wylogowanie nawet jeśli API zwróci błąd
    } finally {
      // Usuń tokeny z localStorage
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("authorization");
      
      // Wyczyść stan użytkownika
      setUser(null);
      
      // Przekieruj do strony logowania
      navigate("/login");
    }
  };

  useEffect(() => {
    // Sprawdź ścieżkę przed wywołaniem fetchCurrentUser
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/share/")) {
      // Na stronie udostępnionego portfolio nie wykonuj żadnych akcji związanych z logowaniem
      return;
    }
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchCurrentUser, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};