import { View, Text, Image, ScrollView } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNavigation, NavigationProp } from "@react-navigation/native"

type CourtSchedulingT = {
    name: string
    startsAt: string
    endsAt: string
    status: boolean
    id: string
    image: string
}

export default function CourtScheduling(props: CourtSchedulingT) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    let textContent: string

    if (props.status)
        textContent = "em andamento"
    else if (!props.status)
        textContent = "cancelada"
    else
        textContent = "finalizada"

    return (
        <View className="flex flex-row h-fit w-full bg-[#D9D9D9] rounded-[8px] mt-[4px] pt-[6px] pb-[6px] pl-[4px] pr-[7px] items-center justify-between">
            <View className="h-fit w-fit flex flex-row">
                <View className={`h-fit w-fit ${props.status ? "grayscale-0" : "grayscale"}`}>
                    <Image className={`h-[72px] w-[72px] rounded-[3px]`} source={{uri: props.image}}></Image>
                </View>

                <View className="ml-[8px] items-start justify-around">
                    <Text className="font-semibold text-[16px]">{props.name}</Text>
                    <Text className="text-[11px] text-[#707070]">Horário da reserva: {props.startsAt} às {props.endsAt}</Text>
                    <Text className="text-[11px] text-[#707070]">Status: Reserva {textContent}</Text>
                    <TouchableOpacity>
                        <Text className="font-bold text-[11px] text-[#808080]">Detalhes do pagamento</Text>
                    </TouchableOpacity>
                </View>
            </View>


            <TouchableOpacity
                className={`${props.status ? "bg-[#FF6112]" : "bg-button-dull-gray-color"} h-[35px] w-[65px] items-center justify-center rounded-[5px]`}
                onPress={() => {
                    props.status ? navigation.navigate("CancelScheduling", {
                        scheduleID: props.id
                    }) : ""
                }}>
                <Text className={`text-center font-bold text-[11px] text-white ${props.status ? "opacity-100" : "opacity-50"}`}>Cancelar reserva</Text>
            </TouchableOpacity>


        </View>
    )
}