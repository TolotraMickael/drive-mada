import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
};

export function Heading({ title, subtitle }: Props) {
  return (
    <View className="flex items-center justify-center ">
      <Text className="text-4xl font-heading text-primary ml-2">{title}</Text>
      <Text className="mt-2 text-xl font-semibold text-foreground">
        {subtitle}
      </Text>
    </View>
  );
}
