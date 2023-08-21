import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";

export default function HistoryPayment() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    const dayOfWeekYesterday = weekdays[yesterday.getDay()];

    const dayYesterday = String(yesterday.getDate()).padStart(2, '0');
    const monthYesterday = String(yesterday.getMonth() + 1).padStart(2, '0');
    const formattedDataYesterday = `${dayYesterday}/${monthYesterday}`;
    
    // Subtrair 5 dias para obter a data de 5 dias atrás
    const fiveDaysAgo = new Date(currentDate);
    fiveDaysAgo.setDate(currentDate.getDate() - 5);
    
    // Obter o dia da semana correspondente a 5 dias atrás
    const dayOfWeekFiveDaysAgo = weekdays[fiveDaysAgo.getDay()];
    
    // Formatar a data de 5 dias atrás
    const dayFiveDaysAgo = String(fiveDaysAgo.getDate()).padStart(2, '0');
    const monthFiveDaysAgo = String(fiveDaysAgo.getMonth() + 1).padStart(2, '0');
    const formattedDataFiveDaysAgo = `${dayFiveDaysAgo}/${monthFiveDaysAgo}`;
    


    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                    <View className="pt-6 flex flex-row justify-between">
                        <Text className="text-lg font-bold">Saques realizados</Text>
                    </View>
                    <View className="mt-2 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500 underline"> Hoje {formattedData}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-500 mt-1">Saldo do dia: R$ 3.071,70</Text>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
                    </View>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
                    </View>
                    </View>
                    

                    <View className="mt-5 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500 underline"> {dayOfWeekYesterday} {formattedDataFiveDaysAgo}</Text>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
                    </View>
                    </View>
                    
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
                    </View>
                    </View>
                    <View className="mt-5 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500 underline"> {dayOfWeekFiveDaysAgo} {formattedDataYesterday}</Text>
                    </View>
                    <View className="bg-gray-200 mt-3 p-3 rounded-md flex flex-row items-center">
                    <View className="flex-shrink-0">
                        <MaterialIcons name="sync-alt" size={36} color="orange" />
                    </View>
                    <View className="flex-1 pl-4">
                        <Text className="text-base">Outras transferências</Text>
                        <Text className="text-xl font-bold">Pix transf.</Text>
                    </View>
                    <View className="flex-shrink-0">
                        <Text className="text-xl font-bold">-R$150,00</Text>
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
