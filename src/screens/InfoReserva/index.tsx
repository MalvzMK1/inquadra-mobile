import React from 'react'
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { useGetHistoricReserveOn } from '../../hooks/useHistoricReserveOn';
import { format, parseISO } from 'date-fns';

function formatDateTime(dateTimeString: string): string {
    try {
        const parsedDateTime = parseISO(dateTimeString);
        const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
        const formattedTime = format(parsedDateTime, 'HH:mm');
        return `${formattedDate} as ${formattedTime}`;
      } catch (error) {
        console.error('Erro ao converter a data:', error);
        return 'Data inválida';
      }
  }

  function formatDate(dateTimeString: string): string {
    try {
        const parsedDateTime = parseISO(dateTimeString);
        const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
        return `${formattedDate}`;
      } catch (error) {
        console.error('Erro ao converter a data:', error);
        return 'Data inválida';
      }
  }


export default function InfoReserva() {
    const navigation = useNavigation()
    const user_id = '1'
   
    const {data, error, loading} = useGetHistoricReserveOn(user_id)

        
    return (
        <View className='h-full w-max bg-zinc-600'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('Login')}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='w-max flex item-center justify-center'>
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
            <View className='h-max w-max bg-zinc-600'>
                <ScrollView className='pt-10 h-max w-max'>
                    <View className='flex items-start w-max pl-3'>
                        <Text className='text-lg font-black text-white'>RESERVAS ATIVAS</Text>
                    </View>
                    {/* Div para carregar todas as informações do histórico*/}
                    <View className='w-screen h-screen bg-zinc-900'>
                        {/* Div para inserção dos cards*/}
                        <View className='w-max h-max px-3'>
                            {/* Div para criação dos cards de reservas ativas*/}
                            {
                            !error && !loading ? data?.usersPermissionsUser?.data?.attributes?.schedulings_owner?.data.map((courtInfo) =>  
                                courtInfo.attributes.status ?
                                <TouchableOpacity onPress={() => navigation.navigate('DescriptionReserve')}>
                                <View className='flex-row items-start justify-start w-max h-max pt-2'>
                                    <View>
                                        <Image
                                            source={{ uri: `http://192.168.0.229:1337${courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.photo?.data[0]?.attributes?.url}` }}
                                            style={{ width: 138, height: 90 }}
                                            borderRadius={5}
                                        />
                                    </View>
                                    <View className='flex justify-start items-start h-max w-max pl-1'>
                                        <View>
                                            <Text className='font-black text-base text-orange-600'>{courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.fantasy_name}</Text>
                                        </View>
                                        <View>
                                            <Text className='font-normal text-xs text-white'>{courtInfo?.attributes.court_availability?.data.attributes.court.data.attributes.name}</Text>
                                        </View>
                                        <View className='w-max h-5 flex-row pt-1'>
                                            <View className='w-40 h-5 bg-green-500 flex-row justify-center items-center rounded-sm'>                                               
                                                    <Text className='font-black text-xs text-white'>R${courtInfo.attributes.valuePayed}</Text>                                                              
                                                    <Text className='font-black text-xs text-white'> / </Text>                                 
                                                    <Text className='font-black text-xs text-white'>R${courtInfo.attributes.court_availability.data.attributes.value}</Text>
                                            </View>
                                                <Text className='font-black text-xs text-white pl-1'>%{Math.floor((courtInfo.attributes.valuePayed / courtInfo.attributes.court_availability.data.attributes.value) * 100)}</Text>                       
                                        </View>
                                            <Text className='font-black text-xs text-white pt-1'>Reserva feita em {formatDateTime(courtInfo?.attributes?.createdAt)}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null
                            ): null
                            }
                            {/* View de texto indicando das reservas finalizadas*/}
                            <View className='flex items-start w-max pt-14'>
                                <Text className='text-lg font-black text-white'>RESERVAS FINALIZADAS</Text>
                            </View>
                            {/* Div para criação dos cards de reservas FINALIZADAS*/}
                            {
                                !error && !loading ? data?.usersPermissionsUser?.data?.attributes?.schedulings_owner?.data.map((courtInfo)=>
                                    !courtInfo.attributes.status ?
                            <TouchableOpacity onPress={() => navigation.navigate('DescriptionReserve')}>
                                <View className='flex-row items-start justify-start w-max h-max pt-2'>

                                    <View>
                                        <Image
                                            source={{ uri: `http://192.168.0.229:1337${courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.photo?.data[0]?.attributes?.url}` }}
                                            style={{ width: 138, height: 90 }}
                                            borderRadius={5}
                                        />
                                    </View>

                                    <View className='h-max w-max pl-1'>

                                        <View>
                                            <Text className='font-black text-base text-orange-600'>{courtInfo.attributes.court_availability.data.attributes.court.data.attributes.fantasy_name}</Text>
                                        </View>

                                        <View>
                                            <Text className='font-normal text-xs text-white'>{courtInfo.attributes.court_availability.data.attributes.court.data.attributes.name}</Text>
                                        </View>

                                        <View className='w-max h-5 flex-row'>

                                            <View>
                                                <Text className='font-normal text-xs text-white'>Status: </Text>
                                            </View>

                                            <View>
                                                {courtInfo.attributes.payedStatus ?
                                                <Text className='font-normal text-xs text-white'>Finalizado </Text>
                                                : <Text className='font-normal text-xs text-white'>Em aberto </Text>
                                                }
                                            </View>

                                            <View>
                                                <Text className='font-black text-xs text-white'>R${courtInfo.attributes.court_availability.data.attributes.value}</Text>
                                            </View>

                                        </View>

                                            <View>
                                                <Text className='font-black text-xs text-white'>Ultima Reserva {formatDateTime(courtInfo?.attributes?.createdAt)}</Text>
                                            </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            : null
                            ): null
                            }
                        </View>              
                    </View>                            
                </ScrollView>
            </View>
        </View>
    )
}