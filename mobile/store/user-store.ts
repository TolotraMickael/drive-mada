import { create } from "zustand";

import { Envs } from "@/lib/config";
import { User } from "@/types/user";
import { useAuthStore } from "./auth-store";

type TUserStore = {
  user: User | null;
  getProfile: () => Promise<void>;
};

export const useUserStore = create<TUserStore>((set) => ({
  user: null,

  getProfile: async () => {
    const { token } = useAuthStore();

    try {
      const response = await fetch(`${Envs.apiUrl}/utilisateurs/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        console.log("Erreur", result.message);
      } else {
        console.log({ result });
        set({
          user: {
            ...result.data,
            id: result.data.id_utilisateur,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
