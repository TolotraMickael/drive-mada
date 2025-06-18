import { TPaymentStatus } from "@/types/paiement";

export type TItineraire = {
  date_creation: string;
  date_depart: string;
  date_mise_a_jour: string;
  depart: string;
  destination: string;
  id_itineraire: number;
  id_paiement: number | null;
  nombre_place: number;
  prix: number;
  statut: TItineraryStatus;
  utilisateur: {
    id_avatar: number | null;
    id_utilisateur: number;
    nom_utilisateur: string;
    prenom_utilisateur: string;
    telephone: string;
  };
  vehicule: {
    id_vehicule: number;
    nom_vehicule: string;
  };
  place_disponible?: number;
  reservations?: [
    {
      id_itineraire: number;
      id_reservation: number;
      nombre_place_reserve: number;
      utilisateur: {
        id: number;
        id_avatar: number;
        nom: string;
        prenom: string;
        telephone: string;
        statut: TPaymentStatus;
      };
    }
  ];
};

export type ItineraryPayload = {
  vehiculeId: number;
  depart: string;
  destination: string;
  prix: string;
  nombrePlace: string;
  dateDepart: Date;
};

export type TItineraryStatus = "WAITING" | "IN_PROGRESS" | "ARRIVED";
