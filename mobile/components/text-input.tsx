import {
  View,
  TextInputProps,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/lib/colors";

type Props = TextInputProps & {
  icon?: React.ReactNode;
  inputType?: "text" | "password";
  containerClassName?: string;
};

export function TextInput({
  icon,
  value,
  className,
  placeholder,
  keyboardType,
  containerClassName,
  inputType = "text",
  onChange,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex flex-row items-center w-full border h-12 rounded-lg bg-neutral-100
      ${isFocused ? "border-primary/40" : "border-transparent"}
    `}
    >
      {icon && (
        <View className="flex items-center justify-center w-12 h-12">
          {icon}
        </View>
      )}
      <RNTextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={inputType === "text" ? false : !visible}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ paddingVertical: 0 }}
        className={`
            flex-1 h-12 border-none pr-4 text-base bg-transparent font-regular text-foreground
            ${icon ? "pl-0" : "pl-4"}
          `}
        {...props}
      />
      {inputType === "password" && (
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          className="flex items-center justify-center w-12 h-12 mr-1"
        >
          <Ionicons
            size={24}
            color="#404040"
            name={visible ? "eye" : "eye-off"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
