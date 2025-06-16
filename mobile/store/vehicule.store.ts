import { create } from "zustand";

import { Envs } from "@/lib/config";
import { getAuthToken } from "@/lib/token";
import { TVehicules } from "@/types/vehicules";

type TUserStore = {
  vehicules: TVehicules[];
  getVehicules: () => Promise<void>;
};

export const useVehiculeStore = create<TUserStore>((set) => ({
  vehicules: [],

  getVehicules: async () => {
    const token = getAuthToken();

    try {
      const response = await fetch(`${Envs.apiUrl}/vehicules`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Erreur", result.message);
      } else {
        set({ vehicules: result.data });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
