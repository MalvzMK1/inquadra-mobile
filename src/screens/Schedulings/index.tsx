import { View, Text, Image, ScrollView } from "react-native"
import CourtSchedulingContainer from "../../components/CourtSchedulingContainer"
import { BottomNavigationBar } from "../../components/BottomNavigationBar"
import CourtScheduling from "../../components/CourtScheduling"
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export default function Schedulings({navigation, route}: NativeStackScreenProps<RootStackParamList, 'Schedulings'>) {
    const currentDate = new Date().toISOString().split("T")[0];

    return (
        <View className=" h-full w-full pt-[20px] pl-[30px] pr-[30px]">
            <View className="w-full h-fit items-center justify-between flex flex-row">
                <Text className="font-black text-[16px]">Registro de reservas</Text>
                <Image source={require('../../assets/calendar_orange_icon.png')}></Image>
            </View>

            <ScrollView className="mt-[15px]">

                <CourtSchedulingContainer
                    date={currentDate}
                >
                    <View>
                        <CourtScheduling
                            id={'1'}
                            name="Quadra Fênix"
                            startsAt="17:00h"
                            endsAt="18:00h"
                            status="Active"
                        />

                        <CourtScheduling
                            id={'2'}
                            name="Quadra Fênix"
                            startsAt="17:00h"
                            endsAt="18:00h"
                            status="Canceled"
                        />
                    </View>
                </CourtSchedulingContainer>

            </ScrollView>

            <BottomNavigationBar
                establishmentScreen
                userID={'1'}
                userPhoto={'https'}
            />
        </View>
    )
}