import { View, Text} from "react-native";

interface infosCard {
    username: string;
    valuePayed: number
}

export default function CardDetailsPaymentHistoric(props: infosCard) {
    return (
        <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
            <View className="flex justify-center">
                <Text className="text-base">Valor recebido de: </Text>
                <Text className="text-xl font-bold">{props.username}</Text>
            </View>
            <View className="justify-center">
                <Text className="text-xl text-right text-green-600 font-bold">+R${props.valuePayed}</Text>
            </View>
        </View>
    )
}