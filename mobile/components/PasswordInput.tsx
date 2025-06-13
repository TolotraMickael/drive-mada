import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";

import { Styles } from "@/lib/helper";
import { Colors } from "@/lib/colors";
// import { Fonts } from "@/lib/fonts";

type FloatingPasswordInputProps = {
  label?: string;
} & TextInputProps;

export function PasswordInput({
  label,
  value,
  onChangeText,
  ...rest
}: FloatingPasswordInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const toggleHidden = () => setHidden(!hidden);

  const labelStyle = {
    position: "absolute" as const,
    left: 14,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [11, -10],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [13, 11],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.placeholder, Colors.primary],
    }),
    backgroundColor: "#f2f2f2",
    // fontFamily: Fonts.Medium,
    paddingHorizontal: 10,
    zIndex: 1,
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: isFocused || !!value ? Colors.success : Colors.border,
        },
      ]}
    >
      {label ? <Animated.Text style={labelStyle}>{label}</Animated.Text> : null}
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        placeholderTextColor={Colors.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
        onChange={() => setIsFocused(true)}
      />
      <TouchableOpacity onPress={toggleHidden} style={styles.iconWrapper}>
        <Icon
          style={styles.icon}
          size={20}
          name={hidden ? "eye-off-outline" : "eye-outline"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Styles.borderRadius,
    position: "relative",
    height: Styles.inputHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    color: Colors.primaryText,
    // fontFamily: Fonts.Regular,
    fontSize: 13,
    paddingVertical: 0,
    margin: 0,
    height: "100%",
  },
  iconWrapper: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  icon: {
    color: Colors.border,
  },
});
