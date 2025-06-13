// import {
//   StyleSheet,
//   TextInput as RNTextInput,
//   TextInputProps,
// } from "react-native";

// import { Styles } from "@/utils/helper";
// import { Colors } from "@/utils/colors";
// import { Fonts } from "@/utils/fonts";

// export function TextInput(props: TextInputProps) {
//   return (
//     <RNTextInput
//       style={styles.textInput}
//       placeholderTextColor={Colors.placeholder}
//       {...props}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   textInput: {
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: Styles.borderRadius,
//     color: Colors.primaryText,
//     fontFamily: Fonts.Regular,
//     paddingHorizontal: 14,
//     fontSize: 13,
//     height: Styles.inputHeight,
//   },
// });

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from "react-native";

import { Styles } from "@/lib/helper";
import { Colors } from "@/lib/colors";
// import { Fonts } from "@/lib/fonts";

type FloatingLabelInputProps = {
  label?: string;
} & TextInputProps;

export function TextInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  ...rest
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

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
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.textInput}
        placeholderTextColor={Colors.placeholder}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Styles.borderRadius,
    position: "relative",
    // paddingTop: 18,
    // paddingBottom: 6,
    height: Styles.inputHeight,
    // justifyContent: "center",
  },
  textInput: {
    flex: 1,
    color: Colors.primaryText,
    // fontFamily: Fonts.Regular,
    fontSize: 13,
    paddingHorizontal: 14,
    padding: 0,
    margin: 0,
  },
});
