import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";


interface infosCard {
    username: string;
    valuePayed: number
}

export default function CardDetailsPaymentHistoric() {
    return (
        <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
            <View className="flex-shrink-0">
                <MaterialIcons name="sync-alt" size={36} color="#FF6112" />
            </View>
            <View className="flex-1 pl-4">
                <Text className="text-base">Outras transferências</Text>
                <Text className="text-xl font-bold">Pix transf.</Text>
            </View>
            <View className="flex-shrink-0">
                <Text className="text-xl font-bold">-R$150,00</Text>
            </View>
        </View>
    )
}