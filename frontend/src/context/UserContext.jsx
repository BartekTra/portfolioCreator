
import { createContext, useContext, useState, useEffect } from "react";
import api from "../axios";
import { useNavigate } from "react-router";
const UserContext = createContext(null);

const PUBLIC_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

const isPublicPage = (pathname) => {
  if (PUBLIC_PAGES.includes(pathname)) return true;
  if (pathname.startsWith("/share/")) return true;
  return false;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const fetchCurrentUser = async () => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/share/")) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/user/current_user")

      const data = await response.data;
      setUser(data);
      
      if (isPublicPage(currentPath) && !currentPath.startsWith("/share/")) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      
      if (!isPublicPage(currentPath)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.delete("/auth/sign_out", {
        headers: {
          "client": localStorage.getItem("client"),
          "access-token": localStorage.getItem("access-token"),
        }
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("access-token");
      localStorage.removeItem("client");
      localStorage.removeItem("authorization");
      
      setUser(null);
      
      navigate("/login");
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith("/share/")) {
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