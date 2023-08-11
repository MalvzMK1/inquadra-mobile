import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

export default function DetailsAmountReceivable() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-2 flex flex-col justify-between">
                    <View className="pt-6 flex flex-row justify-between">
                        <Text className="text-lg font-bold">Valores disponíveis</Text>
                    </View>
                    <View className="mt-2 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500 underline"> Hoje {formattedData}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-500 mt-1">Saldo total disponível para saque: R$ 1.390,71</Text>
                    </View>
                    <View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>

                    <View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View><View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View><View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View><View className="bg-gray-200 mt-3 rounded-md flex flex-row justify-between pt-2 pb-2">
                    <View className="flex items-center">
                        <Text className="text-base">Valor recebido de:</Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="flex items-center">
                        <Text className="text-base">Data a debitar:</Text>
                        <Text className="text-xl font-bold ml-1">23/08</Text>
                    </View>
                    <View className="flex justify-center items-center">
                        <Text className="text-xl text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="p-4 flex flex-row justify-center">
                        <Text className="text-lg text-gray-500">Isso é tudo! </Text>
                        <View className="p-1">
                            <FontAwesome5 name="smile-beam" size={18} color="gray" />
                        </View>
                    </View>
                    <View className="p-3 items-center justify-center">
                        <TouchableOpacity className='w-5/6 h-12 rounded-md bg-[#FF6112] flex items-center justify-center'>
                            <Text className='text-gray-50 font-bold'>Sacar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </ScrollView>
        </View>
    );
}
