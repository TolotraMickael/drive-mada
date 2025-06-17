import { useState } from "react";
import { useRouter } from "expo-router";
import { Toast } from "toastify-react-native";
import {
  Text,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { Avatars } from "@/lib/avatars";
import { Button } from "@/components/button";
import { AppHeader } from "@/components/app-header";
import { TextInput } from "@/components/text-input";
import { AvatarSelector } from "@/components/avatar-selector";
import { useAuthStore } from "@/store/auth-store";
import { Envs } from "@/lib/config";

export default function AccountScreen() {
  const router = useRouter();
  const { user, token, setUser } = useAuthStore();

  const [userData, setUserData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    id_avatar: user?.id_avatar || 0,
    email: user?.email || "",
  });

  const handleNext = () => {
    setUserData((state) => {
      if (state.id_avatar < Avatars.length - 1) {
        return { ...state, id_avatar: state.id_avatar + 1 };
      }
      return { ...state, id_avatar: 0 };
    });
  };

  const handlePrev = () => {
    setUserData((state) => {
      if (state.id_avatar === 0) {
        return { ...state, id_avatar: Avatars.length - 1 };
      }
      return { ...state, id_avatar: state.id_avatar - 1 };
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${Envs.apiUrl}/utilisateurs/${user?.id_utilisateur}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nom: userData.nom,
            prenom: userData.prenom,
            id_avatar: Number(userData.id_avatar),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.log("Error =>", result.message);
      } else {
        setUser({
          id_utilisateur: result.data.id_utilisateur,
          nom: result.data.nom,
          prenom: result.data.prenom,
          email: result.data.email,
          telephone: result.data.telephone,
          id_avatar: result.data.id_avatar,
        });
        Toast.show({
          type: "success",
          visibilityTime: 5000,
          progressBarColor: "transparent",
          text2: "Votre compte a été mis à jour avec succès.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-background">
        <AppHeader title="Mon Compte" onGoBack={() => router.back()} />

        <ScrollView
          className="flex-1 p-6 pt-1"
          contentContainerStyle={{ paddingBottom: 116 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex flex-col gap-4">
            <Text className="text-lg font-medium">
              Informations personnelles
            </Text>
            <View className="flex flex-col gap-4 p-6 bg-white rounded-lg">
              <AvatarSelector
                avatarId={userData.id_avatar}
                handleNext={handleNext}
                handlePrev={handlePrev}
              />
              <TextInput
                placeholder="Nom"
                value={userData.nom}
                onChangeText={(text) =>
                  setUserData((state) => ({
                    ...state,
                    nom: text,
                  }))
                }
              />
              <TextInput
                placeholder="Prénoms"
                value={userData.prenom}
                onChangeText={(text) =>
                  setUserData((state) => ({
                    ...state,
                    prenom: text,
                  }))
                }
              />
              <TextInput placeholder="Adresse email" value={userData.email} />
              <View className="w-1/2">
                <Button disabled={!user?.id_utilisateur} onPress={handleUpdate}>
                  Mettre à jour
                </Button>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-4 mt-6">
            <Text className="text-lg font-medium">Mot de passe</Text>
            <View className="flex flex-col gap-4 p-6 bg-white rounded-lg">
              <TextInput
                inputType="password"
                placeholder="Mot de passe actuel"
              />
              <TextInput
                inputType="password"
                placeholder="Nouveau mot de passe"
              />
              <TextInput
                inputType="password"
                placeholder="Confirmation mot de passe"
              />
              <View className="w-1/2">
                <Button disabled>Mettre à jour</Button>
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-4 mt-6">
            <Text className="text-lg font-medium">Suppression de compte</Text>
            <View className="flex flex-col gap-4 p-6 border border-red-500 rounded-lg">
              <Text className="text-sm font-regular text-neutral-500">
                En supprimant votre compte, toutes vos données liées à cette
                compte seront également supprimées.
              </Text>
              <Button variant="secondary" disabled>
                Supprimer mon compte
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
