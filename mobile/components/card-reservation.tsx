import { Link, LinkProps } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CarFrontIcon } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/lib/colors";
import { Images } from "@/lib/images";
import { formatDateTime } from "@/lib/date";

type Props = {
  href: LinkProps["href"];
  className?: string;
  depart: string;
  destination: string;
  dateDepart: string;
  nbPlaceReserve: number;
  montant: number;
};

export function CardReservation({
  href,
  className,
  depart,
  destination,
  dateDepart,
  nbPlaceReserve,
  montant,
}: Props) {
  return (
    <Link href={href} className={className} asChild>
      <TouchableOpacity>
        <View className="flex flex-row justify-between flex-1 p-6 bg-white rounded-lg">
          <View className="flex-row justify-between">
            <View className="flex-row justify-between h-fit">
              <View className="flex flex-col items-center gap-2">
                <Ionicons name="map" size={18} color={Colors.secondary} />
                <Text className="flex-1 border-l border-dashed ml-[4px] border-primary "></Text>
                <Ionicons name="location" size={18} color={Colors.primary} />
              </View>
              <View className="flex flex-col justify-between ml-2">
                <View className="flex flex-col">
                  <Text className="text-base font-medium">{depart}</Text>
                  <Text className="text-sm font-regular text-neutral-500">
                    {formatDateTime(dateDepart)}
                  </Text>
                </View>
                <Text className="text-base font-medium">{destination}</Text>
              </View>
            </View>
          </View>
          <View className="flex-col items-end justify-between gap-4">
            <View className="w-20 h-16 rounded-full bg-neutral-50">
              <Image
                source={Images.Car}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
            <View className="flex flex-row items-center">
              <View className="flex flex-row items-center gap-2">
                <CarFrontIcon className="w-2 h-2" size={18} />
                <Text className="font-medium text-neutral-900">
                  {nbPlaceReserve}
                </Text>
              </View>
              <View className="h-4 mx-3 border-r border-neutral-300" />
              <Text className="font-medium text-neutral-900">Ar {montant}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
