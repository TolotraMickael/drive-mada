import {
  useState,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";

import { Storage } from "@/lib/storage";

const AuthContext = createContext({
  isLoading: false,
  isAuthenticated: false,
  login(email: string, password: string) {},
  logout() {},
});

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setTimeout(async () => {
        const token = (await Storage.get("token")) as string;
        setIsAuthenticated(!!token);
        setIsLoading(false);
      }, 3000);
    }
    fetchData();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // API...

    // Exemple
    if (email === "admin@yopmail.com" && password === "admin") {
      const token = "SU7a1MOYbJos4gH65bt1plVZxh4mG9LHzqDsS9PwFCRy3SmXevO";
      await Storage.set("token", token);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = useCallback(async () => {
    await Storage.delete("token");
    setIsAuthenticated(false);
  }, []);

  console.log("first =>", { isAuthenticated, isLoading });

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
