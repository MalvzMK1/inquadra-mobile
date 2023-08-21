import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useRegisterCourt from "../../hooks/useRegisterCourt";
import { useFocusEffect } from '@react-navigation/native';

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
    
    const [addCourt, { data: dataRegisterCourt, loading: loadingRegisterCourt, error: errorRegisterCourt }] = useRegisterCourt()
    
    const [courts, setCourts] = useState<CourtArrayObject[]>(route.params.courtArray)
    useEffect(() => {
        setCourts(route.params.courtArray);
    }, [route.params.courtArray]);

    useFocusEffect(
        React.useCallback(() => {
            setCourts(route.params.courtArray);
        }, [route.params.courtArray])
    );
    

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
                    navigation.navigate('CompletedEstablishmentRegistration')
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
                    <TouchableOpacity onPress={() => navigation.navigate('CourtDetails')}>
                        <View>
                            <Text className="text-xl p-2">Detalhes Gerais</Text>
                            <View className="border rounded border-orange-400 p-5">
                                <Text className="text-base">{courts.length} quadras cadastradas</Text>
                                <Text className="text-base">Total de {courts.reduce((totalPhotos, court) => totalPhotos + court.photos.length, 0)} fotos</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {
                        courts.map((court) =>
                            <TouchableOpacity onPress={() => navigation.navigate('CourtDetails', { courtArray: courts })}>
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
                            </TouchableOpacity>
                        )
                    }
                </View>
            </ScrollView>
            <View className="bg-white">
                <TouchableOpacity className='h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center' onPress={() => registerCourts(courts)}>
                    <Text className='text-gray-50'>Concluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}