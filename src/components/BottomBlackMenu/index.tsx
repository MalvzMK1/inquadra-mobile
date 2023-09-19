import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { AntDesign, MaterialIcons } from "@expo/vector-icons"
import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface IBottomBlackMenu {
    screen: string
    userID: string
    userPhoto: string | null
    isDisabled: boolean
    paddingTop: number
}

export default function BottomBlackMenu(props: IBottomBlackMenu) {
    const { screen, userID, userPhoto, isDisabled, paddingTop } = props
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const [showPrincipalButton, setPrincipalButton] = useState(true)
    const [showButtons, setShowButtons] = useState(false)
    const [statusClickHome, setStatusClickHome] = useState(false)
    const opacityValue = useSharedValue(0)
    const buttonsContainerStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
        };
    });

    const toogleButton = () => {
        setShowButtons(!showButtons)
        setPrincipalButton(false)
        opacityValue.value = showButtons ? 0 : 1
    }

    const togglePrincipalButton = () => {
        setPrincipalButton(true)
        setShowButtons(false)
    }

    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    return (
        <View className={`items-center ${!isDisabled ? "bg-[#292929]" : "transparent"} w-full pt-${paddingTop} pb-1`}>
            {
                showPrincipalButton
                    ? <TouchableOpacity
                        className={`flex flex-row items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-${screen === "Home" && !showButtons ? "bg-[#292929]" : "transparent"} ml-[5px] mr-[5px]`}
                        onPress={toogleButton}
                    >
                        <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                    </TouchableOpacity>
                    : null
            }
            {
                showButtons &&
                (
                    <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                        {
                            screen === "Home"
                                ?
                                showButtons && (<>

                                    <TouchableOpacity onPress={() => navigation.navigate('FavoriteEstablishments', { userPhoto: userPhoto ?? "", userID: userID })}>
                                        <AntDesign name="heart" size={25} color={"white"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => togglePrincipalButton()}>
                                        <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                        <MaterialIcons name="calendar-today" color={"white"} size={25} />
                                    </TouchableOpacity>
                                </>)
                                : screen === "Favorite"
                                    ?
                                    showButtons &&
                                    (<>
                                        <TouchableOpacity>
                                            <AntDesign name="heart" size={35} color={"red"} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                            userGeolocation: userGeolocation ? userGeolocation : {
                                                latitude: 78.23570781291714,
                                                longitude: 15.491400000982967
                                            },
                                            userID: userID,
                                            userPhoto: userPhoto ?? ""
                                        })}>
                                            <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                            <MaterialIcons name="calendar-today" color={"white"} size={26} />
                                        </TouchableOpacity>
                                    </>)
                                    : screen === "Historic"
                                        ?
                                        showButtons &&
                                        (<>
                                            <TouchableOpacity>
                                                <AntDesign name="heart" size={25} color={"white"} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                                userGeolocation: userGeolocation ? userGeolocation : {
                                                    latitude: 78.23570781291714,
                                                    longitude: 15.491400000982967
                                                },
                                                userID: userID,
                                                userPhoto: userPhoto ?? ""
                                            })}>
                                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                            </TouchableOpacity>

                                            <TouchableOpacity>
                                                <MaterialIcons name="calendar-today" color="#F5620F" size={33} />
                                            </TouchableOpacity>
                                        </>)
                                        :
                                        showButtons &&
                                        (<>
                                            <TouchableOpacity>
                                                <AntDesign name="heart" size={25} color={"white"} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                                userGeolocation: userGeolocation ? userGeolocation : {
                                                    latitude: 78.23570781291714,
                                                    longitude: 15.491400000982967
                                                },
                                                userID: userID,
                                                userPhoto: userPhoto ?? ""
                                            })}>
                                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                                <MaterialIcons name="calendar-today" color={"white"} size={26} />
                                            </TouchableOpacity>
                                        </>)
                        }
                    </View>
                )
            }
        </View >
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