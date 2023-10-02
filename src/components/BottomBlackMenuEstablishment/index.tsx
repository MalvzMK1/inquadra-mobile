import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface IBottomBlackMenuEstablishment {
    screen: string
    establishmentID: string
    userID: string
    establishmentLogo: string | null
    paddingTop: number
}

export default function BottomBlackMenuEstablishment(props: IBottomBlackMenuEstablishment) {
    const { screen, establishmentID, establishmentLogo, paddingTop, userID } = props
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const [showPrincipalButton, setPrincipalButton] = useState(true)
    const [showButtons, setShowButtons] = useState(true)
    const [statusClickHome, setStatusClickHome] = useState(false)
    const opacityValue = useSharedValue(0)
    const buttonsContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
        };
    });

    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    return (
        <View className={`items-center bg-transparent w-full pt-${paddingTop} pb-1`}>

            {
                showButtons &&
                (
                    <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                        {
                            screen === "Home"
                                ?
                                showButtons && (<>
                                    <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentId: establishmentID, logo: establishmentLogo ?? "" })}>
                                        <MaterialCommunityIcons name="piggy-bank-outline" size={30} color={"white"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', {
                                        establishmentPhoto: establishmentLogo ?? "",
                                        establishmentId: establishmentID,
                                        userId: userID
                                    })}>
                                        <MaterialIcons name="calendar-today" color={"white"} size={25} />
                                    </TouchableOpacity>
                                </>)
                                : screen === "Finance"
                                    ?
                                    showButtons &&
                                    (<>
                                        <TouchableOpacity>
                                            <MaterialCommunityIcons name="piggy-bank-outline" size={38} color="#F5620F" />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "", userID: userID })}>
                                            <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', {
                                            establishmentPhoto: establishmentLogo ?? "",
                                            establishmentId: establishmentID,
                                            userId: userID
                                        })}>
                                            <MaterialIcons name="calendar-today" color={"white"} size={26} />
                                        </TouchableOpacity>
                                    </>)
                                    : screen === "Schedule"
                                        ?
                                        showButtons &&
                                        (<>
                                            <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentId: establishmentID ?? "", logo: establishmentLogo ?? "" })}>
                                                <MaterialCommunityIcons name="piggy-bank-outline" size={30} color={"white"} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "", userID: userID })}>
                                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity>
                                                <MaterialIcons name="calendar-today" color="#F5620F" size={33} />
                                            </TouchableOpacity>
                                        </>)
                                        :
                                        showButtons &&
                                        (<>
                                            <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentId: establishmentID, logo: establishmentLogo ?? "" })}>
                                                <MaterialCommunityIcons name="piggy-bank-outline" size={30} color={"white"} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "", userID: userID })}>
                                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', {
                                                establishmentPhoto: establishmentLogo ?? "",
                                                establishmentId: establishmentID,
                                                userId: userID
                                            })}>
                                                <MaterialIcons name="calendar-today" color={"white"} size={26} />
                                            </TouchableOpacity>
                                        </>)
                        }
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5
    }
})