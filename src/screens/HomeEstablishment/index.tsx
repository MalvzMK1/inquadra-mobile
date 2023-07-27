import { View, Text, TouchableOpacity, SafeAreaView} from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { SelectList } from "react-native-dropdown-select-list";
import { Agenda } from 'react-native-calendars';
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function HomeEstablishment() {

    

    const navigation = useNavigation()

      const [selected, setSelected] = React.useState();
      const dataCourts = [
        { key: '1', value: 'Quadra coberta 1', info: 'Informações do Item 1'},
        { key: '2', value: 'Quadra Aberta', info: 'Informações do Item 2'},
        { key: '3', value: 'Quadra do Zequinha', info: 'Informações do Item 3'},
        { key: '4', value: 'Quadra do Eliel', info: 'Informações do Item 4'},
        { key: '5', value: 'Quadra da Mari', info: 'Informações do Item 5'},
        { key: '6', value: 'Quadra da Larissa', info: 'Informações do Item 6'},
        { key: '7', value: 'Quadra 7', info: 'Informações do Item 7'},
    ]

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
                            <Text className="font-extrabold text-xl">
                                Por quadra
                            </Text>
                            <View className="ml-auto flex flex-col items-start">
                            <SelectList
                            setSelected={(val: string) => {
                                setSelected(val)
                            }}
                            data={dataCourts}
                            save='value'
                            searchPlaceholder='Pesquisar...'
                            defaultOption={dataCourts.length > 0 ? dataCourts[0] : undefined}
                            boxStyles={{borderColor: "#FF6112", borderRadius: 4, height: 43, width: 160}}
                            dropdownTextStyles={{color: "#FF6112"}}
                            inputStyles={{color: "#FF6112", alignSelf: "center"}}
                            dropdownStyles={{borderColor: "#FF6112", width: 160,  position: "absolute", marginTop: 44}}
                            closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                            searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                            arrowicon={<AntDesign name="down" size={13} color="#FF6112" style={{marginEnd: 2, alignSelf: "center", marginLeft: 5}} />}
                            />
                           
                        </View>
                       
                        </View>
                    </View>
                    <View className="fixed">
                        <Text className="text-base -mt-4">{selected}</Text>
                        {dataCourts.map(item => {
                            if (item.value === selected) {
                            return <Text key={item.value}>{item.info}</Text>;
                            }
                            return null;
                        })}
                    </View>
                </View>
                
                </View>
            </ScrollView>
        </View>
    )
}