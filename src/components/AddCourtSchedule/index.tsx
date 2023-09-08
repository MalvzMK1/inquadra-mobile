import { View, Text, Image, Modal } from "react-native"
import React, { useState } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import ScheduleBlockDetails from "../ScheduleBlockDetails"
import { Button } from "react-native-paper";

type AddCourtScheduleCard = {
    name: string
    startsAt?: string
    endsAt?: string
    isReserved: boolean

    reservedBy: string
    courtType: string
    payedStatus: boolean
}

export default function AddCourtSchedule(props: AddCourtScheduleCard) {
    const [showDetails, setShowDetails] = useState(false)
    const closeShowDetails = () => setShowDetails(false)
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

            <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
                <Image source={require('../../assets/plus_icon.png')}></Image>
            </TouchableOpacity>

            <Modal visible={showDetails} animationType="fade" transparent={true} onRequestClose={closeShowDetails}>
                <View className="h-full w-full justify-center items-center">
                    <View className="h-[256px] w-[350px] bg-white rounded-[5px] items-center">
                        <Text className="font-bold text-[14px] mt-[30px]">DETALHES DA RESERVA</Text>

                        <ScheduleBlockDetails
                            userName={props.reservedBy}
                            courtType={props.courtType}
                            startsAt={props.startsAt}
                            endsAt={props.endsAt}
                            payedStatus={props.payedStatus}
                        />

                        <View className="w-full h-fit mt-[35px] mb-[20px] justify-center items-center pl-[40px] pr-[40px]">
                            <Button onPress={() => {
                                closeShowDetails()
                            }} className='h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center'>
                                <Text className="w-full h-full font-medium text-[16px] text-white">Fechar</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}