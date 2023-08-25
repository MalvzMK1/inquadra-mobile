import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import storage from "../../utils/storage";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";
import { useEstablishmentSchedulingsByDay } from "../../hooks/useEstablishmentSchedulingsByDay";
import useUpdateScheduleActivateStatus from "../../hooks/useUpdateScheduleActivatedStatus";
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { boolean } from "zod";

export default function HomeEstablishment({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'HomeEstablishment'>) {
    const [selected, setSelected] = useState('');
    const [userId, setUserId] = useState<string>()

    const establishment_id = '5'
    const fantasy_name = "Fenix Soccer"
    const day_week = "Wednesday"
    const date = "2023-12-14"

    const { data: dataSchedulings, error: errorSchedulings, loading: loadingSchedulings } = useEstablishmentSchedulingsByDay(establishment_id, fantasy_name, day_week, date)
    const [updateActivatedStatus, { data: dataActivateStatus, error: errorActivateStatus, loading: loadingActivateStatus }] = useUpdateScheduleActivateStatus()

    const [selectedDate, setSelectedDate] = useState('');
    const [activationKey, setActivationKey] = useState('');

    // 1 === true / 2 === false / 3 === null
    const [validated, setValidate] = useState(3);

    const CustomTimeView = ({ text }: { text: string }) => {
        return (
            <View className="flex flex-row h-10 items-center w-20 border-r-2 border-gray-300">
                <View>
                    <View>
                        <Text className="text-base font-extrabold text-gray-400 text-center mr-2">{text}</Text>
                    </View>
                </View>
            </View>
        );
    }
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;


    const dataCourts = [
        { key: '1', value: 'Quadra coberta 1', date: formattedData },
        {
            key: '2', value: 'Quadra Aberta', date: formattedData
        },
        {
            key: '3', value: 'Quadra do Zequinha', date: formattedData, time: ['00:00hs', '00:00hs', '00:00hs', '00:00hs', '00:00hs', '00:00hs', '00:00hs', '00:00hs', '00:00hs',]
        },
    ];

    useEffect(() => {
        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => {
            console.log(data)
            setUserId(data.userId)
        })
    }, [])

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
        let scheduleId: string = getIdByKey(key);
    
        try {
          const { data } = await updateActivatedStatus({
            variables: {
              activate: true,
              schedulingId: scheduleId
            }
          });
    
          if (data) {
            // A ativação foi bem-sucedida, você pode realizar as verificações necessárias aqui
            if (errorActivateStatus || loadingActivateStatus) {
              setValidate(1);
            } else {
              setValidate(2);
            }
          }
        } catch (error) {
          // Verifique se o erro contém informações de status HTTP
          if (errorActivateStatus.graphQLErrors && errorActivateStatus.graphQLErrors[0] && errorActivateStatus.graphQLErrors[0].extensions && errorActivateStatus.graphQLErrors[0].extensions.exception.status === 400) {
            setValidate(2); // Erro HTTP 400
          } else {
            setValidate(2); // Outros erros
          }
        }
      };

    return (
        <View className="flex-1">
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
                                    dataSchedulings?.establishment.data.attributes.courts.data.map((courts) =>
                                        courts.attributes.court_availabilities.data.map((availabilities) =>
                                            availabilities.attributes.schedulings.data.map((schedulings) =>
                                                <Text className="text-white font-bold">{schedulings.attributes.court_availability.data.attributes.startsAt.substring(0, 5)} - {schedulings.attributes.court_availability.data.attributes.endsAt.substring(0, 5)} {schedulings.attributes.payedStatus === true ? "Pagamento Realizado" : schedulings.attributes.activated === true ? "Reserva ativada" : "Em aberto"}</Text>
                                            )
                                        )
                                    )
                                }
                            </View>
                        </View>
                        <View className="bg-[#FF6112] h-7 rounded flex items-center justify-center">
                            <Text className="text-white text-center h-4">Ver detalhes</Text>
                        </View>
                        <View className="pt-10">
                            <View className="flex flex-row">
                                <Text className="font-extrabold text-xl">Por quadra</Text>
                                <View className="ml-auto flex flex-col items-start">
                                    <SelectList
                                        setSelected={(val) => setSelected(val)}
                                        data={dataCourts}
                                        save="value"
                                        searchPlaceholder="Pesquisar..."
                                        defaultOption={dataCourts.length > 0 ? dataCourts[0] : undefined}
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
                            <View className="-mt-2">
                                {dataCourts.map(item => {
                                    if (item.value === selected) {
                                        return (
                                            <View key={item.key}>
                                                <Text className="font-bold text-gray-500 text-base pb-3">{item.value}</Text>
                                                <Text className="text-base font-bold">{item.date}</Text>
                                            </View>
                                        );
                                    }
                                    return null;
                                })}
                            </View>
                        </View>
                        <View className="flex flex-row">
                            <View className="gap-4 pt-3">
                                <Text className="text-base text-gray-400">14:00hs</Text>
                                <Text className="text-base text-gray-400">15:00hs</Text>
                                <Text className="text-base text-gray-400">16:00hs</Text>
                                <Text className="text-base text-gray-400">17:00hs</Text>
                                <Text className="text-base text-gray-400">18:00hs</Text>
                                <Text className="text-base text-gray-400">19:00hs</Text>
                                <Text className="text-base text-gray-400">20:00hs</Text>
                                <Text className="text-base text-gray-400">21:00hs</Text>
                                <Text className="text-base text-gray-400">22:00hs</Text>
                                <Text className="text-base text-gray-400">23:00hs</Text>
                                <Text className="text-base text-gray-400">00:00hs</Text>
                            </View>
                            <View className="border border-gray-300 ml-2 mr-2"></View>
                            <View className="p-1">
                                <View className="h-17 bg-[#B6B6B633] rounded-2xl">
                                    <Text className="pl-10 pt-1 text-gray-400 text-xs">Info reserva:</Text>
                                    <View className="flex flex-row p-2">
                                        <View className="h-12 -mt-4 border-2 rounded border-orange-500"></View>
                                        <View className="flex">
                                            <View className="flex flex-row">
                                                <View className="flex flex-row ml-5">
                                                    <Ionicons name="person-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                    <Text> Lucas Santos</Text>
                                                </View>
                                                <View className="flex flex-row ml-6">
                                                    <Ionicons name="time-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                    <Text>14:00h - 15:00h</Text>
                                                </View>
                                            </View>
                                            <View className="flex flex-row">
                                                <View className="flex flex-row ml-5">
                                                    <MaterialIcons name="attach-money" size={16} color="#FF6112" />
                                                    <Text className="pl-2">Pago</Text>
                                                </View>
                                                <View className="flex flex-row ml-6 pl-12">
                                                    <Ionicons name="basketball-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                    <Text>Basquete</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View className="pt-4">
                                    <Text className="text-gray-400">Livre</Text>
                                </View>
                                <View className="pt-6">
                                    <Text className="text-gray-400">Livre</Text>
                                </View>
                                <View className="pt-6">
                                    <Text className="text-gray-400">Livre</Text>
                                </View>
                                <View className="pt-5">
                                    <Text className="text-gray-400">Livre</Text>
                                </View>
                                <View className="pt-6">
                                    <Text className="text-gray-400">Livre</Text>
                                </View>
                                <View className="pt-7">
                                    <View className="h-20 bg-[#B6B6B633] rounded-2xl">
                                        <Text className="pl-10 pt-1 text-gray-400 text-xs">Info reserva:</Text>
                                        <View className="flex flex-row p-2">
                                            <View className="h-14 -mt-4 border-2 rounded border-orange-500"></View>
                                            <View className="flex">
                                                <View className="flex flex-row">
                                                    <View className="flex flex-row ml-5">
                                                        <Ionicons name="person-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                        <Text> Lucas Santos</Text>
                                                    </View>
                                                    <View className="flex flex-row ml-6">
                                                        <Ionicons name="time-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                        <Text>21:00h - 23:00h</Text>
                                                    </View>
                                                </View>
                                                <View className="flex flex-row">
                                                    <View className="flex flex-row ml-5">
                                                        <MaterialIcons name="attach-money" size={16} color="#FF6112" />
                                                        <Text className="pl-2">Pago</Text>
                                                    </View>
                                                    <View className="flex flex-row ml-6 pl-12">
                                                        <Ionicons name="basketball-outline" size={16} color="#FF6112" style={{ marginRight: 6 }} />
                                                        <Text>Basquete</Text>
                                                    </View>
                                                </View>
                                                <View className="pt-12">
                                                    <Text className="text-gray-400">Livre</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </View>

                    </View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5 h-40">
                            <Text className="text-[#FF6112] text-base font-bold">Valor disponível</Text>
                            <View className="items-center pt-5">
                                <View className="items-center justify-center">
                                    <Text className="text-3xl text-white font-extrabold">2.650,95</Text>
                                </View>
                            </View>
                        </View>
                        <View className="bg-[#FF6112] h-7 rounded -mt-5">
                        </View>
                        <View className="items-center">
                            <TouchableOpacity className='-mt-11 w-1/2 h-10 rounded-md bg-[#FF6112] flex items-center justify-center' onPress={() => navigation.navigate("FinancialEstablishment")}>
                                <Text className='text-xl font-bold text-gray-50'>Retirar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {
                userId ?
                    <BottomNavigationBar
                        establishmentScreen
                        userID={userId}
                        userPhoto={'http'}
                    />
                    :
                    null
            }

        </View>
    );
}

