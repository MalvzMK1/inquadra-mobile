import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/RootStack";

export default function AllVeryWell({navigation, route}: NativeStackScreenProps<RootStackParamList, 'AllVeryWell'>) {

    return (
        <View className="flex-1">
            <ScrollView className="bg-white">
            <View className="p-4 gap-3">
                <View>
                    <Text className="text-xl p-2" onPress={() => navigation.navigate('CourtDetails')}>Detalhes Quadra</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')}>3 quadras cadastradas</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')}>Total de 25 fotos</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >Valores e horários editados</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-xl p-2" onPress={() => navigation.navigate('CourtDetails')}>Detalhes Society</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >3 quadras cadastradas</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >Total de 25 fotos</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >Valores e horários editados</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-xl p-2" onPress={() => navigation.navigate('CourtDetails')} >Detalhes Campo de Futebol</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >3 quadras cadastradas</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >Total de 25 fotos</Text>
                        <Text className="text-base" onPress={() => navigation.navigate('CourtDetails')} >Valores e horários editados</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
        <View className="bg-white">
            <TouchableOpacity className='h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => navigation.navigate('')}>
                <Text className='text-gray-50'>Concluir</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}