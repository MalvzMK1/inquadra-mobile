import { View, Text, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useState } from "react";
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import { CancelSchedulingInfo } from "../../components/CancelSchedulingInfo";

export default function CancelScheduling() {
    const [cancelReason, setCancelReason] = useState("")
    const maxLength: number = 200

    const handleTextChange = (text: string) => text.length <= maxLength ? setCancelReason(text) : ""

    return (
        <View className="h-full w-full pl-[30px] pr-[30px] pt-[20px] justify-between">
            <View>

                <Text className="font-black text-[16px] text-[#292929]">Cancelamento de reserva</Text>
                <Text className="text-[14px] text-[#292929] opacity-50 underline mt-[20px]">Informações gerais:</Text>

                <CancelSchedulingInfo
                    userName="Lucas Santos"
                    courtName="Society 21"
                    courtType="Society"
                    startsAt="17:00h"
                    endsAt="18:00h"
                    price={70.00}
                    payedStatus={true}
                />

                <Text className="text-[14px] text-[#292929] opacity-50 underline mt-[20px]">Motivo do cancelamento:</Text>
                <Text className="text-[12px] text-[#292929] mt-[5px]">Informe o motivo do cancelamento para o cliente.</Text>

                <View className="h-[150px] rounded-[5px] border border-[#949494] flex flex-col justify-between pl-[8px] pr-[8px] pt-[5px] pb-[5px] mt-[10px]">
                    <TextInput
                        value={cancelReason}
                        onChangeText={handleTextChange}
                        placeholder="Digite aqui..."
                        textAlign="left"
                        textAlignVertical="top"
                        maxLength={maxLength}
                        multiline
                        className="h-[90%] items-start justify-start"
                    />
                    <View className="items-end justify-center">
                        <Text className="text-[12px] text-[#292929] opacity-50">{cancelReason.length}/{maxLength}</Text>
                    </View>
                </View>

                <Text className="text-[12px] text-[#292929] mt-[5px] text-start">Ao confirmar o cancelamento, o extorno financeiro será realizado automaticamente para o cliente.*</Text>

                <TouchableOpacity className="w-full h-[56px] bg-[#FF6112] items-center justify-center rounded-[5px] mt-[125px]">
                    <Text className="font-medium text-[16px] text-white">Cancelar reserva</Text>
                </TouchableOpacity>
            </View>

            <BottomNavigationBar
                establishmentScreen={true}
                playerScreen={false}
            />
        </View>
    )
}