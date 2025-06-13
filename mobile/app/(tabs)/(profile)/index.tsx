import { useEffect, useState } from "react";
import { Link, LinkProps } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/lib/colors";
import { Avatars } from "@/lib/avatars";
import { useAuthStore } from "@/store/auth-store";
import { AppHeader } from "@/components/app-header";
import { User } from "@/types/user";
import { Envs } from "@/lib/config";

function MenuItem({ label, href }: { label: string; href: LinkProps["href"] }) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity>
        <View className="flex flex-row items-center justify-between px-6 py-4 bg-white rounded-lg">
          <Text className="text-base font-medium text-foreground">{label}</Text>
          <Ionicons size={20} name="chevron-forward" color={Colors.black} />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  // const [data, setData] = useState<User[]>([]);

  // useEffect(() => {
  //   getUserProfil();
  // });

  // const getUserProfil = async () => {
  //   try {
  //     const response = await fetch(`${Envs.apiUrl}/utilisateurs/profile`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       console.log("Erreur", result.message);
  //     } else {
  //       setData(result);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-background">
      <AppHeader title="Profil" />

      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 116 }}
      >
        <View className="flex flex-row items-center gap-6 p-6 bg-white rounded-lg">
          <Image
            source={Avatars[user?.id_avatar || 0]}
            className="w-20 h-20 rounded-full bg-background"
            resizeMode="contain"
          />
          {user && (
            <View className="flex-1">
              <Text className="text-2xl font-heading text-wrap line-clamp-2">
                {`${user.nom} ${user.prenom}`}
              </Text>
              <Text className="text-sm font-regular text-neutral-500">
                {user.email}
              </Text>
            </View>
          )}
        </View>

        <View className="flex flex-col gap-4 mt-8">
          <MenuItem href="/(tabs)/(profile)/account" label="Mon Compte" />
        </View>

        <TouchableOpacity
          className="flex flex-row items-center self-start gap-2 p-2 mt-8"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text className="text-base text-red-600 font-regular">
            Deconnexion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
