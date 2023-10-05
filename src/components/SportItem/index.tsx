import { Image, Text, View } from "react-native";

export default function SportItem(props: SportsCard) {
  return (
    <View className="justify-center items-center space-y-0.5 p-0.5 px-5 mt-1">
      <Image className="w-[30px] h-[30px]" source={props.image}></Image>
      <Text className="text-xs font-medium">{props.name}</Text>
    </View>
  );
}
