import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function HomeEstablishment() {
    const navigation = useNavigation();
    const [selected, setSelected] = useState('');

    const [selectedDate, setSelectedDate] = useState('');

    const CustomTimeView = ({ text }) => {
        return (
        <View className="flex flex-row h-10 items-center w-20 border-r-2 border-gray-400">
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
        { 
          key: '1', value: 'Quadra coberta 1', date: formattedData, 
          info: [ { time: '14:00hs', status: 'Livre' },
           { time: '14:30hs', status: 'Livre' },
            { time: '15:00hs', status: 'Livre' },
            { time: '15:30hs', status: 'Livre' },
            { time: '16:00hs', status: 'Livre' }, 
            { time: '16:30hs', status: 'Livre' },
            { time: '17:00hs', status: 'Livre' },
            { time: '17:30hs', status: 'Livre' },
            { time: '18:00hs', status: 'Livre' },
            { time: '18:30hs', status: 'Livre' },
            { time: '19:00hs', status: 'Livre' },
            { time: '19:30hs', status: 'Livre' },
          ] 
        },
        { 
          key: '2', 
          value: 'Quadra Aberta', 
          date: formattedData, 
          info: [
            { time: '08:00hs', status: { 
              name: 'Jhon Lopes', 
              status: 'Pago', 
              sport: 'Basquete', 
              time: '8:00h - 9:00h' 
            }},
            { time: '08:30hs', status: 'Livre' },
            { time: '09:00hs', status: 'Livre' },
            { time: '09:30hs', status: 'Livre' },
            { time: '10:00hs', status: 'Livre' },
            { time: '10:30hs', status: 'Livre' },
            { time: '11:00hs', status: 'Livre' },
            { time: '11:30hs', status: 'Livre' },
            { time: '12:00hs', status: 'Livre' },
          ]
        },
        { 
          key: '3', 
          value: 'Quadra do Zequinha', 
          date: formattedData, 
          info: [
            { time: '08:00hs', status: { 
              name: 'João Lopes', 
              status: 'Pago', 
              sport: 'Basquete', 
              time: '14:00h - 15:00h' 
            }},
            { time: '08:30hs', status: 'Livre' },
            { time: '09:00hs', status: 'Livre' },
            { time: '09:30hs', status: 'Livre' },
            { time: '10:00hs', status: 'Livre' },
            { time: '10:30hs', status: 'Livre' },
            { time: '11:00hs', status: 'Livre' },
            { time: '11:30hs', status: 'Livre' },
            { time: '12:00hs', status: 'Livre' },
          ]
        },
        { key: '4', value: 'Quadra do Eliel', date: formattedData, info: 'Informações do Item 4' },
        { key: '5', value: 'Quadra da Mari', date: formattedData, info: 'Informações do Item 5' },
        { key: '6', value: 'Quadra da Larissa', date: formattedData, info: 'Informações do Item 6' },
        { key: '7', value: 'Quadra 7', date: formattedData, info: 'Informações do Item 7' },
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
                        {Array.isArray(item.info) ? (
                            item.info.map((infoData, index) => (
                            <View key={index} className="flex flex-row">
                                <View>
                                <CustomTimeView text={infoData.time} />
                                </View>
                                <View className="mt-3.5 ml-2">
                                {typeof infoData.status === 'string' ? ( 
                                    <Text className="">{infoData.status}</Text>
                                ) : (
                                    <View className="flex flex-row h-20 rounded bg-gray-400 ">
                                    <Text className="">{infoData.status.name}</Text>
                                    <Text>{infoData.status.status}</Text>
                                    <Text>{infoData.status.sport}</Text>
                                    <Text>{infoData.status.time}</Text>
                                    </View>
                                )}
                                </View>
                            </View>
                            ))
                        ) : (
                            <CustomTimeView text={item.info} />
                        )}
                        </View>
                    );
                    }
                    return null;
                })}
                    </View>
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
  
  
