import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import storage from "../../utils/storage";
import { useEstablishmentSchedulingsByDay } from "../../hooks/useEstablishmentSchedulingsByDay";
import useUpdateScheduleActivateStatus from "../../hooks/useUpdateScheduleActivatedStatus";
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
const { parse, format } = require('date-fns');
import { HOST_API } from '@env'
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
import useAllCourtsEstablishment from "../../hooks/useAllCourtsEstablishment";
import { useGetUserIDByEstablishment } from "../../hooks/useUserByEstablishmentID";

export default function HomeEstablishment({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'HomeEstablishment'>) {
    const [selected, setSelected] = useState('');
    const [userId, setUserId] = useState<string>()

    useEffect(() => {
        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => {
            console.log(data)
            setUserId(data.userId)
        })
    }, [])

    const actualDate = new Date();
    const dateFormat = "yyyy-MM-dd";

    const targetDate = parse(format(actualDate, dateFormat), 'yyyy-MM-dd', new Date());

    const dayOfWeek = format(targetDate, 'EEEE');

    const { data: dataEstablishmentId, error: errorEstablishmentId, loading: loadingEstablishmentId } = useGetUserEstablishmentInfos(userId!)
    const establishment_id = '5'
    const [fantasy_name, setFantasyName] = useState('')
    const day_week = dayOfWeek
    const date = format(actualDate, dateFormat);

    const { data: dataSchedulings, error: errorSchedulings, loading: loadingSchedulings } = useEstablishmentSchedulingsByDay(establishment_id!, fantasy_name, day_week, date)
    const { data: dataCourtsEstablishment, error: errorCourts, loading: loadingCourts } = useAllCourtsEstablishment(establishment_id)
    const [updateActivatedStatus, { data: dataActivateStatus, error: errorActivateStatus, loading: loadingActivateStatus }] = useUpdateScheduleActivateStatus()

    const [selectedDate, setSelectedDate] = useState('');
    const [activationKey, setActivationKey] = useState('');
    const photo = dataEstablishmentId?.usersPermissionsUser.data.attributes.photo
    const username = dataEstablishmentId?.usersPermissionsUser?.data?.attributes?.username;
    const firstName = username ? username.split(' ')[0] : '';

    // 1 === true / 2 === false / 3 === null
    const [validated, setValidate] = useState(3);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;
    const getIdByKey = (key: string): string | undefined => {
        const schedulingFound = dataSchedulings?.establishment?.data?.attributes?.courts?.data?.flatMap((courts) =>
            courts?.attributes?.court_availabilities?.data?.flatMap((availabilities) =>
                availabilities?.attributes?.schedulings?.data?.filter((schedulings) =>
                    schedulings?.attributes?.activationKey === key
                )
            )
        )[0];

        if (schedulingFound) {
            return schedulingFound.id;
        }

        return undefined;
    };

    const handleActivate = async (key: string) => {
        let scheduleId: string = getIdByKey(key) ?? "";
        console.log(scheduleId)
        console.log(key)

        try {
            const { data } = await updateActivatedStatus({
                variables: {
                    schedulingId: scheduleId,
                    activate: true
                }
            });

            console.log(data);

            if (data) {
                if (!errorActivateStatus || !loadingActivateStatus) {
                    setValidate(1);
                } else {
                    setValidate(2);
                }
            }
        } catch (error) {
            if (errorActivateStatus?.graphQLErrors && errorActivateStatus.graphQLErrors[0] && errorActivateStatus.graphQLErrors[0].extensions && errorActivateStatus?.graphQLErrors[0]?.extensions?.exception === 400) {
                setValidate(2);
                setTimeout(() => {
                    setValidate(2);
                }, 100);
            } else {
                setValidate(2);
            }
        }
    };

    const handleDayUse = dataSchedulings?.establishment?.data?.attributes?.courts?.data?.some((court) =>
        court?.attributes?.court_availabilities?.data?.some((availability) =>
            availability?.attributes?.schedulings?.data?.some((scheduling) =>
                scheduling?.attributes?.court_availability?.data?.attributes?.dayUseService === true
            )
        )
    );


    return (
        <View className="flex-1">
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('InfoReserva', { userId: userId ?? "" })}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>Olá, {firstName}!</Text>
                </View>
                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-12 W-12' onPress={() => navigation.navigate('InfoProfileEstablishment', {userPhoto: dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== undefined || dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== null ? HOST_API + dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url :null})}>
                        <Image
                            source={{ uri: HOST_API + dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                <View className="p-5 flex flex-col justify-between">
                    <View className="bg-[#292929] border rounded-md p-5 h-40">
                        <Text className="text-[#FF6112] text-base font-bold">Código de ativação</Text>
                        <View className="items-center pt-5">
                            <TextInput
                                style={{
                                    backgroundColor: '#D9D9D9',
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderTopColor: '#ccc',
                                    borderLeftColor: '#ccc',
                                    borderRightColor: '#ccc',
                                    paddingHorizontal: 10,
                                    height: 40,
                                    width: '50%',
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                }}
                                placeholder="123"
                                value={activationKey}
                                onChangeText={setActivationKey}
                                keyboardType="default"
                                maxLength={4}
                            />
                        </View>
                    </View>
                    <View className="items-center">
                        <TouchableOpacity className='-mt-6 w-1/2 h-10 rounded-md bg-[#FF6112] flex items-center justify-center' onPress={() => handleActivate(activationKey)}>
                            {
                                validated === 1
                                    ? <Text className='text-xl font-bold text-green-500'>Validado</Text>
                                    : validated === 2
                                        ? <Text className='text-xl font-bold text-red-700'>Invalido</Text>
                                        : <Text className='text-xl font-bold text-gray-50'>Validar</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5 ">
                            <Text className="text-[#FF6112] text-base font-bold">Reservas hoje</Text>
                            <View className="pt-5 gap-2">
                                {
                                    handleDayUse === false
                                        ? dataSchedulings?.establishment?.data?.attributes?.courts?.data?.map((courts) =>
                                            courts?.attributes?.court_availabilities?.data?.map((availabilities) =>
                                                availabilities?.attributes?.schedulings?.data?.map((schedulings) =>
                                                    <Text className="text-white font-bold">{schedulings?.attributes?.court_availability?.data?.attributes?.startsAt?.substring(0, 5)} - {schedulings.attributes.court_availability.data.attributes.endsAt.substring(0, 5)} {schedulings.attributes.payedStatus === true && schedulings.attributes.activated === true ? "Reserva ativada" : schedulings.attributes.payedStatus === true ? "Pagamento realizado" : "Pagamento em andamento"}</Text>
                                                )
                                            )
                                        )
                                        : dataSchedulings?.establishment?.data?.attributes?.courts?.data?.map((courts) =>
                                            courts?.attributes?.court_availabilities?.data?.map((availabilities) =>
                                                availabilities?.attributes?.schedulings?.data?.map((schedulings) =>
                                                    <Text className="text-white font-bold">Day use - {schedulings.attributes.payedStatus === true && schedulings.attributes.activated === true ? "Reserva ativada" : schedulings.attributes.payedStatus === true ? "Pagamento realizado" : "Pagamento em andamento"}</Text>
                                                )
                                            )
                                        )
                                }
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#FF6112] h-7 rounded flex items-center justify-center" onPress={() => navigation.navigate('CourtSchedule', { establishmentPhoto: undefined })}>
                            <Text className="text-white text-center h-4">Ver detalhes</Text>
                        </TouchableOpacity>
                        <View className="pt-10">
                            <View className="flex flex-row">
                                <Text className="font-extrabold text-xl">Por quadra</Text>
                                <View className="ml-auto flex flex-col items-start">
                                    <SelectList
                                        setSelected={(val: any) => setFantasyName(val)}
                                        data={dataCourtsEstablishment?.establishment?.data?.attributes?.courts?.data.map((fantasy) => fantasy.attributes.fantasy_name) || []}
                                        save="value"
                                        searchPlaceholder="Pesquisar..."
                                        boxStyles={{ borderColor: "#FF6112", borderRadius: 4, height: 43, width: 160 }}
                                        dropdownTextStyles={{ color: "#FF6112" }}
                                        inputStyles={{ color: "#FF6112", alignSelf: "center" }}
                                        dropdownStyles={{ borderColor: "#FF6112", width: 160 }}
                                        closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                                        searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                                        arrowicon={<AntDesign name="down" size={13} color="#FF6112" style={{ marginEnd: 2, alignSelf: "center", marginLeft: 5 }} />}
                                    />
                                </View>
                            </View>
                        </View>
                        <View>
                        </View>
                        <View className="flex flex-row h-max w-max">
                            <View className="gap-4 pt-3 h-max w-max">
                                {
                                    handleDayUse === false
                                        ? <View className="before:absolute before:w-1 before:h-full before:bg-gray-300 before:content '' left-[60px]"></View>
                                        : null
                                }
                                {
                                    handleDayUse !== true ?
                                        dataSchedulings?.establishment.data.attributes.courts.data.map((courts) =>
                                            courts.attributes.court_availabilities.data.map((availabilities) => (
                                                <View className="flex flex-row" key={availabilities.id}>
                                                    <View className="flex justify-center items-center pr-3">
                                                        <Text className="text-base text-gray-400">{availabilities.attributes.startsAt.substring(0, 5)}hs</Text>
                                                    </View>
                                                    {availabilities.attributes.schedulings.data.length !== 0 ? (
                                                        availabilities.attributes.schedulings.data.map((scheduling) => (
                                                            <View className="min-h-20 h-auto bg-[#B6B6B633] rounded-2xl items-start" key={scheduling.id}>
                                                                <Text className="pl-10 pt-1 text-gray-400 text-xs text-start">Info reserva:</Text>
                                                                <View className="flex flex-row p-2">
                                                                    <View className="h-12 -mt-4 border-2 rounded border-orange-500"></View>
                                                                    <View className=" flex flex-row justify-between w-max pl-5">
                                                                        <View className="flex justify-start items-start">
                                                                            <View className="flex flex-row items-start">
                                                                                <Ionicons name="person-outline" size={16} color="#FF6112" className="pr-2" />
                                                                                <Text>{scheduling.attributes.owner.data.attributes.username}</Text>
                                                                            </View>
                                                                            <View className="flex flex-row items-start">
                                                                                <MaterialIcons name="attach-money" size={16} color="#FF6112" className="pr-2" />
                                                                                <Text className="">{scheduling.attributes.payedStatus ? 'Pago' : 'Pgt.parcial'}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <View className=" flex flex-wrap justify-start items-start pl-2">
                                                                            <View className="flex flex-row items-start">
                                                                                <Ionicons name="time-outline" size={16} color="#FF6112" className="pr-2" />
                                                                                <Text>{`${scheduling.attributes.court_availability.data.attributes.startsAt.substring(0, 5)} - ${scheduling.attributes.court_availability.data.attributes.endsAt.substring(0, 5)}`}</Text>
                                                                            </View>
                                                                            <View className="flex flex-row items-start">
                                                                                <Ionicons name="basketball-outline" size={16} color="#FF6112" className="pr-2" />
                                                                                <View className="flex flex-wrap">
                                                                                    <View className="flex flex-wrap">
                                                                                        {
                                                                                            scheduling.attributes.court_availability.data.attributes.court.data.attributes.court_types.data.map((sportType) =>
                                                                                                <Text>
                                                                                                    {sportType.attributes.name}
                                                                                                </Text>
                                                                                            )
                                                                                        }
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        ))
                                                    ) : (
                                                        <View className=" h-16 items-center justify-center">
                                                            <Text className="text-base text-gray-400">Livre</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            ))
                                        )
                                        : dataSchedulings?.establishment.data.attributes.courts.data.map((courts) =>
                                            courts.attributes.court_availabilities.data.map((availabilities) =>
                                                availabilities.attributes.schedulings.data.map((scheduling) =>
                                                    <View className="h-max w-80 flex flex-row justify-center items-center">
                                                        <View className="flex h-max w-max justify-center items-center">
                                                            <View className="flex flex-row items-start">
                                                                <Ionicons name="person-outline" size={16} color="#FF6112" className="pr-2" />
                                                                <Text>{scheduling.attributes.owner.data.attributes.username}</Text>
                                                            </View>
                                                            <View className="flex flex-row items-start">
                                                                <MaterialIcons name="attach-money" size={16} color="#FF6112" className="pr-2" />
                                                                <Text className="">{scheduling.attributes.payedStatus ? 'Pago' : 'Pgt.parcial'}</Text>
                                                            </View>
                                                            <View className="flex flex-row items-start">
                                                                <Ionicons name="time-outline" size={16} color="#FF6112" className="pr-2" />
                                                                <Text>{`Day use`}</Text>
                                                            </View>
                                                            <View className="flex items-center justify-center">
                                                                <Ionicons name="basketball-outline" size={16} color="#FF6112" className="pr-2" />
                                                                <View className="flex items-center justify-center">
                                                                    {
                                                                        scheduling.attributes.court_availability.data.attributes.court.data.attributes.court_types.data.map((sportType) =>
                                                                            <Text>
                                                                                {sportType.attributes.name}
                                                                            </Text>
                                                                        )
                                                                    }
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            )
                                        )
                                }
                            </View>
                        </View>
                    </View>
                </View>
                <View className="h-16"></View>
            </ScrollView>
            {
                userId ?
                    <View className={`absolute bottom-0 left-0 right-0`}>
                        <BottomBlackMenuEstablishment
                            screen="Home"
                            userID={route?.params.userID}
                            establishmentLogo={dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== undefined || dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== null ? HOST_API + dataSchedulings?.establishment?.data?.attributes?.logo?.data?.attributes?.url :null}
                            establishmentID={establishment_id}
                            key={1}
                            paddingTop={2}
                        />
                    </View>
                    :
                    null
            }
        </View>
    );
}


