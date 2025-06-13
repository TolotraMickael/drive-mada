import { Tabs } from "expo-router";
import { House, Map, TicketsPlane, UserRound } from "lucide-react-native";

import { Colors } from "@/lib/colors";
import { SafeScreen } from "@/components/safe-screen";

export default function AppLayout() {
  return (
    <SafeScreen>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: Colors.black,
            position: "absolute",
            bottom: 12,
            margin: 16,
            borderRadius: 14,
            overflow: "hidden",
            height: 64,
            paddingBottom: 0,
            paddingHorizontal: 6,
          },
          tabBarItemStyle: {
            flex: 1,
            padding: 12,
            margin: 0,
            justifyContent: "center",
            borderRadius: 12,
          },
        })}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarIcon: ({ color, size }) => (
              <House size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(ride)"
          options={{
            tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="reservation"
          options={{
            tabBarIcon: ({ color, size }) => (
              <TicketsPlane size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            tabBarIcon: ({ color, size }) => (
              <UserRound size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeScreen>
  );
}
