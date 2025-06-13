import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Map, MapPin, Plus, Minus } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";

import { Envs } from "@/lib/config";
import { Images } from "@/lib/images";
import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { formatDateTime } from "@/lib/date";
import { Button } from "@/components/button";
import { AppHeader } from "@/components/app-header";
import { FieldInput } from "@/components/field-input";
import { useAuthStore } from "@/store/auth-store";
import { TItineraire } from "@/types/itineraire";
import { PaymentType } from "@/lib/constants";

const payments: RadioButtonProps[] = [
  {
    id: "1",
    label: "En espèce",
    value: "1",
  },
  {
    id: "2",
    label: "Par carte",
    value: "2",
    disabled: true,
  },
];

export default function Details() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [seat, setSeat] = useState(1);
  const [payment, setPayment] = useState("1");
  const [data, setData] = useState<TItineraire | null>(null);
  const [placeDisponible, setPlaceDisponible] = useState(0);

  useEffect(() => {
    getItineraireById();
  }, []);

  const getItineraireById = useCallback(async () => {
    const itineraireId = parseInt(id as string, 10);

    try {
      const response = await fetch(
        `${Envs.apiUrl}/itineraires/${itineraireId}`,
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
        setPlaceDisponible(result?.place_disponible || 0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const handlReservation = async () => {
    try {
      const apiUrl = `${Envs.apiUrl}/reservations`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_itineraire: Number(id),
          nombre_place_reserve: seat,
          type_paiement: PaymentType.cash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error =>", result.message);
      } else {
        router.replace("/(tabs)/reservation");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickMinus = () => {
    setSeat((prev) => (prev - 1 <= 0 ? 1 : prev - 1));
  };

  const handleClickPlus = () => {
    setSeat((prev) => (prev + 1 <= placeDisponible ? prev + 1 : prev));
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Réservation trajet" onGoBack={() => router.back()} />

      {!!data ? (
        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className="w-full h-[180px] overflow-hidden rounded-2xl bg-neutral-200">
            <Image
              source={Images.GpsNavigator}
              className="w-full h-[280px] bg-slate-300 -mt-14 rounded-2xl"
              resizeMode="contain"
            />
          </View>
          <View className="mt-6">
            <View className="flex-row flex-1 w-full pb-4 border-b border-neutral-200/50">
              <View className="w-[60%] px-4l">
                <Text className="font-regular text-neutral-600">
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
              <View className="border-l border-neutral-200/50" />
              <View className="w-[40%] items-end">
                <Text className="text-lg font-semibold text-center text-foreground">
                  Ar {data.prix}
                </Text>
                <Text className="text-sm text-center font-regular text-neutral-500">
                  par siège
                </Text>
              </View>
            </View>

            <View className="mt-6">
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

            <View className="flex flex-row justify-between px-6 py-3 mt-8 bg-white rounded-xl">
              <View className="flex flex-row items-center gap-2">
                <Image
                  source={Images.Car}
                  resizeMode="contain"
                  className="w-20 h-14"
                />
                <Text className="text-lg font-semibold">
                  {data.vehicule.nom_vehicule}
                </Text>
              </View>
              <View className="flex justify-center items-end">
                <Text className="font-medium text-foreground">
                  {data.nombre_place} places
                </Text>
                <Text className="text-sm font-regular text-neutral-500">
                  {data.place_disponible
                    ? data.place_disponible + 1 - seat
                    : null}{" "}
                  {placeDisponible === 0 ? (
                    <Text className="text-red-600">
                      Aucune place disponible
                    </Text>
                  ) : (
                    <Text>disponibles</Text>
                  )}
                </Text>
              </View>
            </View>

            <View className="flex flex-row items-center gap-4 px-6 py-3 mt-6 bg-white rounded-xl">
              {data.utilisateur.id_avatar ? (
                <Image
                  source={Avatars[data.utilisateur.id_avatar]}
                  resizeMode="contain"
                  className="rounded-full w-14 h-14 bg-neutral-100"
                />
              ) : null}
              <View className="">
                <Text className="font-medium">{`${data.utilisateur.nom_utilisateur} ${data.utilisateur.prenom_utilisateur}`}</Text>
                <Text className="font-regular text-neutral-500">
                  {data.utilisateur.telephone}
                </Text>
              </View>
            </View>

            <View className="mt-8 border-b border-neutral-200/50" />

            <View className="flex flex-col gap-8 mt-8">
              <FieldInput label="Combien de place vous souhaitez réserver ?">
                <View className="flex flex-row items-center p-1 mt-2 rounded-xl h-14 bg-neutral-200">
                  <TouchableOpacity
                    onPress={handleClickMinus}
                    disabled={placeDisponible === 0}
                  >
                    <View className="flex items-center justify-center h-full bg-white rounded-lg w-14">
                      <Minus color={Colors.icon} size={24} />
                    </View>
                  </TouchableOpacity>
                  <View className="items-center flex-1">
                    <Text className="text-3xl font-extrabold">{seat}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleClickPlus}
                    disabled={placeDisponible === 0}
                  >
                    <View className="flex items-center justify-center h-full bg-white rounded-lg w-14">
                      <Plus color={Colors.icon} size={24} />
                    </View>
                  </TouchableOpacity>
                </View>
              </FieldInput>

              <FieldInput label="Choisissez votre type de paiement">
                <View className="mt-2">
                  <RadioGroup
                    radioButtons={payments}
                    onPress={setPayment}
                    selectedId={payment}
                    labelStyle={{
                      fontFamily: "PoppinsRegular",
                    }}
                    containerStyle={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 4,
                    }}
                  />
                </View>
              </FieldInput>
            </View>

            <View className="flex flex-row items-center justify-between mt-6">
              <Text className="font-medium">Montant total à payer</Text>
              <Text className="text-2xl font-extrabold">
                Ar {data.prix * seat}
              </Text>
            </View>

            <Button
              onPress={handlReservation}
              containerClassName="flex-1 mt-8"
              disabled={placeDisponible === 0}
            >
              Réserver
            </Button>
          </View>
        </ScrollView>
      ) : (
        <View>
          <Text>ID incorrect</Text>
        </View>
      )}
    </View>
  );
}
