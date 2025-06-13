import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import "react-native-reanimated";

import "../global.css";
import { fonts } from "@/lib/fonts";
import { useAuthStore } from "@/store/auth-store";
import { SafeScreen } from "@/components/safe-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts(fonts);
  const router = useRouter();
  const segments = useSegments();
  const { token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      const isConnected = !!token;
      const inLoginOrRegister = segments.includes("(auth)" as never);

      if (isConnected && inLoginOrRegister) {
        router.replace("/(tabs)/(home)");
      } else if (!isConnected && !inLoginOrRegister) {
        router.replace("/(auth)");
      }
    }
  }, [token, segments, loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
