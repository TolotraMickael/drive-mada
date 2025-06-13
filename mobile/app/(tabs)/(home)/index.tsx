import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { Colors } from "@/lib/colors";
import { Images } from "@/lib/images";
import { Avatars } from "@/lib/avatars";
import { Card } from "@/components/card";
import { vehicles } from "@/lib/vehicle";
import { Button } from "@/components/button";
import { TextInput } from "@/components/text-input";
import { CardVehicle } from "@/components/card-vehicle";
import { useAuthStore } from "@/store/auth-store";
import { TItineraire } from "@/types/itineraire";
import { Envs } from "@/lib/config";

export default function HomeScreen() {
  const { token, user } = useAuthStore();
  const [activeVehicle, setActiveVehicles] = useState(1);
  const [data, setData] = useState<TItineraire[]>([]);

  useEffect(() => {
    getListItineraires();
  }, []);

  const getListItineraires = async () => {
    try {
      const response = await fetch(`${Envs.apiUrl}/itineraires`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        console.log("Error", result.message);
      } else {
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 100 }}
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
                  {vehicles.map((vehicle) => (
                    <CardVehicle
                      key={vehicle.id}
                      text={vehicle.label}
                      imageSrc={Images.Car}
                      isActive={activeVehicle === vehicle.id}
                      onPress={() => setActiveVehicles(vehicle.id)}
                    />
                  ))}
                </View>
              </ScrollView>

              <TextInput
                placeholder="Lieu de départ"
                icon={
                  <Ionicons name="map" size={20} color={Colors.placeholder} />
                }
              />
              <TextInput
                placeholder="Destination"
                icon={
                  <Ionicons name="location" size={20} color={Colors.primary} />
                }
              />
              <Button containerClassName="flex-1">Rechercher</Button>
            </View>
          </View>
          <View className="flex flex-col gap-4">
            <Text className="text-2xl font-heading">
              Découvrez les plus récents
            </Text>
            <View className="flex flex-col gap-6">
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
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
