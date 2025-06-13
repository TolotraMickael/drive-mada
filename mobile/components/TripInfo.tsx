import { StyleSheet, View } from "react-native";

import { ImageList } from "@/components/ImageList";
import { Label } from "@/components/Label";
import { Places } from "@/components/Places";
import { Address } from "@/components/Address";
import { DateTime } from "@/components/DateTime";

// import { Colors } from "@/utils/colors";
// import { Fonts } from "@/utils/fonts";

const users = [
  { id: 1, imageUrl: "" },
  { id: 2, imageUrl: "" },
  { id: 3, imageUrl: "" },
  { id: 4, imageUrl: "" },
  { id: 5, imageUrl: "" },
  { id: 6, imageUrl: "" },
  { id: 7, imageUrl: "" },
  { id: 8, imageUrl: "" },
  { id: 9, imageUrl: "" },
  { id: 10, imageUrl: "" },
];

export function TripInfo() {
  return (
    <>
      <View style={styles.tripInfo}>
        <View style={styles.departure}>
          <Label text="Départ" />
          <Address text="TNR, 123 Antsobolo" />
          <DateTime text="05/02/2025 15:30" />
        </View>
        <View style={styles.destination}>
          <Label text="Destination" />
          <Address text="ANTS, 123 Antsobolo" />
        </View>
      </View>
      <View style={styles.summary}>
        <Places price="$ 24.99" availableSeat="3 seats available" />
        <ImageList data={users} max={3} />
        {/* <ButtonOutLine>Annuler</ButtonOutLine> */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tripInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    // backgroundColor: 'red',
  },
  departure: {},
  destination: {
    marginTop: "auto",
  },
  summary: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
