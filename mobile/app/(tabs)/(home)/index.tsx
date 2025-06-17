import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  Image,
  Text,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

import { Envs } from "@/lib/config";
import { Colors } from "@/lib/colors";
import { Images } from "@/lib/images";
import { Avatars } from "@/lib/avatars";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { TItineraire } from "@/types/itineraire";
import { useAuthStore } from "@/store/auth-store";
import { TextInput } from "@/components/text-input";
import { CardVehicle } from "@/components/card-vehicle";
import { useVehiculeStore } from "@/store/vehicule.store";

export default function HomeScreen() {
  const { token, user } = useAuthStore();
  const [data, setData] = useState<TItineraire[]>([]);
  const { vehicules } = useVehiculeStore();
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    depart: "",
    destination: "",
    vehiculeType: vehicules[0]?.id_vehicule || 1,
  });

  useFocusEffect(
    useCallback(() => {
      getListItineraires();
    }, [])
  );

  const getListItineraires = useCallback(async (params?: string) => {
    setLoading(true);

    try {
      let url = `${Envs.apiUrl}/itineraires`;
      if (params) url += `?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Error", result.message);
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (filters.depart.trim()) {
      searchParams.append("depart", filters.depart);
    }
    if (filters.destination.trim()) {
      searchParams.append("destination", filters.destination);
    }
    if (filters.vehiculeType !== 1) {
      searchParams.append("id_vehicule", String(filters.vehiculeType));
    }

    const params = searchParams.toString();
    getListItineraires(params);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          <View className="flex flex-row items-center justify-between mb-6">
            <Text className="text-4xl font-heading text-foreground">
              Bienvenue !
            </Text>
            <Link href="/(tabs)/(profile)" asChild replace>
              <TouchableOpacity className="rounded-full">
                <Image
                  source={Avatars[user?.id_avatar || 0]}
                  resizeMode="contain"
                  className="border rounded-full w-14 h-14 border-primary"
                />
              </TouchableOpacity>
            </Link>
          </View>
          <View className="relative mb-8 overflow-hidden rounded-lg h-36 max-h-40 bg-secondary">
            <Image
              source={Images.Carpool}
              resizeMode="contain"
              className="absolute z-0 w-full h-52"
              style={{ top: -32 }}
            />
            <View className="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-40 p-8 bg-slate-950/50">
              <Text className="z-20 text-xl font-light text-center text-neutral-50">
                Trouvez rapidement une voiture qui correspond à vos préférences
                et à votre trajet.
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Text className="text-2xl font-heading">Trouvez des trajets</Text>
            <View className="flex-col flex-1 gap-4 p-4 mb-8 bg-white rounded-lg">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex flex-row items-center flex-1 gap-3 overflow-hidden">
                  {vehicules.map((vehicle) => (
                    <CardVehicle
                      key={vehicle.id_vehicule}
                      text={vehicle.nom}
                      imageSrc={Images.Car}
                      isActive={filters.vehiculeType === vehicle.id_vehicule}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          vehiculeType: vehicle.id_vehicule,
                        }))
                      }
                    />
                  ))}
                </View>
              </ScrollView>

              <TextInput
                placeholder="Lieu de départ"
                icon={
                  <Ionicons name="map" size={20} color={Colors.placeholder} />
                }
                value={filters.depart}
                onChangeText={(depart) =>
                  setFilters((prev) => ({ ...prev, depart }))
                }
              />
              <TextInput
                placeholder="Destination"
                icon={
                  <Ionicons name="location" size={20} color={Colors.primary} />
                }
                value={filters.destination}
                onChangeText={(destination) =>
                  setFilters((prev) => ({ ...prev, destination }))
                }
              />
              <Button containerClassName="flex-1" onPress={handleSearch}>
                Rechercher
              </Button>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Text className="text-2xl font-heading">
              Découvrez les plus récents
            </Text>
            {loading ? (
              <View className="flex items-center justify-center w-full h-32">
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <View className="flex flex-col gap-4">
                {data.map((itineraire) => (
                  <Card
                    key={itineraire.id_itineraire}
                    href={{
                      pathname: "/(tabs)/(home)/details/[id]",
                      params: { id: itineraire.id_itineraire },
                    }}
                    depart={itineraire.depart}
                    destination={itineraire.destination}
                    dateDepart={itineraire.date_depart}
                    frais={itineraire.prix}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
