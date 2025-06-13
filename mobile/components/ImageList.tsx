import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { Colors } from "@/lib/colors";
// import { Fonts } from "@/lib/fonts";
// import { Avatar } from "@/components/Avatar";

export function ImageList({ data, max = 3 }: any) {
  const list = data.slice(0, max);

  const otherList = data.length - max;
  const number = (otherList: any) =>
    otherList > 0 ? `+${data.length - max}` : "";

  return (
    <TouchableOpacity>
      <View style={styles.listImages}>
        <Text style={styles.range}>{number(otherList)}</Text>
        {/* {list.map((user: any, index: any) => (
          <Avatar
            key={user.id}
            source={user.imageUrl}
            style={
              list.length - 1 !== index
                ? { right: -14 * (list.length - 1 - index) }
                : {}
            }
          />
        ))} */}
      </View>
    </TouchableOpacity>
  );
}

// list.length = 4

// (list.length - 1) - index

// index=0 => right * 3
// index=1 => right * 2
// index=2 => right * 1
// index=3 => list.length-1 === index

const styles = StyleSheet.create({
  listImages: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  range: {
    position: "absolute",
    top: 10,
    left: 8,
    zIndex: 100,
    color: Colors.secondaryText,
    fontFamily: Fonts.SemiBold,
    fontSize: 12,
  },
});
