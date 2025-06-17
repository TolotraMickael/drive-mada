import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Toast } from "toastify-react-native";
import {
  Text,
  View,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import { Envs } from "@/lib/config";
import { Colors } from "@/lib/colors";
import { getAuthToken } from "@/lib/token";
import { formatDateTime } from "@/lib/date";
import { Button } from "@/components/button";
import { TItineraire } from "@/types/itineraire";
import { TextInput } from "@/components/text-input";
import { FieldInput } from "@/components/field-input";

type Props = {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  data: TItineraire | null;
};

export function EditModal({
  open,
  onClose,
  refresh,
  data: itineraireData,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    vehiculeId: 0,
    depart: "",
    prix: "",
    destination: "",
    nombrePlace: "",
    dateDepart: new Date(),
  });

  useEffect(() => {
    setData(() => ({
      vehiculeId: itineraireData?.vehicule.id_vehicule || 1,
      depart: itineraireData?.depart || "",
      prix: String(itineraireData?.prix || ""),
      destination: itineraireData?.destination || "",
      nombrePlace: String(itineraireData?.nombre_place || ""),
      dateDepart: itineraireData?.date_depart
        ? new Date(itineraireData?.date_depart)
        : new Date(),
    }));
  }, [open, itineraireData]);

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
      setShow(true);
    }
  };

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setData((data) => ({ ...data, dateDepart: selectedDate }));
      setShow(false);
    }
  };

  const handleUpdate = async () => {
    if (!itineraireData?.id_itineraire) return;
    setLoading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(
        `${Envs.apiUrl}/itineraires/${itineraireData?.id_itineraire}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            depart: data.depart,
            destination: data.destination,
            prix: Number(data.prix),
            nombre_place: Number(data.nombrePlace),
            date_depart: data.dateDepart,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const result = await response.json();

      if (result) {
        refresh();
        Toast.show({
          type: "success",
          visibilityTime: 5000,
          text2: "L'itinéraire a été mis à jour.",
          progressBarColor: "transparent",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        visibilityTime: 5000,
        text2: "Une erreur s'est produite lors de la mise à jour",
        progressBarColor: "transparent",
      });
    } finally {
      setLoading(false);
    }
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
          className="relative w-full h-auto max-h-[80%] p-1 rounded-lg bg-white"
          style={{ height: "auto" }}
        >
          <View className="absolute z-20 flex items-center justify-center rounded-lg top-2 w-11 h-11 right-5">
            <TouchableOpacity disabled={loading} onPress={onClose}>
              <X size={20} color={Colors.icon} />
            </TouchableOpacity>
          </View>
          <ScrollView
            className="w-full h-auto p-5 mt-5"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          >
            <View className="flex flex-col gap-4">
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
                {Platform.OS === "ios" && show && (
                  <DateTimePicker
                    mode="datetime"
                    display="default"
                    value={data.dateDepart}
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </FieldInput>
            </View>
          </ScrollView>
          <View className="flex flex-row items-end justify-center w-full gap-4 my-4">
            <Button disabled={loading} onPress={handleUpdate}>
              Mettre à jour
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
