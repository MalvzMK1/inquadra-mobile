import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native';

import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import useRegisterCourt from '../../../hooks/useRegisterCourt';
import { BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native'; // Importe CommonActions


interface CourtArrayObject {
    court_name: string,
    courtType: string[],
    fantasyName: string,
    photos: string[],
    court_availabilities: string[], // tela vinicius
    minimum_value: number,
    currentDate: string
}

export default function CourtDetails({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'CourtDetails'>) {
    const [courts, setCourts] = useState<CourtArrayObject[]>(route.params.courtArray)

    useEffect(() => {
        setCourts(route.params.courtArray);
    }, [route.params.courtArray]);

    useFocusEffect(
        React.useCallback(() => {
            setCourts(route.params.courtArray);
        }, [route.params.courtArray])
    );

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
                    navigation.navigate('CompletedEstablishmentRegistration')
                } catch (error) {
                    console.log("Deu ruim patrão", error);
                }
            }));
        } catch (error) {
            console.log("Erro externo:", error);
        }
    };

useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      sendUpdatedDataBack();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [courts]);

  const sendUpdatedDataBack = () => {
    navigation.navigate('AllVeryWell', { courtArray: courts });
  };

    return (
        <View className='flex-1'>
            <ScrollView className='flex-grow'>
                <Text className='p-2 pt-6 text-2xl'>Detalhes Quadra</Text>
                {
                    courts.map((court, index) =>
                        <View className='bg-[#292929]'>
                            <View className='flex flex-row pl-5 pt-5 pb-5'>
                                <Image source={require('../../../assets/quadra.png')} className="w-2/5"></Image>
                                <View className='w-4/6 pr-5'>
                                    <View className='flex flex-row pr-2'>
                                        <Text className='text-[#FF6112] font-bold pl-2 flex-grow'>{court.fantasyName}</Text>
                                        <Ionicons name="pencil" size={20} color="#FF6112" onPress={() => { navigation.navigate('editCourt', { courtArray: courts, indexCourtArray: index }) }} />
                                    </View>
                                    <Text className='text-white font-bold pl-2'>Valor inicial: {court.minimum_value} reais</Text>
                                    <Text className='text-white font-bold pl-2'>Locação de: Terça a Domingo</Text>
                                    <Text className='text-white font-bold pl-2'>Day User: Habilitado</Text>
                                    <Text className='text-white font-bold pl-2'>Horário: das 06:00 as 23:00</Text>
                                </View>
                            </View>
                        </View>
                    )
                }
            </ScrollView>
            <View>
                <TouchableOpacity className='h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => registerCourts(courts)}>
                    <Text className='text-gray-50'>Concluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}