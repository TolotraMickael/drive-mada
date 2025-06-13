import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/lib/colors";

type Props = {
  title?: string;
  onGoBack?: () => void;
};

export function AppHeader({ title, onGoBack }: Props) {
  return (
    <View className="flex flex-row items-center fixed w-full gap-4 px-6 pb-6 bg-background">
      {onGoBack ? (
        <TouchableOpacity
          onPress={onGoBack}
          className="flex items-center justify-center w-12 h-12 border border-neutral-300 bg-secondary rounded-lg"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      ) : null}
      {title ? <Text className="text-3xl font-heading">{title}</Text> : null}
    </View>
  );
}
