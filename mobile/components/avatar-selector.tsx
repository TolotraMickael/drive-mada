import { AntDesign } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

import { Avatars } from "@/lib/avatars";

export function AvatarSelector({
  avatarId,
  handlePrev,
  handleNext,
}: {
  avatarId: number;
  handlePrev: () => void;
  handleNext: () => void;
}) {
  return (
    <View className="flex flex-row items-center gap-x-2">
      <TouchableOpacity onPress={handlePrev}>
        <AntDesign name="left" size={14} className="p-2" />
      </TouchableOpacity>
      <Image
        source={Avatars[avatarId]}
        resizeMode="contain"
        className="w-20 h-20 border rounded-full border-neutral-100"
      />
      <TouchableOpacity onPress={handleNext}>
        <AntDesign name="right" size={14} className="p-2" />
      </TouchableOpacity>
    </View>
  );
}
