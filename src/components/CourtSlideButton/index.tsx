import { View, Switch, Text } from "react-native"
import React, { useState } from 'react'

type CourtSlideButtonT = {
    name: string
    allFalse?: () => void
}

export default function CourtSlideButton(props: CourtSlideButtonT) {
    const [isEnabled, setIsEnabled] = useState(false)
    return (
        <View className="flex flex-row justify-center items-center">
            <Switch
                onValueChange={() => {
                    setIsEnabled(!isEnabled)
                    props
                }}
                value={isEnabled}
            />
            <Text className="font-normal text-[12px] text-[#959595]">{props.name}</Text>
        </View>
    )
}