import { View, Text, Image } from "react-native";

interface InfosPayment {
    username: string;
    photoCourt: string;
    valuePayed: number;
    courtName: string;
    photoUser: any;
    startsAt: string;
    endsAt: string
}

export default function CardPaymentHistoric(props: InfosPayment) {
    const endsAt = props.endsAt.split(":")
    const startsAt = props.startsAt.split(":")

    return (
        <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
            <View className="flex flex-row">
                <View className="relative">
                    <Image source={ props.photoUser ? {uri: props.photoUser} : require("../../assets/default-user-image.png") } className="h-16 w-16 rounded-full"></Image>
                    <Image source={{ uri: props.photoCourt }} className="h-8 w-8 absolute border-2 border-[#FF6112] mt-8 ml-10 rounded-md"></Image>
                </View>
                <View className="flex justify-center self-start ml-3">
                    <Text className="text-xl font-bold">{props.username}</Text>
                    <Text className="text-base">{props.courtName} - {parseFloat(endsAt[0]) - parseFloat(startsAt[0])}h{parseFloat(endsAt[1]) - parseFloat(startsAt[1])}m</Text>
                </View>
            </View>
            <View className="justify-center">
                <Text className="text-xl text-right text-green-600 font-bold">+R${props.valuePayed}</Text>
            </View>
        </View>
    )
}