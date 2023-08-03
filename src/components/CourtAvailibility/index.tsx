import { View, Text } from "react-native"

type CourtAvailibility = {
    startsAt: string
    endsAt: string
    price?: number
    busy: boolean
}

export default function CourtAvailibility(props: CourtAvailibility) {
    let test: string
    if(props.busy)
        test = "OCUPADO"
    else if (props.price)
        test = `R$${props.price.toFixed(2).replace('.', ',')}`
    return (
        <View className={`flex flex-row h-fit w-full ${props.busy ? "" : "border"} rounded-[25px] p-[15px] mb-[5px] items-center justify-between ${props.busy ? "bg-[#D9D9D9]" : ""}`}>
            <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>{props.startsAt} - {props.endsAt}</Text>
            <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>{test}</Text>
        </View>
    )
}