import { TVehicules } from "./vehicules";
import { TUtilisateur } from "./utilisateur";

type TItineraire = {
  id_itineraire: number;
  depart: string;
  destination: string;
  statut: string;
  date_depart: string;
  nombre_place: number;
  prix: number;
};

type TPaiement = {
  id_paiement: number;
  statut: string;
  type: string;
};

export type TReservation = {
  id_reservation: number;
  date_creation: string;
  date_mise_a_jour: string;
  nombre_place_reserve: number;
  statut: string;
  paiement: TPaiement;
  itineraire: TItineraire;
  utilisateur: TUtilisateur;
  vehicule: TVehicules;
};

export type TReservationCheckin = {
  id_reservation: number;
  date_creation: string;
  date_mise_a_jour: string;
  nombre_place_reserve: number;
  statut: string;
  utilisateur: {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    telephone: string;
    id_avatar: number;
  };
  paiement: {
    id_paiement: number;
    type: string;
    statut: string;
  };
};

export type TReservationStatus = "RESERVED" | "CANCELLED";
