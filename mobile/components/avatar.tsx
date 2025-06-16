import { Alert, Text, TouchableOpacity, View } from "react-native";

import { AvatarSelector } from "@/components/avatar-selector";
import { useAvatarSelector } from "@/hooks/use-avatar-selector";

export function Avatar() {
  const { avatarId, handleNext, handlePrev } = useAvatarSelector();

  return (
    <View>
      <AvatarSelector
        avatarId={avatarId}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
      <View className="mt-6">
        <TouchableOpacity
          className="flex items-center justify-center w-auto px-6 rounded-lg h-11 bg-primary"
          onPress={() => Alert.alert(`Selected avatar: ${avatarId}`)}
        >
          <Text className="font-semibold text-white">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
