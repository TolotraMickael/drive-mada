import { useState } from "react";
import { X } from "lucide-react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal as RNModal,
} from "react-native";

import { Button } from "./button";
import { Colors } from "@/lib/colors";

export function Modal() {
  const [show, setShow] = useState(false);

  const handleCloseModal = () => {
    setShow(false);
  };

  return (
    <RNModal visible={show} animationType="slide" transparent={true}>
      <View className="flex-1 bg-neutral-900/20">
        <View
          className="relative rounded-t-3xl bg-background"
          style={{ height: "50%", marginTop: "auto" }}
        >
          <View className="absolute z-10 flex items-center justify-center w-12 h-12 top-2 right-3">
            <TouchableOpacity onPress={handleCloseModal}>
              <X color={Colors.icon} size={26} />
            </TouchableOpacity>
          </View>
          <ScrollView
            className="flex-1 px-6 pt-0 overflow-hidden overflow-y-auto mt-14"
            contentContainerStyle={{ paddingBottom: 64, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 mb-6">
              <Text>asd</Text>
            </View>
            <View className="mt-auto">
              <Button variant="secondary" containerClassName="flex-1">
                Passer à la réservation
              </Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
