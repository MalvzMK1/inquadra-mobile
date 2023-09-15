import ProgressBar from 'react-native-progress/Bar'
import React, { useState } from 'react'
import { View, Text, Image } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, IconButton } from 'react-native-paper';

export default function DescriptionInvited() {


    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View className='flex-1 bg-zinc-600'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>

                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('InfoReserva', { userId: "" })}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>


                <View className='flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>RESERVA</Text>
                </View>


                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-12 W-12 '>
                        <Image
                            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg' }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='h-6'></View>
            <View className='flex w-max h-96 bg-zinc-900  px-5'>
                <View className='flex-row items-start justify-start w-max h-max pt-2'>

                    <View>
                        <Image
                            source={{ uri: 'https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg' }}
                            style={{ width: 138, height: 90 }}
                            borderRadius={5}
                        />
                    </View>

                    <View className='flex item-start h-24 w-max'>

                        <View className='flex justify-start items-start h-max w-max pl-1'>

                            <View className='flex-row justify-between items-center w-48'>
                                <View className='flex items-center justify-center'>
                                    <Text className='font-black text-base text-orange-600'>Court Name</Text>
                                </View>

                                <View className='flex-row items-center'>
                                    <View>
                                        <Text className='font-normal text-xs text-orange-600'>Editar</Text>
                                    </View>

                                    <View className='flex items-center justify-center pl-4'>
                                        <TextInput.Icon icon={'pencil'} size={15} color={'#FF6112'} />
                                    </View>


                                </View>

                            </View>

                            <View>
                                <Text className='font-normal text-xs text-white'>Type Court</Text>
                            </View>


                            <View className='flex-row pt-2'>
                                <View>
                                    <Text className='font-black text-xs text-white'>Reserva feita em </Text>
                                </View>

                                <View>
                                    <Text className='font-black text-xs text-white'>00/00/00 </Text>
                                </View>

                                <View>
                                    <Text className='font-black text-xs text-white'>as </Text>
                                </View>

                                <View>
                                    <Text className='font-black text-xs text-white'>12:00 </Text>
                                </View>

                            </View>


                            <View className='pt-2'>
                                <Text className='font-black text-xs text-red-500'>CANCELAR</Text>
                            </View>


                        </View>

                    </View>


                </View>
                <View className='h-2'></View>
                <View>
                    <Text className='font-black text-xs text-white pb-1'>STATUS :</Text>
                </View>
                <View className='w-full'>
                    <View className='relative w-full justify-center'>
                        <Text className='absolute z-10 self-center text-white font-bold'>R$ 170.00 / R$ 200.00</Text>
                        <ProgressBar progress={80 / 100} width={null} height={30} borderRadius={5} color={'#0FA958'} unfilledColor={'#0FA95866'} />
                    </View>
                </View>
                <View className=' h-18 w-full flex items-center'>
                    <View className='w-60 pt-2 item-center'>
                        <Text className='font-black text-xs text-center text-white'>Tempo restante para pagamento 4 dias, 3 horas e 20 minutos</Text>
                    </View>
                </View>

                <View className='h-max w-full flex justify-center items-center pl-2'>
                    <TouchableOpacity className='pt-9 pb-5'>
                        <View className='w-64 h-10 bg-white rounded-sm flex-row items-center'>
                            <View className='w-1'></View>
                            <View className='h-5 w-5 items-center justify-center'>
                                <TextInput.Icon icon={'credit-card-plus-outline'} size={21} color={'#FF6112'} />
                            </View>
                            <View className='item-center justify-center'>
                                <Text className='font-black text-xs text-center text-gray-400 pl-1'>Adicionar Pagamento</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className='pb-2'>
                        <View className='h-10 w-64 rounded-md bg-orange-500 flex items-center justify-center'>
                            <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
            <View className='h-screen w-full  px-5 items-center justify-start pt-4'>
                <View>
                    <Text className='text-gray-50 font-black'>MEUS PAGAMENTOS:</Text>
                </View>

                <View className='w-full pt-5'>
                    <View className='h-14 w-30 rounded-md bg-white flex-row items-center justify-between'>
                        <Text className='text-black font-normal pl-4'>Jhon Silva</Text>
                        <Text className='text-black font-normal'>00/00/2023</Text>
                        <Text className='text-black font-normal pr-4'>R$35.00</Text>
                    </View>
                </View>
                <View className='pt-6'>
                    <Text className='text-gray-50 font-black'>HISTÓRICO DE PAGAMENTOS :</Text>
                </View>
                <View className='pt-3'>
                    <Text className='text-gray-50 font-semibold text-center'>Compartilhe essa página ! Informações serão mostradas aqui uma vez que outros realisem pagamentos </Text>
                </View>
            </View>
        </View>
    )
}