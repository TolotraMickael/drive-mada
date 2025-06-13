import { StyleSheet } from "react-native";
import { Link as ELink, LinkProps } from "expo-router";

// import { Fonts } from "@/lib/fonts";
import { Colors } from "@/lib/colors";

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <ELink href={href} style={styles.link} {...props}>
      {children}
    </ELink>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 13,
    // fontFamily: Fonts.Regular,
    color: Colors.primary,
    textAlign: "center",
  },
});
