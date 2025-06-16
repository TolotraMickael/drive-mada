import { StyleSheet, View, Image } from "react-native";
import { Colors } from "@/lib/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Avatar({ source, size = 38, style = {} }: any) {
  const url = source;
  return (
    <View>
      {source ? (
        <Image
          style={{ ...styles.image, width: size, height: size, ...style }}
          source={url}
        />
      ) : (
        <View
          style={{ ...styles.noImage, width: size, height: size, ...style }}
        >
          <Ionicons style={styles.iconUser} size={20} name="person-outline" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: `${Colors.white}9a`,
  },
  noImage: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: `${Colors.white}5a`,
    backgroundColor: `${Colors.borderColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  iconUser: {
    color: "white",
  },
});
