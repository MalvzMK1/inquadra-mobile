import React from 'react'
import { View, Text, Image } from 'react-native';

import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function CourtDetails(){
    return(
        <View className='flex-1'>
        <ScrollView className='flex-grow'>
            <Text className='p-2 pt-6 text-2xl'>Detalhes Quadra</Text>
            <View className='bg-[#292929]'> 
            <View className='flex flex-row p-5'>            
                <Image source={require('../../../assets/quadra.png')} className="w-2/5"></Image>
                <View className='w-4/6 pr-5'>
                    <View className='flex flex-row'>
                        <Text className='text-[#FF6112] font-bold pl-2 pb-2 flex-grow'>Quadra Fenix</Text>
                        <Ionicons name="pencil" size={20} color="#FF6112"/>
                    </View>
                    <Text className='text-white font-bold pl-2'>Valor inicial: 250 reais</Text>
                    <Text className='text-white font-bold pl-2'>Locação de: Terça a Domingo</Text>
                    <Text className='text-white font-bold pl-2'>Day User: Habilitado</Text>
                    <Text className='text-white font-bold pl-2'>Horário: das 06:00 as 23:00</Text>
                </View>
            </View>  
            </View>
            <View className='bg-[#292929]'> 
            <View className='flex flex-row p-5'>            
                <Image source={require('../../../assets/quadra.png')} className="w-2/5"></Image>
                <View className='w-4/6 pr-5'>
                    <View className='flex flex-row'>
                        <Text className='text-[#FF6112] font-bold pl-2 pb-2 flex-grow'>Quadra Fenix</Text>
                        <Ionicons name="pencil" size={20} color="#FF6112"/>
                    </View>
                    <Text className='text-white font-bold pl-2'>Valor inicial: 250 reais</Text>
                    <Text className='text-white font-bold pl-2'>Locação de: Terça a Domingo</Text>
                    <Text className='text-white font-bold pl-2'>Day User: Habilitado</Text>
                    <Text className='text-white font-bold pl-2'>Horário: das 06:00 as 23:00</Text>
                </View>
            </View>  
            </View>
            <View className='bg-[#292929]'> 
            <View className='flex flex-row p-5'>            
                <Image source={require('../../../assets/quadra.png')} className="w-2/5"></Image>
                <View className='w-4/6 pr-5'>
                    <View className='flex flex-row'>
                        <Text className='text-[#FF6112] font-bold pl-2 pb-2 flex-grow'>Quadra Fenix</Text>
                        <Ionicons name="pencil" size={20} color="#FF6112"/>
                    </View>
                    <Text className='text-white font-bold pl-2'>Valor inicial: 250 reais</Text>
                    <Text className='text-white font-bold pl-2'>Locação de: Terça a Domingo</Text>
                    <Text className='text-white font-bold pl-2'>Day User: Habilitado</Text>
                    <Text className='text-white font-bold pl-2'>Horário: das 06:00 as 23:00</Text>
                </View>
            </View>  
            </View>
            
        </ScrollView>
        <View>
            <TouchableOpacity className='h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => navigation.navigate('')}>
                <Text className='text-gray-50'>Concluir</Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}