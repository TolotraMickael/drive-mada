import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Platform, ScrollView, KeyboardAvoidingView } from "react-native";

import { vehicles } from "@/lib/vehicle";
import { Button } from "@/components/button";
import { AppHeader } from "@/components/app-header";
import { TextInput } from "@/components/text-input";
import { FieldInput } from "@/components/field-input";
import { CardVehicle } from "@/components/card-vehicle";
import { ItineraryPayload } from "@/types/itineraire";
import { useAuthStore } from "@/store/auth-store";
import { Envs } from "@/lib/config";

export default function CreateRideScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  // const [selectedCar, setSelectedCard] = useState(2);

  const [data, setData] = useState<ItineraryPayload>({
    vehiculeId: 2,
    depart: "",
    destination: "",
    prix: "",
    nombrePlace: "",
    dateDepart: "2025-06-09 15:37:15",
  });

  const handleSelectCar = (id: number) => {
    setData((state) => ({ ...state, vehiculeId: id }));
  };

  const handlCreateItinerary = async () => {
    try {
      const apiUrl = `${Envs.apiUrl}/itineraires`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          prix: Number(data.prix),
          nombrePlace: Number(data.nombrePlace),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error =>", result.message);
      } else {
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Création de trajet" onGoBack={() => router.back()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 116 }}
        >
          <View className="flex flex-col gap-4 p-6 bg-white rounded-lg">
            <FieldInput label="Type de véhicule">
              <View className="flex flex-row flex-wrap gap-3 mt-1">
                {vehicles
                  .filter((item) => item.id !== 1)
                  .map((vehicle) => (
                    <View key={vehicle.id} style={{ width: `${100 / 3 - 3}%` }}>
                      <CardVehicle
                        text={vehicle.label}
                        imageSrc={vehicle.imageSrc}
                        isActive={data.vehiculeId === vehicle.id}
                        onPress={() => handleSelectCar(vehicle.id)}
                        className="w-full"
                      />
                    </View>
                  ))}
              </View>
            </FieldInput>
            <FieldInput label="Départ">
              <TextInput
                placeholder="1 Promenade Des Anglais"
                value={data.depart}
                onChangeText={(text) => {
                  setData((data) => ({ ...data, depart: text }));
                }}
              />
            </FieldInput>
            <FieldInput label="Destination">
              <TextInput
                placeholder="123 New Roads"
                value={data.destination}
                onChangeText={(text) => {
                  setData((data) => ({ ...data, destination: text }));
                }}
              />
            </FieldInput>
            <FieldInput label="Nombre de place">
              <TextInput
                placeholder="4"
                inputMode="numeric"
                keyboardType="numeric"
                value={data.nombrePlace}
                onChangeText={(text) => {
                  setData((data) => ({ ...data, nombrePlace: text }));
                }}
              />
            </FieldInput>
            <FieldInput label="Frais (par siège)">
              <TextInput
                placeholder="10.000"
                inputMode="numeric"
                keyboardType="numeric"
                value={data.prix}
                onChangeText={(text) => {
                  setData((data) => ({ ...data, prix: text }));
                }}
              />
            </FieldInput>
            <FieldInput label="Date de départ"></FieldInput>
            <View className="mt-3">
              <Button
                containerClassName="flex-1"
                onPress={handlCreateItinerary}
              >
                Créer et publier
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
