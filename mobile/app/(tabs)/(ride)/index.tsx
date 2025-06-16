import { Link } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty";
import { AppHeader } from "@/components/app-header";
import { CardItinerary } from "@/components/card-itinerary";

import { useAuthStore } from "@/store/auth-store";
import { TItineraire } from "@/types/itineraire";
import { Envs } from "@/lib/config";

export default function RideScreen() {
  const { token } = useAuthStore();
  const [data, setData] = useState<TItineraire[]>([]);

  // useFocusEffect(() => {
  //   useCallback(() => {
  //     getUserItineraires();
  //   }, []);
  // });

  useEffect(() => {
    getUserItineraires();
  }, []);

  const getUserItineraires = async () => {
    try {
      const response = await fetch(`${Envs.apiUrl}/itineraires/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Error", result.message);
      } else {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Mes trajets" />
      {data.length !== 0 ? (
        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 116 }}
          showsVerticalScrollIndicator={false}
        >
          <Link href="/(tabs)/(ride)/create" asChild>
            <Button
              containerClassName=""
              variant="outlined"
              className="flex items-center justify-center px-[19px] py-2 h-12 border-2  border-primary rounded-lg disabled:opacity-40"
            >
              Créer un trajet
            </Button>
          </Link>
          <View className="flex flex-col gap-3 mt-6">
            {data.map((itineraire) => (
              <CardItinerary
                key={itineraire.id_itineraire}
                href={{
                  pathname: "/(tabs)/(ride)/details/[id]",
                  params: { id: itineraire.id_itineraire },
                }}
                depart={itineraire.depart}
                destination={itineraire.destination}
                dateDepart={itineraire.date_depart}
                frais={itineraire.prix}
                nombrePlace={itineraire.nombre_place}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyState message="Aucun trajet pour le moment. Vous pouvez créer et partager votre trajet.">
          <Link href="/(tabs)/(ride)/create" asChild>
            <Button variant="outlined" containerClassName="mt-6">
              Créer un trajet
            </Button>
          </Link>
        </EmptyState>
      )}
    </View>
  );
}
