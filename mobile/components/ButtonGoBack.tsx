import { StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Styles } from "@/lib/helper";
import { Colors } from "@/lib/colors";

export const ButtonGoBack = ({ navigation }: any) => {
  return (
    <TouchableOpacity
      style={styles.btnGoBack}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Ionicons name="arrow-back-outline" size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnGoBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: Styles.borderRadius,
    borderColor: Colors.borderColor,
  },
});
