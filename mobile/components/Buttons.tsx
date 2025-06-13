import React from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { Styles } from "@/lib/helper";
import { Colors } from "@/lib/colors";
// import { Fonts } from "@/lib/fonts";

type ButtonProps = React.PropsWithChildren & TouchableOpacityProps;

export const ButtonM = ({ children, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

export const ButtonS = ({ children, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.buttonS} {...props}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

export const ButtonL = ({ children, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.buttonL} {...props}>
      <Text style={{ color: Colors.error }}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Styles.borderRadius,
    height: Styles.inputHeight,
  },
  buttonText: {
    color: Colors.white,
    // fontFamily: Fonts.Medium,
    fontSize: 13,
  },
  buttonS: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Styles.borderRadius,
    height: Styles.inputHeight,
    width: "50%",
  },
  buttonL: {
    backgroundColor: `${Colors.error}1a`,
    borderRadius: Styles.borderRadius,
    padding: 8,
    paddingHorizontal: 20,
    color: Colors.error,
  },
});

{
  /* <TouchableOpacity
  style={{
    backgroundColor: `${Colors.error}1a`,
    borderRadius: Styles.borderRadius,
    padding: 8,
    paddingHorizontal: 20,
  }}
>
  <Text style={{ color: Colors.error }}>
    Créer un nouveau
  </Text>
</TouchableOpacity> */
}
