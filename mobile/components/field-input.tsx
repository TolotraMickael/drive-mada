import { Text, View, ViewProps } from "react-native";

type Props = ViewProps & {
  label: string;
};

export function FieldInput({ label, children, className, ...props }: Props) {
  return (
    <View className={`flex w-full flex-col gap-1 ${className}`} {...props}>
      <Text className="text-base font-medium text-foreground">{label}</Text>
      {children}
    </View>
  );
}
