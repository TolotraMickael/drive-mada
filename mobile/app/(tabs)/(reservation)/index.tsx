import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Envs } from "@/lib/config";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty";
import { AppHeader } from "@/components/app-header";
import { useAuthStore } from "@/store/auth-store";
import { TReservation } from "@/types/reservation";
import { CardReservation } from "@/components/card-reservation";
import { Colors } from "@/lib/colors";

export default function ReservationScreen() {
  const { token } = useAuthStore();
  const [data, setData] = useState<TReservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserReservations();
  }, []);

  const getUserReservations = async () => {
    setLoading(true);

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
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Mes réservations" />

      {loading ? (
        <View className="flex items-center justify-center w-full h-32">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : data.length !== 0 ? (
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
                  pathname: "/(tabs)/(reservation)/details/[id]",
                  params: { id: reservation.id_reservation },
                }}
                depart={reservation.itineraire.depart}
                destination={reservation.itineraire.destination}
                dateDepart={reservation.itineraire.date_depart}
                nbPlaceReserve={reservation.nombre_place_reserve}
                montant={
                  reservation.nombre_place_reserve * reservation.itineraire.prix
                }
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 pb-16">
          <EmptyState message="Aucune réservation trouvée, Vous pouvez rechercher en cliquant le lien ci-dessous">
            <Link href="/(tabs)/(home)" asChild>
              <Button variant="outlined" containerClassName="mt-6">
                Rechercher
              </Button>
            </Link>
          </EmptyState>
        </View>
      )}
    </View>
  );
}
