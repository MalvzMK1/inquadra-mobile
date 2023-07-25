import { TouchableOpacity } from "react-native-gesture-handler"
import { Text } from "react-native"
import React, { useState } from 'react'

type WeekDay = {
    dayInitial: string
    day: number
}

export default function WeekDays(props: WeekDay) {
    const [isClicked, setIsClicked] = useState(false);
    const handleClick = () => {
        setIsClicked(!isClicked)
    }
    return (
        <TouchableOpacity className={`flex flex-col justify-center items-center p-[12px] rounded-[10px] ${isClicked ? "bg-[#FF6112]" : ""}`}
            onPress={() => {
                handleClick()
            }}>
            <Text className={`text-[12px] font-medium ${isClicked ? "text-white" : "text-[#BCC1CD]"}`}>{props.dayInitial}</Text>
            <Text className={`font-semibold text-[16px] ${isClicked ? "text-white" : "text-[#808080]"}`}>{props.day}</Text>
        </TouchableOpacity>
    )
}