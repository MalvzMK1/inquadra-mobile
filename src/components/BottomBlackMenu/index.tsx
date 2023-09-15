import { View, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import React, { useState } from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
interface IBottomBlackMenu {
    screen: string
    userID: string
    userPhoto: string | null
}

export default function BottomBlackMenu(props: IBottomBlackMenu) {
    const { screen, userID, userPhoto } = props
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()

    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    return (
        <View className="items-center">
            <View className="bg-black h-[75px] w-2/3 rounded-[20px] items-center justify-around flex flex-row">
                {
                    screen === "Home"
                        ?
                        <>
                            <TouchableOpacity onPress={() => navigation.navigate('FavoriteCourts', { userPhoto: userPhoto ?? "", userID: userID })}>
                                <AntDesign name="heart" size={20} color={"white"} />
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                <Image source={require('../../assets/calendar_icon.png')}></Image>
                            </TouchableOpacity>
                        </>

                        : screen === "Favorite"
                            ?
                            <>
                                <TouchableOpacity>
                                    <AntDesign name="heart" size={30} color={"red"} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                    userGeolocation: userGeolocation ? userGeolocation : {
                                        latitude: 78.23570781291714,
                                        longitude: 15.491400000982967
                                    },
                                    userID: userID,
                                    userPhoto: userPhoto ?? ""
                                })}>
                                    <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                    <Image source={require('../../assets/calendar_icon.png')}></Image>
                                </TouchableOpacity>
                            </>
                            : screen === "Historic"
                                ?
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('FavoriteCourts', { userPhoto: userPhoto ?? "", userID: userID })}>
                                        <AntDesign name="heart" size={20} color={"white"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                        userGeolocation: userGeolocation ? userGeolocation : {
                                            latitude: 78.23570781291714,
                                            longitude: 15.491400000982967
                                        },
                                        userID: userID,
                                        userPhoto: userPhoto ?? ""
                                    })}>
                                        <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image source={require('../../assets/calendar_icon_orange.png')}></Image>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('FavoriteCourts', { userPhoto: userPhoto ?? "", userID: userID })}>
                                        <AntDesign name="heart" size={20} color={"white"} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('Home', {
                                        userGeolocation: userGeolocation ? userGeolocation : {
                                            latitude: 78.23570781291714,
                                            longitude: 15.491400000982967
                                        },
                                        userID: userID,
                                        userPhoto: userPhoto ?? ""
                                    })}>
                                        <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('InfoReserva', { userId: userID })}>
                                        <Image source={require('../../assets/calendar_icon.png')}></Image>
                                    </TouchableOpacity>
                                </>
                }
            </View>
        </View>
    )
}