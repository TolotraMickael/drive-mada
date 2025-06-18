import { create } from "zustand";

import { Envs } from "@/lib/config";
import { User } from "@/types/user";
import { Storage } from "@/lib/storage";
import { AuthStoreType, RegisterPayload } from "@/types/auth";

export const useAuthStore = create<AuthStoreType>((set, get) => ({
  token: null,
  user: null,

  login: async (email: string, password: string) => {
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
        await Storage.set("token", result.token);
        set(() => ({ token: result.token }));
      }
    } catch (error) {
      console.log(error);
    }
  },
  register: async (data: RegisterPayload) => {
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
        set(() => ({ token: result.token }));
      }
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    await Storage.delete("token");
    set(() => ({ token: null }));
  },
  checkAuth: async () => {
    const asToken = await Storage.get("token");
    if (asToken !== null) {
      set(() => ({ token: asToken }));
    }
  },
  setUser: (user: User) => {
    set({ user });
  },
  getProfile: async () => {
    try {
      const token = get().token;
      const response = await fetch(`${Envs.apiUrl}/utilisateurs/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      if (!response.ok) {
        console.log("Erreur", result.message);
      } else {
        set({ user: result.data });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
