// context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { CHECK_TOKENS } from "../graphql/mutations/users/checkTokens";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [checkTokens, { loading }] = useLazyQuery(CHECK_TOKENS, {
    fetchPolicy: "network-only",
  });

  const refetchUser = async () => {
    const result = await checkTokens();
    if (result?.data?.currentUser) {
      setUser(result.data.currentUser);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const result = await checkTokens();
      if (result?.data?.currentUser) {
        setUser(result.data.currentUser);
      }
    };
    fetchUser();
  }, [checkTokens]);

  return (
    <UserContext.Provider value={{ user, loading, refetchUser, setUser }}>
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
