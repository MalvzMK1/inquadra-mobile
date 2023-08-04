import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

export default function AmountAvailableWithdrawal() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
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
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                        <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                        <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Lucas Santos</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row justify-between">
                    <View className="flex justify-center">
                    <Text className="text-base">Valor recebido de: </Text>
                        <Text className="text-xl font-bold">Alan Vieira</Text>
                    </View>
                    <View className="justify-center">
                        <Text className="text-xl text-right text-green-600 font-bold">+R$150,00</Text>
                    </View>
                    </View>
                    <View className="p-4 flex flex-row justify-center">
                        <Text className="text-lg">Isso é tudo!</Text>
                    </View>
                    <View className="p-3 items-center justify-center">
                        <TouchableOpacity className='w-52 h-12 rounded-md bg-[#FF6112] flex items-center justify-center'>
                            <Text className='text-gray-50 font-bold'>Sacar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
            </ScrollView>
        </View>
    );
}