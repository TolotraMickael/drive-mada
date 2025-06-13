import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Text,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { Images } from "@/lib/images";
import { Button } from "@/components/button";
import { TextLink } from "@/components/text-link";
import { Heading } from "@/components/auth-heading";
import { TextInput } from "@/components/text-input";
import { FieldInput } from "@/components/field-input";
import { useAuthStore } from "@/store/auth-store";

export default function SigninScreen() {
  const { top } = useSafeAreaInsets();
  const { login } = useAuthStore();

  const [forms, setForms] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    await login(forms.email, forms.password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{ paddingTop: top }}
        className="items-center justify-center flex-1 bg-white"
      >
        <View className="items-center pt-6 flex-1 px-6 max-w-[420px]">
          <Image
            source={Images.Driver}
            resizeMode="contain"
            className="h-72 w-[420px]"
          />
          <Heading title="DriveMada" subtitle="Se connecter" />
          <View className="flex items-center justify-center gap-6 mt-14">
            <FieldInput label="Email">
              <TextInput
                placeholder="Adresse email"
                value={forms.email}
                onChangeText={(text) =>
                  setForms((forms) => ({ ...forms, email: text }))
                }
              />
            </FieldInput>
            <FieldInput label="Mot de passe">
              <TextInput
                placeholder="Mot de passe"
                inputType="password"
                value={forms.password}
                onChangeText={(text) =>
                  setForms((forms) => ({ ...forms, password: text }))
                }
              />
            </FieldInput>
            <Button containerClassName="flex-1 mt-2" onPress={handleLogin}>
              Se connecter
            </Button>
            <TextLink className="mt-6" href="/(auth)/register" replace>
              {`Vous n'avez pas de compte ? `}
              <Text className="font-medium text-primary">{`S'inscrire`}</Text>
            </TextLink>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
