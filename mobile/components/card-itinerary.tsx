import { Link, LinkProps } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { format } from "@/lib/date";
import { Colors } from "@/lib/colors";
import { Images } from "@/lib/images";

type Props = {
  href: LinkProps["href"];
  className?: string;
  depart: string;
  destination: string;
  frais: number;
  dateDepart: string;
  nombrePlace: number;
  placeDisponible?: number;
};

export function CardItinerary({
  href,
  className,
  depart,
  destination,
  frais,
  dateDepart,
  nombrePlace,
}: Props) {
  return (
    <Link href={href} className={className} asChild>
      <TouchableOpacity>
        <View className="flex p-6 flex-1 flex-row justify-between bg-white rounded-lg">
          <View className="flex-row justify-between">
            <View className="flex-row h-fit justify-between">
              <View className="flex flex-col items-center gap-2">
                <Ionicons name="map" size={18} color={Colors.secondary} />
                <Text className="flex-1 h-16 border-l border-dashed ml-[4px] border-primary "></Text>
                <Ionicons name="location" size={18} color={Colors.primary} />
              </View>
              <View className="flex flex-col justify-between ml-2">
                <View className="flex flex-col">
                  <Text className="text-base font-medium">{depart}</Text>
                  <Text className="text-sm font-regular text-neutral-500">
                    {format(dateDepart)}
                  </Text>
                  <Text className="text-sm font-heading text-neutral-950">
                    Ar {frais}
                  </Text>
                </View>
                <Text className="text-base font-medium">{destination}</Text>
              </View>
            </View>
          </View>
          <View className="flex-col justify-between gap-4 items-end">
            <Text className="text-neutral-950 text-sm font-medium">
              Total Place: {nombrePlace}
            </Text>
            <View className="w-20 h-16 rounded-full bg-neutral-50">
              <Image
                source={Images.Car}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
