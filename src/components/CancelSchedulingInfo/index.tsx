import { View, Text } from "react-native"

type CancelSchedulingInfoT = {
    userName: string
    courtName: string
    courtType: string
    startsAt: string
    endsAt: string
    price: number
    payedStatus: boolean
}

export function CancelSchedulingInfo(props: CancelSchedulingInfoT) {
    let textContent: string
    props.payedStatus ? textContent = "Pago" : textContent = "Pendente"

    return (
        <View className="h-fit w-full bg-[#ccc6c6] pt-[15px] pl-[10px] rounded-[10px] mt-[10px]">
            <View className="flex flex-row mb-[10px]">
                <Text className="text-[#1E1E1E] text-[14px]">Reserva feita por: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">{props.userName}</Text>
            </View>

            <View className="flex flex-row mb-[10px]">
                <Text className="text-[#1E1E1E] text-[14px]">Quadra: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">{props.courtName}</Text>
            </View>

            <View className="flex flex-row mb-[10px]">
                <Text className="text-[#1E1E1E] text-[14px]">Tipo de quadra: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">{props.courtType}</Text>
            </View>

            <View className="flex flex-row mb-[10px]">
                <Text className="text-[#1E1E1E] text-[14px]">Horário reservado: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">{props.startsAt} - {props.endsAt}</Text>
            </View>

            <View className="flex flex-row mb-[10px]">
                <Text className="text-[#1E1E1E] text-[14px]">Valor da reserva: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">R$ {props.price}</Text>
            </View>
            <View className="flex flex-row mb-[15px]">
                <Text className="text-[#1E1E1E] text-[14px]">Status: </Text>
                <Text className="text-[#1E1E1E] text-[14px] font-bold">{textContent}</Text>
            </View>
        </View>
    )
}