import { View, Text, TouchableOpacity, TextInput, Image, Button, FlatList } from "react-native";

import React, { useState } from "react";
import MaskInput, { Masks } from 'react-native-mask-input';
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

export default function AllVeryWell() {
    return (
        <View className="flex-1">
            <ScrollView className="bg-white">
            <View className="p-4 gap-3">
                <View>
                    <Text className="text-xl p-2">Detalhes Quadra</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base">3 quadras cadastradas</Text>
                        <Text className="text-base">Total de 25 fotos</Text>
                        <Text className="text-base">Valores e horários editados</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-xl p-2">Detalhes Society</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base">3 quadras cadastradas</Text>
                        <Text className="text-base">Total de 25 fotos</Text>
                        <Text className="text-base">Valores e horários editados</Text>
                    </View>
                </View>
                <View>
                    <Text className="text-xl p-2">Detalhes Campo de Futebol</Text>
                    <View className="border rounded border-orange-400 p-5">
                        <Text className="text-base">3 quadras cadastradas</Text>
                        <Text className="text-base">Total de 25 fotos</Text>
                        <Text className="text-base">Valores e horários editados</Text>
                    </View>
                </View>
            </View>
            <View className="p-5 ">
            <TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center'>
                <Text className='text-gray-50'>Concluir</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </View>
    )
}