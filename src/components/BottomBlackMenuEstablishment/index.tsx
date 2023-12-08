import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React, { useEffect, useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {useUser} from "../../context/userContext";

interface IBottomBlackMenuEstablishment {
    screen: string
    establishmentID: string
    establishmentLogo: string | null
    paddingTop: number
}

export default function BottomBlackMenuEstablishment(props: IBottomBlackMenuEstablishment) {
    const {userData} = useUser();

    const [screen, setScreen] = useState("")
    const [establishmentID, setEstablishmentID] = useState("")
    const [establishmentLogo, setEstablishmentLogo] = useState("")
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [showButtons, setShowButtons] = useState(true)
    const opacityValue = useSharedValue(0)

    useEffect(() => {
        setScreen(props.screen)
        setEstablishmentID(props.establishmentID)
        setEstablishmentLogo(props.establishmentLogo!)
    }, [props])

    const buttonsContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
        };
    });

    return (
        <View className={`items-center bg-transparent w-full pb-1`}>

            {
                showButtons &&
                (
                    <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                        {
                            screen === "Home" && userData && userData.id && establishmentID
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

                                        <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "" })}>
                                            <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', {
                                            establishmentPhoto: establishmentLogo ?? "",
                                            establishmentId: establishmentID,
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
                                            <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "" })}>
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
                                            <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment', { userPhoto: establishmentLogo ?? "" })}>
                                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', {
                                                establishmentPhoto: establishmentLogo ?? "",
                                                establishmentId: establishmentID,
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
