import { View, Text, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

type AddCourtScheduleCard = {
    name: string
    startsAt?: string
    endsAt?: string
    isReserved: boolean
}

export default function AddCourtSchedule(props: AddCourtScheduleCard) {
    let viewContent: JSX.Element

    if(props.isReserved)
        viewContent = <Text className="font-normal text-black text-[12px]">{props.startsAt} - {props.endsAt}</Text>
    else
        viewContent = <Text className="font-normal text-black text-[12px]">Sem reservas prévias</Text>
    return (
        <View className="flex flex-row w-full h-fit bg-dull-gray-color rounded-[10px] items-center justify-between pl-[7px] pr-[7px] pt-[10px] pb-[10px] mb-[20px]">

            <View className="h-full flex flex-row items-center justify-center">
                <View className={`w-[4px] h-[55px] rounded-[5px] ${props.isReserved ? "bg-[#FF6112]" : "bg-[#4D4D4D]"} `} />

                <View className="items-start justify-evenly ml-[15px]">
                    <Text className="font-bold text-black text-[14px]">{props.name}</Text>
                    {viewContent}
                </View>
            </View>

            <TouchableOpacity>
                <Image source={require('../../assets/plus_icon.png')}></Image>
            </TouchableOpacity>
        </View>
    )
}