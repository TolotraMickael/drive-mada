import { Link, LinkProps } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/lib/colors";
import { Images } from "@/lib/images";
import { formatDateTime } from "@/lib/date";

type Props = {
  href: LinkProps["href"];
  className?: string;
  depart: string;
  destination: string;
  frais: number;
  dateDepart: string;
};
export function Card({
  href,
  className,
  depart,
  destination,
  frais,
  dateDepart,
}: Props) {
  return (
    <Link href={href} className={className} asChild>
      <TouchableOpacity>
        <View className="flex flex-row items-center pr-4 bg-white rounded-lg">
          <View className="flex-1 p-6">
            <View className="flex flex-row items-center gap-2">
              <Ionicons name="map" size={18} color={Colors.secondary} />
              <Text className="text-base font-medium">{depart}</Text>
            </View>
            <View className="flex flex-row items-center gap-1 py-1 pl-4 my-2 ml-3 border-l border-dashed">
              <Text className="text-sm font-regular text-neutral-500">
                {formatDateTime(dateDepart)}
              </Text>
              <Text className="px-1 text-neutral-300">|</Text>
              <Text className="text-sm font-medium text-neutral-950">
                Ar {frais}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <Ionicons name="location" size={18} color={Colors.primary} />
              <Text className="text-base font-medium">{destination}</Text>
            </View>
          </View>
          <View className="w-24 h-20 rounded-full bg-neutral-50">
            <Image
              source={Images.Car}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
