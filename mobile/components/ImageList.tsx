import { View, Text, TouchableOpacity } from "react-native";
import { AvatarImg } from "@/components/AvatarImg";

export function ImageList({ data, max }: any) {
  const list = data.slice(0, max);
  const otherList = data.length - max;
  const number = (otherList: any) =>
    otherList > 0 ? `+${data.length - max}` : "";

  return (
    <TouchableOpacity>
      <View className="flex-row align-center items-center">
        {list.map((user: any, index: any) => (
          <AvatarImg
            key={user.id}
            style={index !== 0 ? { marginLeft: -12 } : {}}
          />
        ))}
        {otherList > 0 && (
          <Text className="font-regular items-center ml-1 mt-1 text-xlg text-foreground">
            {number(otherList)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
