import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

export default function FinancialEstablishment() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    
    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor disponível para saque</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ 1.390,71</Text>
                            </View> 
                            <View className="p-3 items-center justify-center">
                            <TouchableOpacity className='h-10 w-40 rounded-md bg-[#FF6112] flex items-center justify-center'>
                                    <Text className='text-gray-50 font-bold'>Retirar</Text>
                            </TouchableOpacity>
                            </View>
                    </View>
                    <View className="bg-[#FF6112] h-7 rounded flex items-center justify-center">
                        <Text className="text-center h-4 underline">Ver detalhes</Text>
                    </View>
                    </View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor pago no crédito a receber</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ 3.783,00</Text>
                            </View> 
                    </View>
                    <View className="bg-[#FF6112] h-7 rounded flex items-center justify-center">
                        <Text className="text-center h-4 underline">Ver detalhes</Text>
                    </View>
                    <View className="pt-6 flex flex-row justify-between">
                        <Text className="text-lg font-bold">Valores recebidos</Text>
                        <Text className="text-lg font-bold underline text-[#FF6112]">Histórico</Text>
                    </View>
                    <View className="mt-2 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500 underline"> Hoje {formattedData}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-500 mt-1">Saldo recebido do dia: R$ 370,00</Text>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row">
                    <View className="relative">
                        <Image source={require('../../assets/picture.png')} className="h-16 w-16"></Image>
                        <Image source={require('../../assets/quadra.png')} className="h-8 w-8 absolute border-2 border-[#FF6112] mt-8 ml-10 rounded-md"></Image>
                    </View>
                    <View className="flex flex-row">
                        <Text>Lucas Santos</Text>
                    </View>
                    </View>

                </View>
                </View>
            </ScrollView>
        </View>
    );
}

