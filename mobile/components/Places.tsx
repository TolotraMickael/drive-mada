import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

// import { Fonts } from "@/lib/fonts";
import { Colors } from "@/lib/colors";
import { Styles } from "@/lib/helper";

export function Places({ price, availableSeat }: any) {
  return (
    <View style={styles.seats}>
      <Text style={styles.priceSeat}>
        {price}
        <Text style={styles.text2}>/seat</Text>
      </Text>
      {/* <Text style={styles.statusPaye}>Payé</Text> */}
      <Text style={styles.text3}>{availableSeat}</Text>
    </View>
  );
}

type StyleType = {
  seats: ViewStyle;
  priceSeat: TextStyle;
  text2: TextStyle;
  text3: TextStyle;
  // statusPaye: ViewStyle;
};

const styles = StyleSheet.create<StyleType>({
  seats: {
    alignItems: "flex-end",
  },
  priceSeat: {
    color: Colors.primaryText,
    // fontFamily: Fonts.SemiBold,
    fontSize: 14,
  },
  text2: {
    fontSize: 11,
    // fontFamily: Fonts.Light,
  },
  text3: {
    fontSize: 11,
    lineHeight: 11,
    // fontFamily: Fonts.Regular,
  },
  // statusPaye: {
  //   width: 60,
  //   paddingVertical: 2,
  //   fontSize: 11,
  //   fontWeight: Fonts.Regular,
  //   backgroundColor: Colors.success,
  //   color: "white",
  //   textAlign: "center",
  //   borderRadius: Styles.borderRadius,
  //   marginBottom: 6,
  // },
});
