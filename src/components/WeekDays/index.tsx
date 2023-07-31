import { TouchableOpacity } from "react-native-gesture-handler"
import { Text } from "react-native"
import React, {useEffect, useState} from 'react'

interface IWeekDay {
  localeDayInitial: string
  day: string
  onClick: (isClicked: boolean) => void
  active: boolean
}

export default function WeekDays({localeDayInitial, day, onClick, active}: IWeekDay) {
  const [isClicked, setIsClicked] = useState(false)
  const handleClick = () => {
    setIsClicked(!isClicked)
    onClick(!isClicked)
  }

  useEffect(() => {
    setIsClicked(active)
  }, [active])

    return (
      <TouchableOpacity
        className={`flex flex-col justify-center items-center p-[12px] rounded-[10px] ${isClicked ? "bg-[#FF6112]" : ""}`}
        onPress={handleClick}>
        <Text className={`text-[12px] font-medium ${isClicked ? "text-white" : "text-[#BCC1CD]"}`}>{localeDayInitial}</Text>
        <Text className={`font-semibold text-[16px] ${isClicked ? "text-white" : "text-[#808080]"}`}>{day}</Text>
      </TouchableOpacity>
    )
}