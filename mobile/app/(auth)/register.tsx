import { useState } from "react";
import {
  Text,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { Button } from "@/components/button";
import { TextLink } from "@/components/text-link";
import { Heading } from "@/components/auth-heading";
import { TextInput } from "@/components/text-input";
import { FieldInput } from "@/components/field-input";
import { RegisterPayload } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterScreen() {
  const { register } = useAuthStore();

  const [forms, setForms] = useState<RegisterPayload>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleRegister = async () => {
    await register(forms);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ height: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center pt-16 flex-1 px-6 max-w-[420px]">
            <Heading title="DriveMada" subtitle="Créer un compte" />
            <View className="flex flex-1 items-center justify-start pt-20 gap-6">
              <FieldInput label="Nom">
                <TextInput
                  placeholder="Nom"
                  value={forms.firstName}
                  onChangeText={(text) => {
                    setForms((forms) => ({ ...forms, firstName: text }));
                  }}
                />
              </FieldInput>
              <FieldInput label="Prénoms">
                <TextInput
                  placeholder="Prénoms"
                  value={forms.lastName}
                  onChangeText={(text) => {
                    setForms((forms) => ({ ...forms, lastName: text }));
                  }}
                />
              </FieldInput>
              <FieldInput label="Email">
                <TextInput
                  placeholder="Adresse email"
                  value={forms.email}
                  onChangeText={(text) => {
                    setForms((forms) => ({ ...forms, email: text }));
                  }}
                />
              </FieldInput>
              <FieldInput label="Téléphone">
                <TextInput
                  placeholder="Téléphone"
                  value={forms.phoneNumber}
                  inputMode="tel"
                  onChangeText={(text) => {
                    setForms((forms) => ({ ...forms, phoneNumber: text }));
                  }}
                />
              </FieldInput>
              <FieldInput label="Mot de passe">
                <TextInput
                  placeholder="Mot de passe"
                  inputType="password"
                  value={forms.password}
                  onChangeText={(text) => {
                    setForms((forms) => ({ ...forms, password: text }));
                  }}
                />
              </FieldInput>
              <Button containerClassName="flex-1 mt-2" onPress={handleRegister}>
                Créer mon compte
              </Button>
              <TextLink className="mt-6" href="/(auth)" replace>
                {`Vous avez déjà un compte ? `}
                <Text className="font-medium text-primary">{`Se connecter`}</Text>
              </TextLink>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
