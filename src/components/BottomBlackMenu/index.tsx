import { View, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import React, { useState } from 'react'

export default function BottomBlackMenu() {
    const [footerHeartColor, setFooterHeartColor] = useState("white")
    return (
        <View className="items-center">
            <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                <TouchableOpacity>
                    <AntDesign name="heart" size={20} color={footerHeartColor} onPress={() => footerHeartColor == "white" ? setFooterHeartColor("red") : setFooterHeartColor("white")} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Image source={require('../../assets/calendar_icon.png')}></Image>
                </TouchableOpacity>
            </View>
        </View>
    )
}