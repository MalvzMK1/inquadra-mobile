import { View, Text } from "react-native"

type HeaderType = {
    title: string,
    subtitle: string
}

export function RegisterHeader(props: HeaderType) {
    return (
        <View className="h-[150px] w-full flex items-center justify-center flex-col">
				<Text className="text-4xl font-bold text-[#4e4e4e] mb-6">{props.title}</Text>
				<Text className="text-xl text-[#959595]">{props.subtitle}</Text>
		</View>
    )
}