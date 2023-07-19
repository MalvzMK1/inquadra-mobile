import { View, Text, Image, Dimensions, StyleSheet, ScrollView } from "react-native"
import { AntDesign } from '@expo/vector-icons'
import { useState } from 'react'
import { CourtCardInfo } from "../../types/CourtCardInfo"

export function CourtCard(props: CourtCardInfo) {
    const [starColor, setStarColor] = useState("white")
    return (
        <View className="flex flex-row items-center mt-[15px]">
            <Image source={props.image}></Image>

            <View className="ml-[15px]">
                <Text className="text-[#FF6112] text-[15px] leading-[24px]">{props.name}</Text>
                <Text className="text-[12px] leading[16px] font-normal">{props.type}</Text>
                <Text className="text-[12px] leading[16px] font-bold">Avaliação {props.rate} <AntDesign name="star" size={20} color={starColor} onPress={() => starColor == "white" ? setStarColor("orange") : setStarColor("white")} /> </Text>
                <Text className="text-[12px] leading[16px] font-bold mt-4">Tem horários disponíveis</Text>
            </View>
        </View>
    )
}