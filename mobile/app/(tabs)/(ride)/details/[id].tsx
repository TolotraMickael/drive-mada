import { Toast } from "toastify-react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import {
  Pencil,
  Armchair,
  ChevronUp,
  ChevronDown,
  SwitchCamera,
} from "lucide-react-native";

import { Envs } from "@/lib/config";
import { Images } from "@/lib/images";
import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { formatDateTime } from "@/lib/date";
import { Button } from "@/components/button";
import { TItineraire } from "@/types/itineraire";
import { useAuthStore } from "@/store/auth-store";
import { AppHeader } from "@/components/app-header";
import { EditModal } from "./_modals/update";
import { CheckinModal } from "./_modals/check-in";
import { delay } from "@/lib/delay";
import { Item } from "@/components/item";

function PaymentInfo({ status }: { status: string }) {
  const Status = {
    AUTHORIZED: "Paiement en attente",
    PAID: "Paiement effectué",
    CANCELLED: "Paiement annulé",
    FAILED: "Paiement échoué",
  };

  return (
    <View className="flex flex-row items-center self-start gap-2 px-3 py-1 rounded-full bg-neutral-400">
      <Text className="text-sm font-regular text-neutral-50">
        {Status[status as never]}
      </Text>
    </View>
  );
}

export default function DetailsItineraire() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [showReservations, setShowReservations] = useState(false);
  const [data, setData] = useState<TItineraire | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [reservationId, setReservationId] = useState<number>(-1);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  const hasReservation = (data?.reservations?.length || 0) > 0;

  useFocusEffect(
    useCallback(() => {
      getDetailItineraireById();
    }, [])
  );

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseCheckinModal = () => {
    setReservationId(-1);
  };

  const getDetailItineraireById = useCallback(async () => {
    const itineraireId = parseInt(id as string, 10);
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleRefresh = () => {
    getDetailItineraireById();
    setOpenModal(false);
  };

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
    async (scanningResult: BarcodeScanningResult) => {
      await delay();
      handleCloseScan();

      try {
        const dataObject = JSON.parse(scanningResult.data);
        console.log({ dataObject });

        if (
          !dataObject ||
          !dataObject?.id_itineraire ||
          !dataObject?.id_reservation
        ) {
          throw new Error();
        }

        const idReservation = Number(dataObject["id_reservation"]);
        const idItineraire = Number(dataObject["id_itineraire"]);

        // console.log("data?.id_itineraire", data?.id_itineraire);

        if (idItineraire !== data?.id_itineraire) {
          throw new Error();
        } else {
          setReservationId(idReservation);
        }
      } catch (err) {
        Toast.show({
          type: "error",
          visibilityTime: 10000,
          text2: "Les informations contenues dans le QR Code sont invalides.",
          progressBarColor: "transparent",
        });
      }
    },
    [data?.id_itineraire]
  );

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Détail du trajet" onGoBack={() => router.back()} />

      {data && !loading ? (
        <>
          <ScrollView
            className="flex-1 p-6 pt-1"
            contentContainerStyle={{ paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="relative flex-col w-full gap-8 p-6 bg-white rounded-lg">
              <View className="absolute flex-row justify-between overflow-hidden top-4 right-4">
                <TouchableOpacity
                  onPress={() => setOpenModal(true)}
                  className="items-center justify-center rounded-lg w-11 h-11"
                  disabled={hasReservation}
                >
                  <Pencil
                    color={hasReservation ? Colors.secondary : Colors.icon}
                    size={18}
                  />
                </TouchableOpacity>
              </View>

              <View className="mr-14">
                <Text className="font-medium capitalize text-foreground">
                  {formatDateTime(data.date_depart, {
                    dateStyle: "full",
                  })}
                </Text>
                <Text className="font-medium text-foreground">
                  {formatDateTime(data.date_depart, {
                    timeStyle: "short",
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-col flex-1 gap-6">
                  <Item label="Départ" value={data.depart} />
                  <Item label="Destination" value={data.destination} />
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
                    Total : {data.nombre_place}
                  </Text>
                </View>
                <View className="h-5 my-2 ml-3 border-l border-neutral-200" />
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

            <View className="p-6 mt-6 bg-white rounded-lg">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-medium">
                  Réservations (
                  {data.nombre_place - (data.place_disponible || 0)})
                </Text>
                {!!data.reservations?.length && (
                  <TouchableOpacity
                    className="p-2 rounded-lg"
                    onPress={() => setShowReservations(!showReservations)}
                  >
                    {showReservations ? <ChevronUp /> : <ChevronDown />}
                  </TouchableOpacity>
                )}
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
                      } rounded-lg`}
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
                      <View className="items-end gap-2">
                        <Text className="w-8 pt-1 text-center bg-white rounded-full shadow-lg text-neutral-500 font-regular text-m">
                          {per.nombre_place_reserve}
                        </Text>
                        <PaymentInfo status={per.utilisateur.statut} />
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className="flex items-center justify-center p-6 mt-6 bg-white rounded-lg">
              <View className="mb-6">
                <Text className="text-2xl text-center font-heading">
                  Vérification
                </Text>
                <Text className="text-sm text-center font-regular text-muted-foreground">
                  Scanner le QR Code pour vérifier la validité de la
                  réservation.
                </Text>
              </View>
              <View className="mb-6">
                <Image source={Images.QrCode} className="w-32 h-32" />
              </View>
              <View className="flex flex-row gap-4">
                <Button
                  disabled={!permission || open || !hasReservation}
                  onPress={handleOpenScan}
                >
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
                          setFacing((prev) =>
                            prev === "front" ? "back" : "front"
                          )
                        }
                      >
                        <SwitchCamera size={20} color={Colors.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <EditModal
            data={data}
            open={openModal}
            refresh={handleRefresh}
            onClose={handleCloseModal}
          />
          <CheckinModal
            reservationId={reservationId}
            onClose={handleCloseCheckinModal}
          />
        </>
      ) : (
        <View className="items-center justify-center flex-1">
          <Text>Aucune donnée disponible</Text>
        </View>
      )}
    </View>
  );
}
