import React from 'react'
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';


export default function InfoReserva() {
    const navigation = useNavigation()
    return(
        <View className='h-screen w-screen bg-slate-500'>
            <View className=' h-11 w-max  bg-gray-900'></View>

            <View className=' h-16 w-max  bg-gray-900 flex-row item-center justify-between px-5'>

                <View className='h-max w-max flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('Login')}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'}/>
                    </TouchableOpacity>	
                </View>
                	

                <View className='h-max w-max  flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>HISTÓRICO DE RESERVAS</Text>
                </View>
                

                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-max w-max'>
                        <Image 
                            source={{ uri: 'https://i1.sndcdn.com/artworks-z2IyrLsaAE9AmeIg-3bUswQ-t500x500.jpg' }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Div maior para carregar todos os itens inseridos do historico*/}
            <View className='h-max pt-10 w-max'>

                <View className='flex items-start w-max pl-3'>
                    <Text className='text-lg font-black text-white'>RESERVAS ATIVAS</Text>
                </View>

                {/* Div para carregar todas as informações do histórico*/}
                <View className='w-screen h-screen bg-gray-800'>

                    {/* Div para inserção dos cards*/}
                    <View className='w-max h-max px-3'>

                        {/* Div para criação dos cards*/}
                        <View className='flex-row items-start justify-start w-max h-max'>

                            <View>
                                <Image 
                                source={{ uri: 'https://i1.sndcdn.com/artworks-z2IyrLsaAE9AmeIg-3bUswQ-t500x500.jpg' }}
                                style={{ width: 138, height: 90 }}
                                />
                            </View>

                            <View className='flex justify-start items-start h-max w-max'>

                                <View>
                                    <Text className='font-black text-base text-orange-600'>Court Name</Text>
                                </View>
                                
                                <View>
                                    <Text className='font-normal text-xs text-white'>Type Court</Text>
                                </View>

                                <View className='w-max h-5 flex-row'>

                                    <View className='w-44 h-5 bg-green-500 flex-row justify-center items-center rounded-sm'>
                                        <View>
                                            <Text className='font-black text-xs text-white'>R$170.00</Text>
                                        </View>
                                        <View>
                                            <Text className='font-black text-xs text-white'> / </Text>
                                        </View>
                                        <View>
                                            <Text className='font-black text-xs text-white'>R$200.00</Text>
                                        </View>      
                                    </View>

                                    <View>
                                        <Text className='font-black text-xs text-white'>80%</Text>
                                    </View>

                                </View>

                                <View className='flex-row'>
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


                            </View>

                        </View>

                    </View>
                </View>

            </View>

        </View>
    )

}