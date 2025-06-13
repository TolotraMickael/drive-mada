export type TReservation = {
  date_creation: string;
  date_mise_a_jour: string;
  id_reservation: number;
  statut: string;
  itineraire: {
    id_itineraire: number;
    depart: string;
    destination: string;
    statut: string;
    date_depart: string;
    nombre_place: number;
  };
  nombre_place_reserve: number;
  paiement: {
    id_paiement: number;
    statut: string;
    type: string;
  };
  utilisateur: {
    id_utilisateur: number;
  };
};

export type TReservationStatus = "RESERVED" | "CANCELLED";
