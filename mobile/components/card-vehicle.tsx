import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

type Props = {
  text: string;
  isActive?: boolean;
  imageSrc?: ImageSourcePropType;
  className?: string;
  onPress?: () => void;
};

export function CardVehicle({
  text,
  imageSrc,
  isActive,
  className,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`
            w-24 h-24 p-2 border rounded-lg overflow-hidden
            ${
              isActive
                ? "border-primary bg-primary/5"
                : "bg-neutral-100 border-transparent"
            }
            ${className}
          `}
      >
        {imageSrc ? (
          <Image
            source={imageSrc}
            resizeMode="contain"
            className="flex-1 w-full"
          />
        ) : null}
        <Text className="text-sm font-medium text-center line-clamp-1">
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
