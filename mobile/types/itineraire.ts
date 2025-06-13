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
};

export type ItineraryPayload = {
  vehiculeId: number;
  depart: string;
  destination: string;
  prix: string;
  nombrePlace: string;
  dateDepart: string;
};

export type TItineraryStatus = "WAITING" | "IN_PROGRESS" | "ARRIVED";
