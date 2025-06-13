import { Storage } from "@/lib/storage";
import { RegisterPayload } from "@/types/auth";
import { createContext, useContext, useState } from "react";

import { Envs } from "@/lib/config";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const apiUrl = `${Envs.apiUrl}/auth/login`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error =>", result.message);
      } else {
        console.log({ result });
        await Storage.set("token", result.token);
        setToken(result.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegister = async (data: RegisterPayload) => {
    try {
      const apiUrl = `${Envs.apiUrl}/auth/register`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: data.firstName,
          prenom: data.lastName,
          email: data.email,
          telephone: data.phoneNumber,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error =>", result.message);
      } else {
        await Storage.set("token", result.token);
        setToken(result.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuth = async () => {
    const token = await Storage.get("token");
    if (token !== null) {
      setToken(token);
    }
  };

  const handleLogout = async () => {
    await Storage.delete("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        checkAuth,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    console.log("Le _layout doit être englobé par AuthProvider.");
  }

  return authContext;
};
