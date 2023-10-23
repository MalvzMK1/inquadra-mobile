import { View, Image, Text } from "react-native"

type ScheduleBlockDetailsT = {
    userName: string
    courtType: string
    startsAt: string
    endsAt: string
    payedStatus: string
}

export default function ScheduleBlockDetails(props: ScheduleBlockDetailsT) {
    return (
        <View className="flex flex-col mt-[25px]">
            <View className="flex flex-row gap-x-[8px] items-center mb-[8px]">
                <Image source={require('../../assets/orange_user_icon.png')}></Image>
                <Text className="-m-[5px] font-normal text-[14px]">Reserva feita por:</Text>
                <Text className="font-bold text-[14px]">{props.userName}</Text>
            </View>

            <View className="flex flex-row gap-x-[8px] items-center mb-[8px]">
                <Image source={require('../../assets/orange_ball_icon.png')}></Image>
                <Text className="-m-[5px] font-normal text-[14px]">Tipo de quadra: </Text>
                <Text className="font-bold text-[14px]">{props.courtType}</Text>
            </View>

            <View className="flex flex-row gap-x-[8px] items-center mb-[8px]">
                <Image source={require('../../assets/orange_clock_icon.png')}></Image>
                <Text className="-m-[5px] font-normal text-[14px]">Horário reservado: </Text>
                <Text className="font-bold text-[14px]">{props.startsAt} - {props.endsAt}</Text>
            </View>

            <View className="flex flex-row gap-x-[8px] items-center">
                <Image source={require('../../assets/orange_money_icon.png')}></Image>
                <Text className="-m-[5px] font-normal text-[14px]">Status de pagamento: </Text>
                {props.payedStatus === "payed" && (
                    <Text className="font-bold text-[14px]">Pago</Text>
                )}
                {props.payedStatus === "waiting" && (
                    <Text className="font-bold text-[14px]">Pendente</Text>
                )}
            </View>
        </View>
    )
}