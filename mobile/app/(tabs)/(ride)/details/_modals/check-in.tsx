import { Toast } from "toastify-react-native";
import { useCallback, useEffect, useState } from "react";
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react-native";
import { Modal, Text, View, ActivityIndicator, Image } from "react-native";

import { Envs } from "@/lib/config";
import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { Button } from "@/components/button";
import { TPaymentStatus } from "@/types/paiement";
import { TUtilisateur } from "@/types/utilisateur";
import { useAuthStore } from "@/store/auth-store";
import { TReservationCheckin } from "@/types/reservation";

type Props = {
  reservationId: number;
  onClose: () => void;
};

function ReservationInvalid({ onClose }: { onClose: () => void }) {
  return (
    <View className="flex flex-col items-center justify-center gap-6">
      <View className="flex flex-col items-center justify-center gap-2">
        <Text className="text-2xl text-center font-heading">Erreur</Text>
        <Text className="text-base text-center text-muted-foreground font-regular max-w-[260px]">
          La réservation scannée est invalide ou introuvable.
        </Text>
      </View>
      <Button variant="secondary" onPress={onClose}>
        Fermer
      </Button>
    </View>
  );
}

function ReservationStatus({
  status,
  utilisateur,
  loading,
  onClose,
  nbPlaceReserve,
  handleCompletePaiement,
}: {
  loading: boolean;
  status: TPaymentStatus;
  utilisateur?: TUtilisateur;
  nbPlaceReserve?: number;
  handleCompletePaiement: () => void;
  onClose: () => void;
}) {
  const Status: Record<
    TPaymentStatus,
    { title: string; description: string; icon: React.ReactNode }
  > = {
    PAID: {
      title: "Paiement effectué",
      description: "Cette réservation a bien été payée.",
      icon: (
        <View className="p-4 rounded-full bg-green-600/20">
          <CircleCheckBig size={42} color={Colors.success} />
        </View>
      ),
    },
    AUTHORIZED: {
      title: "Paiement en attente",
      description:
        "Cette réservation n'a pas encore été réglée. Veuillez voir avec le client pour un paiement en espèces.",
      icon: (
        <View className="p-4 rounded-full bg-yellow-500/20">
          <CircleAlert size={42} color={Colors.warning} />
        </View>
      ),
    },
    CANCELLED: {
      title: "Paiement annulé",
      description:
        "Le paiement de cette réservation a été annulée. Veuillez voir avec le client pour un paiement en espèces.",
      icon: (
        <View className="p-4 rounded-full bg-red-600/20">
          <CircleX size={42} color={Colors.error} />
        </View>
      ),
    },
    FAILED: {
      title: "Paiement échoué",
      description:
        "Le paiement de cette réservation a été échoué. Veuillez voir avec le client pour un paiement en espèces.",
      icon: (
        <View className="p-4 rounded-full bg-red-600/20">
          <CircleX size={42} color={Colors.error} />
        </View>
      ),
    },
  };

  return (
    <View className="flex flex-col items-center justify-center gap-6">
      {Status[status].icon}

      <View className="flex flex-col items-center justify-center gap-1">
        <Text className="text-2xl text-center font-heading">
          {Status[status].title}
        </Text>
        <Text className="text-center font-regular text-muted-foreground">
          {Status[status].description}
        </Text>
      </View>

      <View className="flex flex-row items-center w-full gap-3 p-4 rounded-xl bg-background">
        {utilisateur?.id_avatar !== undefined && (
          <Image
            source={Avatars[utilisateur.id_avatar]}
            className="bg-white border rounded-full w-14 h-14 border-neutral-300"
          />
        )}
        {utilisateur ? (
          <View className="flex-1">
            <Text className="font-medium">{`${utilisateur.nom} ${utilisateur.prenom}`}</Text>
            <Text className="font-medium text-muted-foreground">
              {utilisateur.telephone}
            </Text>
          </View>
        ) : null}
        {nbPlaceReserve ? (
          <View className="flex items-center px-3 bg-white rounded-lg">
            <Text className="font-semibold">{nbPlaceReserve}</Text>
          </View>
        ) : null}
      </View>
      <View className="flex flex-row items-center justify-center gap-4 mt-2">
        {status !== "PAID" ? (
          <Button
            variant="primary"
            disabled={loading}
            onPress={handleCompletePaiement}
          >
            Marquer comme payé
          </Button>
        ) : null}
        <Button variant="secondary" disabled={loading} onPress={onClose}>
          Fermer
        </Button>
      </View>
    </View>
  );
}

export function CheckinModal({ reservationId, onClose }: Props) {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [data, setData] = useState<TReservationCheckin | null>(null);

  useEffect(() => {
    if (reservationId && reservationId > 0) {
      checkinReservation();
    }
  }, [reservationId]);

  const checkinReservation = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${Envs.apiUrl}/reservations/${reservationId}/check-in`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        setData(null);
      } else {
        const result = await response.json();
        setData(result.data);
      }
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  const handleCompletePaiement = useCallback(async () => {
    setLoadingUpdate(true);

    try {
      const response = await fetch(
        `${Envs.apiUrl}/reservations/${reservationId}/complete-payment`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error();
      } else {
        onClose();
        Toast.show({
          type: "success",
          text2: "Le paiement a été effectué avec succès.",
          progressBarColor: "transparent",
          visibilityTime: 5000,
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text2: "Une erreur s'est produite lors de paiement.",
        progressBarColor: "transparent",
        visibilityTime: 5000,
      });
    } finally {
      setLoadingUpdate(false);
    }
  }, [reservationId]);

  return (
    <Modal
      visible={!!(reservationId && reservationId > 0)}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex items-center justify-center flex-1 w-full p-6 bg-neutral-900/20">
        <View
          className="relative w-full h-auto max-h-[80%] p-6 rounded-lg bg-white"
          style={{ height: "auto" }}
        >
          {loading && !data ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : !loading && !data ? (
            <ReservationInvalid onClose={onClose} />
          ) : (
            <ReservationStatus
              onClose={onClose}
              status={data?.paiement.statut as TPaymentStatus}
              handleCompletePaiement={handleCompletePaiement}
              nbPlaceReserve={data?.nombre_place_reserve}
              utilisateur={data?.utilisateur}
              loading={loadingUpdate}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
