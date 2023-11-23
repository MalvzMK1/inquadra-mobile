import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React, { useEffect, useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BottomAppVersion from "../BottomAppVersion";

interface IBottomBlackMenuEstablishment {
    screen: string
    establishmentID: string
    userID: string
    establishmentLogo: string | null
    paddingTop: number
}

export default function BottomBlackMenuEstablishment(props: IBottomBlackMenuEstablishment) {
    const [screen, setScreen] = useState("")
    const [establishmentID, setEstablishmentID] = useState("")
    const [establishmentLogo, setEstablishmentLogo] = useState("")
    const [userID, setUserID] = useState("")
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const [showButtons, setShowButtons] = useState(true)
    const opacityValue = useSharedValue(0)

    useEffect(() => {
        setScreen(props.screen)
        setEstablishmentID(props.establishmentID)
        setEstablishmentLogo(props.establishmentLogo!)
        setUserID(props.userID)
    }, [props])

    const buttonsContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
        };
    });

    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    return (
        <View className={`items-center bg-transparent w-full pb-1`}>

            {
                showButtons &&
                (
                    <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                        {
                            screen === "Home" && userID && establishmentID && userID
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
                                        establishmentId: "6",
                                        userId: "1"
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
            <BottomAppVersion />
        </View>
    )
}
