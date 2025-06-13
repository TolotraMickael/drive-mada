import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";

import { Styles } from "@/lib/helper";
import { Colors } from "@/lib/colors";
// import { Fonts } from "@/lib/fonts";

export function SearchInput(props: any) {
  return (
    <View style={styles.inputContainer}>
      <RNTextInput
        style={styles.textInput}
        placeholderTextColor={Colors.searchInputPlaceholderText}
        {...props}
      />
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="search-outline" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    height: Styles.inputHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: Styles.inputHeight,
    borderTopRightRadius: Styles.borderRadius,
    borderBottomRightRadius: Styles.borderRadius,
    backgroundColor: Colors.searchInputBg,
  },
  textInput: {
    flex: 1,
    borderStyle: "solid",
    color: Colors.primaryText,
    // fontFamily: Fonts.Regular,
    paddingHorizontal: 14,
    fontSize: 13,
    height: Styles.inputHeight,
    borderTopLeftRadius: Styles.borderRadius,
    borderBottomLeftRadius: Styles.borderRadius,
    backgroundColor: Colors.searchInputBg,
  },
});
