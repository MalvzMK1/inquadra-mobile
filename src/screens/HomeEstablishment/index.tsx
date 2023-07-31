import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useReserveDisponible } from "../../hooks/useReserveDisponible";
import { useNextToCourtByIdQuery } from "../../graphql/queries/nextToCourtsById";
import { useGetNextToCourtsById } from "../../hooks/useNextToCourtById";
import { useEstablishmentSchedulings } from "../../hooks/useEstablishmentSchedulings";
import { useSchedulingById } from "../../hooks/useSchedulingById";
import { useGetUserById } from "../../hooks/useUserById";
import { useGetSchedulingsDetails } from "../../hooks/useSchedulingDetails";
import { useSchedule } from "../../hooks/useSchedule";
import { useGetNextToCourts } from "../../hooks/useNextToCourts";
import { useGetMenuUser } from "../../hooks/useMenuUser";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import { useGetFavoriteById } from "../../hooks/useFavoriteById";
import useAvailableSportTypes from "../../hooks/useAvailableSportTypes";

export default function HomeEstablishment() {


    const { loading, error, data } = useGetFavoriteById("1");
      console.log(data);
      if (loading) return <Text>Loading...</Text>;
      if (error) {
        return <Text>Error: {JSON.stringify(error)}</Text>;
      }
      return <Text>Hello {JSON.stringify(data)}!</Text>;

    const navigation = useNavigation();
    const [selected, setSelected] = useState('');

    const [selectedDate, setSelectedDate] = useState('');

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
        {key: '1', value: 'Quadra coberta 1', date: formattedData},
        {key: '2', value: 'Quadra Aberta', date: formattedData
        },
        { key: '3', value: 'Quadra do Zequinha', date: formattedData, time: ['00:00hs','00:00hs','00:00hs','00:00hs','00:00hs','00:00hs','00:00hs','00:00hs','00:00hs',]
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
                            <Text className="text-white font-bold">19:30 - 20:30 pagamento finalizado</Text>
                            <Text className="text-white font-bold">19:30 - 20:30 pagamento finalizado</Text>
                            <Text className="text-white font-bold">19:30 - 20:30 pagamento finalizado</Text>
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
                                    <Ionicons name="person-outline" size={16} color="#FF6112"  style={{ marginRight: 6 }}  />
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
                                    <Ionicons name="person-outline" size={16} color="#FF6112"  style={{ marginRight: 6 }}  />
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

const styles = StyleSheet.create({
    timeSlotContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    timeSlot: {
      fontSize: 18,
    },
    available: {
      fontSize: 18,
      color: 'green',
    },
    booked: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bookingInfo: {
      fontSize: 18,
      color: 'red',
    },
  });
  
  
