import { PropsWithChildren } from "react";
import { StyleSheet, Text } from "react-native";

// import { Fonts } from "@/lib/fonts";
import { Colors } from "@/lib/colors";

export function Label({ children }: any) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    // fontFamily: Fonts.Regular,
    color: Colors.secondaryText,
  },
});
