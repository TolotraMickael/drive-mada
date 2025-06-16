import { useCallback, useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  Pencil,
  Map,
  MapPin,
  Armchair,
  ChevronDown,
  ChevronUp,
  SwitchCamera,
  QrCode,
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
  const [open, setOpen] = useState(false);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

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
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  const handleOpenScan = useCallback(async () => {
    if (!permission?.granted) {
      await requestPermission();
    } else {
      setOpen(true);
    }
  }, [permission]);

  const handleCloseScan = () => {
    setOpen(false);
  };

  const onBarcodeScanned = useCallback(
    (scanningResult: BarcodeScanningResult) => {
      console.log({ scanningResult });
    },
    []
  );

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
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
        <View className="flex-col w-full gap-8 p-6 bg-white rounded-2xl">
          <View className="flex-row justify-between overflow-hidden">
            <Text className="text-3xl font-heading">Trajet</Text>
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
              <Text className="text-sm text-red-700 font-regular">
                Aucune place disponible
              </Text>
            ) : (
              <Text className="font-regular">
                Disponible: {data.place_disponible}
              </Text>
            )}
          </View>
        </View>

        {(data.reservations?.length || 0) > 0 && (
          <View className="p-6 mt-6 bg-white rounded-2xl">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-medium">
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
              <View className="mt-4">
                {data.reservations?.map((per, index, array) => (
                  <View
                    key={per.id_reservation}
                    className={`flex flex-row items-center justify-between py-3 ${
                      index !== array.length - 1
                        ? "border-b-2 border-secondary"
                        : ""
                    } rounded-xl`}
                  >
                    <View className="flex-row gap-4">
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
                    <Text className="w-8 pt-1 text-center bg-white rounded-full shadow-lg text-neutral-500 font-regular text-m">
                      {per.nombre_place_reserve}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="flex items-center justify-center p-6 mt-6 bg-white rounded-lg">
          <View className="mb-6">
            <Text className="text-2xl text-center font-heading">
              Vérification
            </Text>
            <Text className="text-sm text-center font-regular text-muted-foreground">
              Scanner le QR Code pour vérifier la validité de la réservation.
            </Text>
          </View>
          <View className="mb-6">
            <Image source={Images.QrCode} className="w-32 h-32" />
          </View>
          <View className="flex flex-row gap-4">
            <Button disabled={!permission || open} onPress={handleOpenScan}>
              Scanner
            </Button>
            {open && (
              <Button variant="secondary" onPress={handleCloseScan}>
                Annuler
              </Button>
            )}
          </View>

          {open && (
            <View className="relative justify-center flex-1 w-full mt-8 overflow-hidden rounded-lg max-w-80 h-80 bg-slate-200">
              <CameraView
                facing={facing}
                className="rounded-lg"
                style={{ flex: 1, width: "100%", height: "100%" }}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={onBarcodeScanned}
              />
              <View className="absolute flex-1 w-full h-full bg-transparent">
                <View className="p-3 mt-auto bg-neutral-900/30">
                  <TouchableOpacity
                    className="self-start p-2 border-[1.5px] rounded-full border-neutral-50"
                    onPress={() =>
                      setFacing((prev) => (prev === "front" ? "back" : "front"))
                    }
                  >
                    <SwitchCamera size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* <View className="flex-col items-center justify-between gap-6 p-6 mt-6 bg-white align-center rounded-2xl">
          <Text className="text-lg font-medium">Vérification</Text>
          <ScanLine size={100} strokeWidth={0.5} />
          <Button>Scanner</Button>
        </View> */}
      </ScrollView>
    </View>
  );
}
