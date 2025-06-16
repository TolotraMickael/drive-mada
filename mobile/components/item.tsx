import { Text, View } from "react-native";

export function Item({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <View className={`flex flex-col gap-1 ${className}}`}>
      <Text className="text-sm text-neutral-400">{label}</Text>
      <Text className="text-lg font-semibold">{value}</Text>
    </View>
  );
}
