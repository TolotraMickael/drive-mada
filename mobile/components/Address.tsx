import { StyleSheet, Text } from "react-native";

// import { Fonts } from "@/lib/fonts";

export function Address({ text }: any) {
  return <Text style={styles.address}>{text}</Text>;
}

const styles = StyleSheet.create({
  address: {
    fontSize: 14,
    lineHeight: 18,
    // fontFamily: Fonts.SemiBold,
  },
});
