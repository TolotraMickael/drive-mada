import {
  Text,
  View,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Props = TouchableOpacityProps & {
  textClassName?: string;
  containerClassName?: string;
  variant?: "primary" | "secondary" | "outlined";
};

const buttonVariant = {
  container: {
    primary: "bg-primary border-none",
    secondary: "bg-neutral-300 border-none",
    outlined: "bg-transparent border border-primary",
  },
  text: {
    primary: "text-white",
    secondary: "text-neutral-800",
    outlined: "text-primary",
  },
};

export function Button({
  children,
  onPress,
  disabled,
  textClassName,
  variant = "primary",
  containerClassName,
  ...props
}: Props) {
  return (
    <View className="flex-row flex-1 h-12 max-h-12">
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`
          flex items-center justify-center px-6 py-2 h-12 rounded-lg disabled:opacity-40
          ${buttonVariant["container"][variant]}
          ${containerClassName}`}
        {...props}
      >
        <Text
          className={`
            font-semibold text-base text-center
            ${buttonVariant["text"][variant]}
            ${textClassName}`}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
