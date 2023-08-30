import { View, Text, TouchableOpacity } from "react-native"

type CourtAvailibility = {
    id: string
    startsAt: string
    endsAt: string
    price?: number
    busy: boolean
    selectedTimes: string[]
    toggleTimeSelection: Function
}

export default function CourtAvailibility(props: CourtAvailibility) {
    let status: string
    if (props.busy)
        status = "OCUPADO"
    else if (props.price)
        status = `R$${props.price.toFixed(2).replace('.', ',')}`
    return (
        props.busy ? (
            <View className={`flex flex-row h-fit w-full ${props.busy ? "" : "border"} rounded-[25px] p-[15px] mb-[5px] items-center justify-between ${props.busy ? "bg-[#D9D9D9]" : ""}`}>
                <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>{props.startsAt} - {props.endsAt}</Text>
                <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>OCUPADO</Text>
            </View>
        )
            :
            (
                <TouchableOpacity
                    className={`flex flex-row h-fit w-full ${props.busy ? "" : "border"} rounded-[25px] p-[15px] mb-[5px] items-center justify-between ${props.selectedTimes.includes(props.id) ? "bg-[#f3ffe4]" : ""} `}
                    onPress={() => props.toggleTimeSelection(props.id)}
                >
                    <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>{props.startsAt} - {props.endsAt}</Text>
                    <Text className={`font-black text-[15px] ${props.busy ? "text-[#808080]" : ""}`}>{status}</Text>
                </TouchableOpacity>
            )
    )
}