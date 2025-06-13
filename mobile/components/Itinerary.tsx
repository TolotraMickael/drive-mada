import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Colors } from "@/lib/colors";
import { Styles } from "@/lib/helper";
import { TripInfo } from "@/components/TripInfo";

export function Itinerary() {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.timeline}>
          <View style={styles.icon}>
            <Ionicons name="location-outline" size={18} />
          </View>
          <View style={styles.divider} />
          <View style={{ ...styles.icon, ...styles.destinationIcon }}>
            <Ionicons
              name="home-outline"
              size={18}
              style={styles.iconSuccess}
            />
          </View>
        </View>
        <TripInfo />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Styles.borderRadius,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 16,
    height: 170,
    gap: 8,
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: 44,
    alignItems: "center",
    // backgroundColor: 'blue',
    justifyContent: "space-between",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 100,
    backgroundColor: `${Colors.borderColor}5d`,
  },
  destinationIcon: {
    marginTop: "auto",
    backgroundColor: `${Colors.success}2a`,
  },
  iconSuccess: {
    color: Colors.success,
  },
  divider: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: `${Colors.success}6d`,
    borderStyle: "dashed",
    height: 45,
  },
});
