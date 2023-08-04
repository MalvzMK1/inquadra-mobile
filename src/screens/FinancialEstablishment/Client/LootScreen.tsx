import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Slider } from "react-native";

export default function LootScreen() {

    const [number, setNumber] = useState(680);

    const handleIncrement = () => {
        setNumber(prevNumber => prevNumber + 1);
    };

    const handleDecrement = () => {
        setNumber(prevNumber => prevNumber - 1);
    };

    const handleSliderChange = (value: any) => {
        setNumber(value);
    };

    return (
        <View className="flex-1">
            <ScrollView>
                <View className="flex-1">
                    <View className="p-4 flex flex-col">
                    <View className="p-5 flex flex-col justify-between">
                        <Text className="text-xl font-bold">Valor a retirar</Text>
                    </View>
                    <View className="p-3 items-center flex-row justify-center gap-5">
                    <TouchableOpacity className="bg-gray-300 w-1/12 rounded-md" onPress={handleDecrement}>
                        <Text className="text-3xl text-center text-gray-500">-</Text>
                    </TouchableOpacity>
                    <View>
                        <Text className="font-extrabold text-3xl">R$ {number.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity className="bg-gray-300 w-1/12 rounded-md" onPress={handleIncrement}>
                        <Text className="text-3xl text-center text-gray-500">+</Text>
                    </TouchableOpacity>
                   
                    </View>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={1}
                        maximumValue={1000000}
                        step={1}
                        value={number}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor="#EE4A24"
                        maximumTrackTintColor="gray" 
                    />
                    <View className="flex flex-row justify-center gap-2 mt-3">
                        <View className="p-4 flex-row bg-gray-300 rounded-lg">
                            <Text className="text-gray-400">R$ 50,00</Text>
                        </View> 
                        <View className="p-4 flex-row bg-gray-300 rounded-lg">
                            <Text className="text-gray-400">R$ 250,00</Text>
                        </View>
                        <View className="p-4 flex-row bg-gray-300 rounded-lg">
                            <Text className="text-gray-400">R$ 100,00</Text>
                        </View>
                        <View className="p-4 flex-row bg-gray-300 rounded-lg">
                            <Text className="text-gray-400">R$ 50,00</Text>
                        </View>
                    </View>
                    <View className="p-5 flex flex-col justify-between">
                        <Text className="text-xl font-bold">Selecione uma chave Pix</Text>
                        <View className="p-5 flex-row bg-gray-300 rounded-lg mt-5">
                        <Text className="font-bold text-xl">Chave pix: 523*********</Text>
                        </View>
                        <View className="p-5 flex-row bg-gray-300 rounded-lg mt-5">
                        <Text className="font-bold text-xl">Chave pix: 783*********</Text>
                        </View>
                    </View>
                </View>
                </View>
            </ScrollView>
            <View className="items-center justify-center flex flex-row gap-5 pb-16">
                <TouchableOpacity className=' w-40 h-14 rounded-md bg-gray-300 flex items-center justify-center'>
                    <Text className='font-bold text-gray-400'>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity className='w-40 h-14 rounded-md bg-[#FF6112] flex items-center justify-center'>
                    <Text className='text-gray-50 font-bold'>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
