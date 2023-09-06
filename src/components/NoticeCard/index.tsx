import { View, Text, Image } from "react-native"

export default function NoticeCard(props: {text: string}) {
    return (
        <View className="bg-white w-4/5 h-1/3 rounded-md absolute flex justify-center items-center z-20">
            <Text className="text-center font-bold text-sm mb-5">{props.text}</Text>
            <Image source={require("../../assets/orange_logo_inquadra.png")} />
        </View>
    );
}