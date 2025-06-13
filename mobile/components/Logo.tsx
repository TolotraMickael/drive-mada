import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "../lib/colors";

export function Logo({ fontSize = 24, iconSize = 38 }) {
  return (
    <View style={styles.container}>
      <Ionicons name="car-sport" size={iconSize} style={{ top: -3 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize,
            color: Colors.primary,
          }}
        >
          Drive
        </Text>
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize,
          }}
        >
          Mada
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    position: "relative",
    gap: 6,
  },
});
