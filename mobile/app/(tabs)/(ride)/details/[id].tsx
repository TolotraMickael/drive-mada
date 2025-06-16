import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pencil,
  Map,
  MapPin,
  Armchair,
  ChevronDown,
  ChevronUp,
  ScanLine,
} from "lucide-react-native";

import { Envs } from "@/lib/config";
import { Images } from "@/lib/images";
import { Colors } from "@/lib/colors";
import { formatDateTime } from "@/lib/date";
import { Button } from "@/components/button";
import { TItineraire } from "@/types/itineraire";
import { useAuthStore } from "@/store/auth-store";
import { AppHeader } from "@/components/app-header";
import { Avatars } from "@/lib/avatars";

export default function DetailsItineraire() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [showReservations, setShowReservations] = useState(false);
  const [data, setData] = useState<TItineraire | null>(null);

  useEffect(() => {
    getDetailItineraireById();
  }, []);

  const getDetailItineraireById = useCallback(async () => {
    const itineraireId = parseInt(id as string, 10);

    try {
      const response = await fetch(
        `${Envs.apiUrl}/itineraires/me/${itineraireId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.log("Error", result.message);
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  if (!data) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Aucune donnée disponible</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AppHeader onGoBack={() => router.back()} />

      <ScrollView
        className="flex-1 p-6 pt-1"
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full bg-white p-6 gap-8 flex-col rounded-2xl">
          <View className="flex-row justify-between overflow-hidden">
            <Text className="font-heading text-3xl">Trajet</Text>
            <TouchableOpacity>
              <Pencil color={Colors.icon} size={24} />
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <Text
              className="font-regular text-neutral-600"
              style={{ textTransform: "capitalize" }}
            >
              {formatDateTime(data.date_depart, {
                dateStyle: "full",
              })}
            </Text>
            <Text className="font-regular text-neutral-600">
              {formatDateTime(data.date_depart, {
                timeStyle: "short",
              })}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-col">
              <View className="flex flex-row items-center gap-3">
                <Map color={Colors.primary} size={24} />
                <Text className="text-lg font-semibold">{data.depart}</Text>
              </View>
              <View className="h-5 my-2 ml-3 border-l border-dashed border-primary" />
              <View className="flex flex-row items-center gap-3">
                <MapPin color={Colors.primary} size={24} />
                <Text className="text-lg font-semibold">
                  {data.destination}
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <View className="flex-col items-end justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  Ar {data.prix.toLocaleString()}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Image
                    source={Images.Car}
                    resizeMode="contain"
                    className="w-20 h-14"
                  />
                  <Text className="text-lg font-semibold">
                    {data.vehicule?.nom_vehicule}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              <Armchair color={Colors.icon} size={24} />
              <Text className="ml-2 font-regular">
                Total: {data.nombre_place}
              </Text>
            </View>
            <View className="h-5 my-2 ml-3 border-l border-muted-foreground" />
            {data.place_disponible === 0 ? (
              <Text className="text-red-600">Aucune place disponible</Text>
            ) : (
              <Text className="font-regular">
                Disponible: {data.place_disponible}
              </Text>
            )}
          </View>
        </View>

        {(data.reservations?.length || 0) > 0 && (
          <View className="mt-6 bg-white p-6 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <Text className="font-medium text-lg">
                Réservations ({data.nombre_place - (data.place_disponible || 0)}
                )
              </Text>
              <TouchableOpacity
                className="p-2"
                onPress={() => setShowReservations(!showReservations)}
              >
                {showReservations ? <ChevronUp /> : <ChevronDown />}
              </TouchableOpacity>
            </View>
            {showReservations && (
              <View className="mt-4" key={data.utilisateur.id_utilisateur}>
                {data.reservations?.map((per, index, array) => (
                  <View
                    className={`flex flex-row items-center justify-between py-3  ${
                      index !== array.length - 1
                        ? "border-b-2 border-secondary"
                        : ""
                    } rounded-xl`}
                  >
                    <View className="flex-row  gap-4">
                      <Image
                        source={Avatars[per.utilisateur.id_avatar]}
                        resizeMode="contain"
                        className="rounded-full w-14 h-14 bg-neutral-100"
                      />
                      <View className="">
                        <Text className="font-medium line-clamp-1">{`${per.utilisateur.nom} ${per.utilisateur.prenom}`}</Text>
                        <Text className="font-regular text-neutral-500">
                          {per.utilisateur.telephone}
                        </Text>
                      </View>
                    </View>
                    <Text className="w-8 text-neutral-500 text-center font-regular text-m bg-white shadow-lg pt-1 rounded-full">
                      {per.nombre_place_reserve}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        <View className="mt-6 bg-white p-6 flex-col align-center items-center justify-between gap-6 rounded-2xl">
          <Text className="font-medium text-lg">Vérification</Text>
          <ScanLine size={100} strokeWidth={0.5} />
          <Button>Scanner</Button>
        </View>
      </ScrollView>
    </View>
  );
}
