import React from 'react'
import { View, Text, Image } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { useGetHistoricReserveOn } from '../../hooks/useHistoricReserveOn';
import { format, parseISO } from 'date-fns';
import { HOST_API } from '@env';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { useGetMenuUser } from '../../hooks/useMenuUser';
import { useFocusEffect } from '@react-navigation/native';
import BottomBlackMenu from '../../components/BottomBlackMenu';

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


export default function InfoReserva({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'InfoReserva'>) {
    let user_id = route.params.userId

    const { data: dataUser, error: errorUser, loading: loadingUser } = useGetMenuUser(user_id)
    const { data, error, loading, refetch } = useGetHistoricReserveOn(user_id)

    const refreshData = () => {
        refetch();
    };

    useFocusEffect(
        React.useCallback(() => {
            refreshData();
        }, [])
    );


    return (
        <View className='h-full w-max bg-zinc-600 flex-1'>
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
                            source={{ uri: HOST_API + dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Div maior para carregar todos os itens inseridos do historico*/}
            <ScrollView>
                <View className='h-max w-max bg-zinc-600 flex-1'>
                    <View className='flex items-start w-max pl-3'>
                        <Text className='text-lg font-black text-white'>RESERVAS ATIVAS</Text>
                    </View>
                    {/* Div para carregar todas as informações do histórico*/}
                    <View className='w-screen h-max bg-zinc-900'>
                        {/* Div para inserção dos cards*/}
                        <View className='w-max h-max px-3'>
                            {
                                !error && !loading ?
                                    data?.usersPermissionsUser?.data?.attributes?.schedulings?.data.map((courtInfo) =>
                                        courtInfo?.attributes?.status ?
                                            <TouchableOpacity onPress={() => navigation.navigate('DescriptionReserve', { userId: user_id, scheduleId: courtInfo.id })}>
                                                <View className='flex-row items-start justify-start w-max h-max pt-2'>
                                                    <View>
                                                        <Image
                                                            source={{ uri: HOST_API + courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.photo?.data[0]?.attributes?.url }}
                                                            style={{ width: 138, height: 90 }}
                                                            borderRadius={5}
                                                        />
                                                    </View>
                                                    <View className='flex justify-start items-start h-max w-max pl-1'>
                                                        <View>
                                                            <Text className='font-black text-base text-orange-600'>{courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.fantasy_name}</Text>
                                                        </View>
                                                        <View>
                                                            <Text className='font-normal text-xs text-white'>{courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.name}</Text>
                                                        </View>
                                                        <View className='w-max h-5 flex-row pt-1'>
                                                            <View className='w-40 h-5 bg-green-500 flex-row justify-center items-center rounded-sm'>
                                                                <Text className='font-black text-xs text-white'>R${courtInfo?.attributes?.valuePayed.toString()}</Text>
                                                                <Text className='font-black text-xs text-white'> / </Text>
                                                                <Text className='font-black text-xs text-white'>R${`${Number(courtInfo?.attributes?.court_availability?.data?.attributes?.value!) + Number(courtInfo.attributes.serviceRate!)}`}</Text>
                                                            </View>
                                                            <Text className='font-black text-xs text-white pl-1'>%{Math.floor((Number(courtInfo?.attributes?.valuePayed) / (Number(courtInfo?.attributes?.court_availability?.data?.attributes?.value) + Number(courtInfo.attributes.serviceRate!))) * 100)}</Text>
                                                        </View>
                                                        <Text className='font-black text-xs text-white pt-1'>Reserva feita em {formatDateTime(courtInfo?.attributes?.createdAt.toString())}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            : null
                                    ) : null
                            }
                            <View className='flex items-start w-max pt-14'>
                                <Text className='text-lg font-black text-white'>RESERVAS FINALIZADAS</Text>
                            </View>
                            {
                                !error && !loading ? data?.usersPermissionsUser?.data?.attributes?.schedulings?.data.map((courtInfo) =>
                                    !courtInfo.attributes.status ?
                                        <TouchableOpacity onPress={() => navigation.navigate('DescriptionReserve', { userId: user_id, scheduleId: courtInfo.id })}>
                                            <View className='flex-row items-start justify-start w-max h-max pt-2'>
                                                <View>
                                                    <Image
                                                        source={{ uri: HOST_API + courtInfo?.attributes?.court_availability?.data?.attributes?.court?.data?.attributes?.photo?.data[0]?.attributes?.url }}
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
                                                            {courtInfo.attributes.payedStatus === "payed" ?
                                                                <Text className='font-normal text-xs text-white'>Finalizado </Text>
                                                                : courtInfo.attributes.payedStatus === "waiting"
                                                                    ? <Text className='font-normal text-xs text-white'>Em aberto </Text>
                                                                    : <Text className='font-normal text-xs text-white'>Cancelado </Text>
                                                            }
                                                        </View>

                                                        <View>
                                                            <Text className='font-black text-xs text-white'>R${courtInfo.attributes.court_availability.data.attributes.value.toString()}</Text>
                                                        </View>

                                                    </View>

                                                    <View>
                                                        <Text className='font-black text-xs text-white'>Ultima Reserva {formatDateTime(courtInfo?.attributes?.createdAt.toString())}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        : null
                                ) : null
                            }
                        </View>
                        <View className='h-[85px]'></View>
                    </View>
                </View>
            </ScrollView>
            <View className="absolute bottom-0 left-0 right-0">
                <BottomBlackMenu
                    screen="Historic"
                    userID={user_id}
                    userPhoto={dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url ? HOST_API + dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url : ''}
                    key={1}
                    isDisabled={true}
                    paddingTop={2}
                />
            </View>
        </View>
    )
}