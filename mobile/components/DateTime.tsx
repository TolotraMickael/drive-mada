import { StyleSheet, Text } from "react-native";

// import { Fonts } from "@/lib/fonts";
import { Colors } from "@/lib/colors";

export function DateTime({ text }: any) {
  return <Text style={styles.dateTime}>{text}</Text>;
}

const styles = StyleSheet.create({
  dateTime: {
    fontSize: 12,
    // fontFamily: Fonts.Regular,
    color: Colors.black,
  },
});
