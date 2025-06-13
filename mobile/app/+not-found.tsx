import { Link, Stack } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView className="flex-1 text-center justify-center p-20">
        <ThemedText type="title">Cet écran n'existe pas.</ThemedText>
        <Link href="/" className="mt-14 py-14">
          <ThemedText type="link">Retour à l'écran d'accueil!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
