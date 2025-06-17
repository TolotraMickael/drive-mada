import { useEffect, useState } from "react";
import { CircleAlert, CircleCheckBig, CircleX } from "lucide-react-native";
import { Modal, Text, View, ActivityIndicator, Image } from "react-native";

import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { Button } from "@/components/button";
import { TPaymentStatus } from "@/types/paiement";
import { TUtilisateur } from "@/types/utilisateur";

type Props = {
  open: boolean;
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
  onClose,
  handleCompletePaiement,
}: {
  status: TPaymentStatus;
  utilisateur: TUtilisateur;
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
          <CircleAlert size={42} color={Colors.success} />
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

      <View className="flex flex-row w-full gap-2 p-4 rounded-xl bg-background">
        {utilisateur?.id_avatar !== undefined && (
          <Image
            source={Avatars[utilisateur.id_avatar]}
            className="bg-white border rounded-full w-14 h-14 border-neutral-300"
          />
        )}
        <View>
          <Text className="font-medium">{`${utilisateur.nom} ${utilisateur.prenom}`}</Text>
          <Text className="font-medium text-muted-foreground">
            {utilisateur.telephone}
          </Text>
        </View>
      </View>
      <View className="flex flex-row items-center justify-center gap-4 mt-2">
        {status !== "PAID" ? (
          <Button variant="primary" onPress={handleCompletePaiement}>
            Marquer comme payé
          </Button>
        ) : null}
        <Button variant="secondary" onPress={onClose}>
          Fermer
        </Button>
      </View>
    </View>
  );
}

export function CheckinModal({ open, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ status: TPaymentStatus } | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setData((prev) => ({ ...prev, status: "PAID" }));
    }, 5000);
  }, []);

  const handleCompletePaiement = () => {
    //
  };

  return (
    <Modal
      visible={open}
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
              status={data?.status as TPaymentStatus}
              handleCompletePaiement={handleCompletePaiement}
              utilisateur={{
                id_avatar: 0,
                id_utilisateur: 1,
                nom: "John",
                prenom: "Doe",
                telephone: "038",
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
