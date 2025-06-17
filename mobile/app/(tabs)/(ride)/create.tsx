import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Toast } from "toastify-react-native";
import DatetimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import { Envs } from "@/lib/config";
import { Images } from "@/lib/images";
import { Button } from "@/components/button";
import { useAuthStore } from "@/store/auth-store";
import { AppHeader } from "@/components/app-header";
import { TextInput } from "@/components/text-input";
import { FieldInput } from "@/components/field-input";
import { ItineraryPayload } from "@/types/itineraire";
import { CardVehicle } from "@/components/card-vehicle";
import { useVehiculeStore } from "@/store/vehicule.store";
import { formatDateTime } from "@/lib/date";

export default function CreateRideScreen() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { vehicules } = useVehiculeStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const vehiculeTypes = useMemo(
    () => vehicules.filter((item) => item.id_vehicule !== 1),
    [vehicules]
  );

  const [data, setData] = useState<ItineraryPayload>({
    vehiculeId: vehiculeTypes[0]?.id_vehicule,
    depart: "",
    destination: "",
    prix: "",
    nombrePlace: "",
    dateDepart: new Date(),
  });

  const openDateTimePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        is24Hour: true,
        value: data.dateDepart,
        minimumDate: new Date(),
        onChange: (_, selectedDate) => {
          if (!selectedDate) return;

          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: "time",
            is24Hour: true,
            onChange: (_event, selectedTime) => {
              if (!selectedTime) return;
              const combined = new Date(selectedDate);
              combined.setHours(selectedTime.getHours());
              combined.setMinutes(selectedTime.getMinutes());
              setData((prev) => ({ ...prev, dateDepart: combined }));
            },
          });
        },
      });
    } else {
      setOpen(true);
    }
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setData((data) => ({ ...data, dateDepart: selectedDate }));
      setOpen(false);
    }
  };

  const handleSelectCar = (id: number) => {
    setData((state) => ({ ...state, vehiculeId: id }));
  };

  const handlCreateItinerary = async () => {
    setLoading(true);

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
          dateDepart: data.dateDepart.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const result = await response.json();
      if (result) {
        router.back();
        Toast.show({
          type: "success",
          progressBarColor: "transparent",
          text2: "Votre itineraire a été créé avec succès.",
          visibilityTime: 5000,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        progressBarColor: "transparent",
        text2: "Une erreur s'est produite lors de la création de l'itineraire.",
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
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
                {vehiculeTypes.map((vehicle) => (
                  <View
                    key={vehicle.id_vehicule}
                    style={{ width: `${100 / 3 - 3}%` }}
                  >
                    <CardVehicle
                      text={vehicle.nom}
                      imageSrc={Images.Car}
                      isActive={data.vehiculeId === vehicle.id_vehicule}
                      onPress={() => handleSelectCar(vehicle.id_vehicule)}
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
            <FieldInput label="Date de départ">
              <TouchableOpacity
                onPress={openDateTimePicker}
                className="flex flex-row items-center justify-start h-12 px-4 rounded-lg bg-background"
              >
                <Text className="w-full font-regular">
                  {formatDateTime(data.dateDepart.toISOString(), {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </Text>
              </TouchableOpacity>
              {Platform.OS === "ios" && open && (
                <DatetimePicker
                  mode="datetime"
                  display="default"
                  value={data.dateDepart}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  locale="fr-FR"
                />
              )}
            </FieldInput>
            <View className="mt-3">
              <Button
                containerClassName="flex-1"
                onPress={handlCreateItinerary}
                disabled={loading}
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
