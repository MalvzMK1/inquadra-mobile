import {View, Text, Image, Dimensions, StyleSheet, ScrollView, TouchableOpacity} from "react-native"
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {NavigationProp, useNavigation} from "@react-navigation/native";

interface CourtCardInfo {
  id: string
  userId: string
  name: string
  type: string
  rate: number
  image: string
  availabilities: boolean| undefined
}

export function CourtCard(props: CourtCardInfo) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View className="flex flex-row items-center mb-[15px] mt-[10px]">
          <TouchableOpacity onPress={() => {
            navigation.navigate('CourtAvailabilityInfo', {
              courtName: props.name,
              courtImage: props.image,
              courtId: props.id,
              userId: props.userId
            })
          }}>
            <Image className="h-[90px] w-[140px] rounded-[5px]" source={{uri: props.image}}></Image>
          </TouchableOpacity>
            <View className="ml-[15px]">
                <Text className="text-[#FF6112] text-[15px] leading-[24px]">{props.name}</Text>
                <Text className="text-[12px] leading-[20px] font-normal">{props.type}</Text>
                <Text className="flex text-[12px] leading-[20px] font-bold items-center justify-center">Avaliação: {props.rate ? props.rate : "Quadra ainda não foi avaliada"} <Ionicons name="star-sharp" size={20} color="orange" /> </Text>
                <Text className="text-[12px] leading-[20px] font-bold mt-4">{props.availabilities || props.availabilities == undefined ? "Tem" : "Não"} horário disponivel</Text>
            </View>
        </View>
    )
}