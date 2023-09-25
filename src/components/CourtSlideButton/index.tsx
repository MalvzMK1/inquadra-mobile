import { View, Switch, Text } from "react-native"
import React, { useState, useEffect } from 'react'

type CourtSlideButtonT = {
    name: string
    onClick: (isClicked: boolean) => void
    active: boolean
}

export default function CourtSlideButton(props: CourtSlideButtonT) {
    const [isClicked, setIsClicked] = useState(false)
    const handleClick = () => {
        setIsClicked(!isClicked)
        props.onClick(!isClicked)
    }

    useEffect(() => {
        setIsClicked(props.active)
    }, [props.active])
    return (
        <View className="flex flex-row justify-center items-center">
            <Switch
                onValueChange={handleClick}
                value={isClicked}
            />
            <Text className="font-normal text-[12px] text-[#959595]">{props.name}</Text>
        </View>
    )
}