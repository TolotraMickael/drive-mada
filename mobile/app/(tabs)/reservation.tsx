import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty";
import { AppHeader } from "@/components/app-header";
import { Envs } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import { TReservation } from "@/types/reservation";
import { CardReservation } from "@/components/card-reservation";

export default function ReservationScreen() {
  const { token } = useAuthStore();
  const [data, setData] = useState<TReservation[]>([]);

  useEffect(() => {
    getUserReservation();
  });

  const getUserReservation = async () => {
    try {
      const response = await fetch(`${Envs.apiUrl}/reservations/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Error", result.message);
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Mes réservations" />

      {data.length !== 0 ? (
        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 116 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col gap-3 mt-4">
            {data.map((reservation) => (
              <CardReservation
                key={reservation.id_reservation}
                href={{
                  pathname: "/(tabs)/(home)/details/[id]",
                  params: { id: reservation.id_reservation },
                }}
                depart={reservation.itineraire.depart}
                destination={reservation.itineraire.destination}
                dateDepart={reservation.itineraire.date_depart}
                nbPlaceReserve={reservation.nombre_place_reserve}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyState message="Aucune réservation trouvée, Vous pouvez rechercher en cliquant le lien ci-dessous">
          <Link href="/(tabs)/(home)" asChild>
            <Button variant="outlined" containerClassName="mt-6">
              Rechercher
            </Button>
          </Link>
        </EmptyState>
      )}
    </View>
  );
}
