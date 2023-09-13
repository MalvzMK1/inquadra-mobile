import { View, Image, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import storage from "../../utils/storage";
interface IBottomBlackMenuEstablishment {
    screen: string
    establishment_id: string
    logo_establishment: string | null
}

export default function BottomBlackMenuEstablishment(props: IBottomBlackMenuEstablishment) {
    const { screen, establishment_id, logo_establishment } = props
    const navigation = useNavigation();
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
                            <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentID: establishment_id, logo: logo_establishment })}>
                                <Image source={require('../../assets/pig_logo.png')}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Image source={require('../../assets/logo_inquadra_colored.png')}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', { establishmentPhoto: logo_establishment })}>
                                <Image source={require('../../assets/calendar_icon.png')}></Image>
                            </TouchableOpacity>
                        </>

                        : screen === "Financial"
                            ?
                            <>
                                <TouchableOpacity>
                                    <Image source={require('../../assets/pig_logo_orange.png')}></Image>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment')}>
                                    <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', { establishmentPhoto: logo_establishment })}>
                                    <Image source={require('../../assets/calendar_icon.png')}></Image>
                                </TouchableOpacity>
                            </>
                            : screen === "Schedule"
                                ?
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentID: establishment_id, logo: logo_establishment })}>
                                        <Image source={require('../../assets/pig_logo.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment')}>
                                        <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Image source={require('../../assets/calendar_icon_orange.png')}></Image>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <TouchableOpacity onPress={() => navigation.navigate('FinancialEstablishment', { establishmentID: establishment_id, logo: logo_establishment })}>
                                        <Image source={require('../../assets/pig_logo.png')}></Image>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => navigation.navigate('HomeEstablishment')}>
                                        <Image source={require('../../assets/logo_inquadra_white.png')}></Image>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress={() => navigation.navigate('CourtSchedule', { establishmentPhoto: logo_establishment })}>
                                        <Image source={require('../../assets/calendar_icon.png')}></Image>
                                    </TouchableOpacity>
                                </>
                }
            </View>
        </View>
    )
}