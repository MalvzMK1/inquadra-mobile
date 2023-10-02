import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Text } from "react-native"
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type CreditCardInfosT = {
    number: string
}

export default function CreditCardCard(props: CreditCardInfosT) {
    const creditCardNumber = props.number.replace(/\D/g, '')
    let label = ''

    const regexVisa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const regexMasterCard = /^5[1-5][0-9]{14}$/;
    const regexElo = /^(636368|438935|504175|451416|636297)[0-9]{10}$/;

    if (regexVisa.test(creditCardNumber)) {
        label = "visa";
    } else if (regexMasterCard.test(creditCardNumber)) {
        label = "masterCard";
    } else if (regexElo.test(creditCardNumber)) {
        label = "elo";
    } else {
        label = "unknow";
    }

    return (
        <View className="flex h-[90px] w-[300px] rounded-xl justify-start items-start border">
            <View className="flex  w-[300px] justify-end items-end">
                <MaterialIcons name="delete" color="#F5620F" size={25} />
            </View>
            <View className="flex-row justify-start items-center">
                <Text>
                    {props.number}
                </Text>
                {
                    label === 'visa'
                        ? <Image source={require('../../assets/visaLogo.png')}></Image>
                        : label === 'masterCard'
                            ? <Image source={require('../../assets/masterCardLogo.png')}></Image>
                            : label === 'elo'
                                ? <Image source={require('../../assets/eloLogo.png')}></Image>
                                : null
                }
            </View>
        </View>
    )
}