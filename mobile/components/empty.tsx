import { Images } from "@/lib/images";
import { PropsWithChildren } from "react";
import { Image, Text, View } from "react-native";

type Props = PropsWithChildren & {
  message?: string;
};

export function EmptyState({ message, children }: Props) {
  return (
    <View className="flex-col gap-6 min-h-[80%]">
      <View
        className="flex items-center align-center justify-center pb-52"
        style={{ minHeight: "100%" }}
      >
        <Image
          source={Images.Search}
          className="w-full h-64"
          resizeMode="contain"
        />
        <Text className="max-w-[280px] text-base text-center font-regular text-neutral-400">
          {message || " Aucune données à afficher"}
        </Text>
        {children}
      </View>
    </View>
  );
}
