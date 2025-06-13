import { Text, TouchableOpacity } from "react-native";
import { Link, type LinkProps } from "expo-router";

export function TextLink({ href, className, children, ...props }: LinkProps) {
  return (
    <Link href={href} {...props} asChild>
      <TouchableOpacity>
        <Text className={`text-base font-regular text-foreground ${className}`}>
          {children}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}
