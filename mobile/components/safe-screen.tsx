import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SafeScreen({ children }: PropsWithChildren) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top }} className="flex-1 bg-background">
      <StatusBar style="dark" />
      {children}
    </View>
  );
}
