import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import useGetCourtNameByEstablishmentQuery from "../../hooks/useGetCourtsByEstablishment";
import { useGetEstablishmentSchedulingDetails } from "../../hooks/useGetEstablishmentSchedulingsDetails";
import { formatHour } from "../../utils/formatHour";
import { generateTimeList } from "../../utils/generateTimeSlots";

export default function HomeEstablishment() {
    const timeList = generateTimeList();
    const navigation = useNavigation();
    const [selected, setSelected] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [fantasyName, setFantasyName] = useState('')
    const establishmentId = '5'
    const dayWeek = 'Wednesday'
    const daySelected = '2023-12-14'

    const { data: dataCourtName, loading: loadingCourtName, error: errorCourtName } = useGetCourtNameByEstablishmentQuery(establishmentId)
    useEffect(() => {
        if (dataCourtName && dataCourtName.establishment.data.attributes.courts.data[0]) {
            setFantasyName(dataCourtName.establishment.data.attributes.courts.data[0].attributes.name);
        }
    }, [dataCourtName]);

    const { data: dataAvailability, loading: loadingAvailability, error: errorAvailability } = useGetEstablishmentSchedulingDetails(establishmentId, fantasyName, dayWeek, daySelected)

    

    const schedulingListDisponible = dataAvailability?.establishment.data.attributes.courts.data
    .flatMap((court) =>
      court.attributes.court_availabilities.data.flatMap((availability) =>
       {
        return{
            startsAt: availability.attributes.startsAt.substring(0,5),
            endsAt: availability.attributes.endsAt.substring(0,5)
        }
       }
      )
    );
    

       console.log(schedulingListDisponible)


    const CustomTimeView = ({ text }) => {
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



    return (
        <View className="flex-1">
            <ScrollView>
                <View className="p-5 flex flex-col justify-between">
                    <View className="bg-[#292929] border rounded-md p-5 h-40">
                        <Text className="text-[#FF6112] text-base font-bold">Código de ativação</Text>
                        <View className="items-center pt-5">
                            <View className="bg-[#D9D9D9] rounded-lg w-1/2 h-10 items-center justify-center">
                                <Text className="text-3xl font-extrabold">VAFTY</Text>
                            </View>
                        </View>
                    </View>
                    <View className="items-center">
                        <TouchableOpacity className='-mt-6 w-1/2 h-10 rounded-md bg-[#FF6112] flex items-center justify-center '>
                            <Text className='text-xl font-bold text-gray-50'>Validar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5 ">
                            <Text className="text-[#FF6112] text-base font-bold">Reservas hoje</Text>
                            <View className="pt-5 gap-2">
                                {
                                    dataAvailability?.establishment.data.attributes.courts.data.map((establishment) =>
                                        establishment.attributes.court_availabilities.data.map((availability) =>
                                            availability.attributes.schedulings.data.map((schedulings) =>
                                                <Text className="text-white font-bold">
                                                    {formatHour(schedulings.attributes.court_availability.data.attributes.startsAt)} - {formatHour(schedulings.attributes.court_availability.data.attributes.endsAt)}{schedulings.attributes.payedStatus ? " Pagamento finalizado" : " Pagamento em aberto"}</Text>
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
                        {/* //<Text>{}</Text>     */}
                        <View className="flex flex-row">
                            <View className="gap-4 pt-3">
                                {
                                    dataAvailability?.establishment.data.attributes.courts.data.map((index) =>
                                        index.attributes.court_availabilities.data.map((availabilities) => 
                                        <View className="flex flex-row">
                                            <Text>{availabilities.attributes.startsAt.substring(0, 5)}</Text>
                                            {availabilities.attributes.schedulings.data.map((scheduling) =>
                                                <Text>{scheduling?.attributes?.owner?.data?.attributes?.username}</Text>
                                            )}
                                        </View>
                                          
                                        )
                                    )
                                }
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
                            <TouchableOpacity className='-mt-11 w-1/2 h-10 rounded-md bg-[#FF6112] flex items-center justify-center '>
                                <Text className='text-xl font-bold text-gray-50'>Retirar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}