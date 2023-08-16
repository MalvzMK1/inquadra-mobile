import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useRegisterCourt from "../../hooks/useRegisterCourt";

interface CourtArrayObject {
    court_name: string,
    courtType: string[],
    fantasyName: string,
    photos: string[],
    court_availabilities: string[], // tela vinicius
    minimum_value: number,
    currentDate: string
}

export default function AllVeryWell({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'AllVeryWell'>) {
    const [courts, setCourts] = useState<CourtArrayObject[]>(route.params.courtArray)

    const [addCourt, { data: dataRegisterCourt, loading: loadingRegisterCourt, error: errorRegisterCourt }] = useRegisterCourt()

    const registerCourts = async (courts: CourtArrayObject[]) => {    
        try {
            await Promise.all(courts.map(async (court) => {
                try {
                    await addCourt({
                        variables: {
                            court_name: court.court_name,
                            courtTypes: court.courtType,
                            fantasyName: court.fantasyName,
                            photos: court.photos,
                            court_availabilities: court.court_availabilities,
                            minimum_value: court.minimum_value,
                            current_date: new Date().toISOString()
                        }
                    });
                    console.log("Deu bom");
                } catch (error) {
                    console.log("Deu ruim patrão", error);
                }
            }));
        } catch (error) {
            console.log("Erro externo:", error);
        }
    };

    
    return (
        <View className="flex-1">
            <ScrollView className="bg-white">
                <View className="p-4 gap-3">
                    <View>
                        <Text className="text-xl p-2" onPress={() => navigation.navigate('CourtDetails')}>Detalhes Quadra</Text>
                        <View className="border rounded border-orange-400 p-5">
                            <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')}>3 quadras cadastradas</Text>
                            <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')}>Total de 25 fotos</Text>
                            <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')}>Valores e horários editados</Text>
                        </View>
                    </View>

                    {
                        courts.map((court) =>
                            <View>
                                <Text className="text-xl p-2">{court.court_name}</Text>
                                <View className="border rounded border-orange-400 p-5">
                                    {
                                        court.photos.length > 1
                                            ? <Text className="text-base">Total de {court.photos.length} fotos cadastradas</Text>
                                            : <Text className="text-base">Total de {court.photos.length} foto cadastrada</Text>
                                    }
                                    {
                                        court.court_availabilities.length > 0
                                            ? <Text className="text-base">Valores e horários editados</Text>
                                            : <Text className="text-base">Valores e horarios não editados</Text>
                                    }
                                </View>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
            <View className="bg-white">
                <TouchableOpacity className='h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center' onPress= {() => registerCourts(courts)}>
                    <Text className='text-gray-50'>Concluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}