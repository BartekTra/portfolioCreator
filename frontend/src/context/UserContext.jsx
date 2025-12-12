// context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../axios";
import { useNavigate } from "react-router";
const UserContext = createContext(null);

// Strony, które nie wymagają autentykacji
const PUBLIC_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/current_user")

      console.log(response)

      const data = await response.data;
      setUser(data);
      
      // Przekieruj tylko jeśli jesteśmy na stronie publicznej
      const currentPath = window.location.pathname;
      if (PUBLIC_PAGES.includes(currentPath)) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      
      // Przekieruj do /login tylko jeśli nie jesteśmy już na stronie publicznej
      const currentPath = window.location.pathname;
      if (!PUBLIC_PAGES.includes(currentPath)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser: fetchCurrentUser, setUser }}>
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