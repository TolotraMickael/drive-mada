import QRCode from "react-native-qrcode-svg";
import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PhoneIcon } from "lucide-react-native";
import {
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";

import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { AppHeader } from "@/components/app-header";
import { useAuthStore } from "@/store/auth-store";
import { TReservation } from "@/types/reservation";
import { formatDateTime } from "@/lib/date";
import { Envs } from "@/lib/config";

function Item({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View className={`flex flex-col gap-1 ${className}}`}>
      <Text className="text-sm text-neutral-400">{label}</Text>
      <Text className="text-lg font-semibold">{value}</Text>
    </View>
  );
}

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

export default function ReservationDetails() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { id } = useLocalSearchParams();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<TReservation | null>(null);

  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    getReservationById();
  }, []);

  const getReservationById = useCallback(async () => {
    const reservationId = parseInt(id as string, 10);

    try {
      const url = `${Envs.apiUrl}/reservations/${reservationId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error");
      } else {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
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
      return;
    },
    []
  );

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Réservation trajet" onGoBack={() => router.back()} />

      {data ? (
        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className="flex-1 p-6 mt-6 bg-white rounded-lg">
            <View className="flex flex-row items-center justify-between mb-6">
              <View>
                <Text className="font-medium">
                  {formatDateTime(data.itineraire.date_depart, {
                    dateStyle: "full",
                  })}
                </Text>
                <Text className="font-medium">
                  {formatDateTime(data.itineraire.date_depart, {
                    timeStyle: "short",
                  })}
                </Text>
              </View>
              <PaymentInfo status={data.paiement.statut} />
            </View>
            <View className="flex-col flex-1 gap-6">
              <Item label="Départ" value={data.itineraire.depart} />
              <Item label="Destination" value={data.itineraire.destination} />
            </View>
            <View className="flex flex-row items-center w-full gap-2 mt-6">
              <View className="flex-1">
                <Item label="Type de véhicule" value={data.vehicule.nom} />
              </View>
              <View className="w-[1px] h-8 mx-2 bg-neutral-100" />
              <Item
                label="Place réservé"
                value={String(data.nombre_place_reserve)}
              />
              <View className="w-[1px] h-8 mx-2 bg-neutral-100" />
              <Item
                label="Montant Total"
                value={`Ar ${data.itineraire.prix * data.nombre_place_reserve}`}
              />
            </View>

            <View className="mt-8 border-t border-dashed border-neutral-400" />

            <View className="flex items-center justify-center flex-1 mt-6">
              <View className="rounded-lg w-[140px] h-[140px] bg-slate-100">
                <QRCode
                  value={JSON.stringify({ id: data.id_reservation, token })}
                  size={140}
                />
              </View>
            </View>
          </View>

          <View className="flex-row items-center flex-1 gap-4 p-6 mt-6 bg-white rounded-lg">
            {data.utilisateur.id_avatar ? (
              <View className="overflow-hidden border rounded-full w-14 h-14 border-neutral-100">
                <Image
                  source={Avatars[data.utilisateur.id_avatar]}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            ) : null}
            <View className="">
              <Text className="font-medium">{`${data.utilisateur.nom} ${data.utilisateur.prenom}`}</Text>
              <Text className="font-regular text-neutral-500">
                {data.utilisateur.telephone || ""}
              </Text>
            </View>
            <TouchableOpacity className="items-center justify-center w-12 h-12 ml-auto border rounded-lg border-neutral-200">
              <PhoneIcon color={Colors.icon} size={18} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View className="p-6">
          <Text>ID incorrect</Text>
        </View>
      )}
    </View>
  );
}
