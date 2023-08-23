import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

interface Props {
    userName: string,
    date: string,
    valuePayed: number,
}

export default function CardDetailsAmountReceivable(props: Props) {
    const date = props.date.split("-")
    
    return (
        <View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between p-2">
            <View className="flex items-center">
                <Text className="text-base">Valor recebido de:</Text>
                <Text className="text-xl font-bold">{props.userName}</Text>
            </View>
            <View className="flex items-center">
                <Text className="text-base">Data a debitar:</Text>
                <Text className="text-xl font-bold ml-1">{date[2]}/{date[1]}</Text>
            </View>
            <View className="flex justify-center items-center">
                <Text className="text-xl text-green-600 font-bold">+R${props.valuePayed}</Text>
            </View>
        </View>
    );
}
