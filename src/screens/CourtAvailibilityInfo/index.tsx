import { View, Text, TextInput, ImageBackground, SafeAreaView, Image, ScrollView } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import React, { useState } from 'react'
import WeekDayButton from "../../components/WeekDays"
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import { Calendar } from 'react-native-calendars'
import { getWeekDates } from "../../utils/getWeekDates"
import { DateData } from "react-native-calendars"
import { addDays, format } from 'date-fns'

const courtImage: ImageSourcePropType = require('../../assets/quadra.png')

export const dayInitial = [
    "D",
    "S",
    "T",
    "Q",
    "Q",
    "S",
    "S",
]

export default function CourtAvailibilityInfo() {
    const [showCalendar, setShowCalendar] = useState(false)
    const [dateSelected, setDateSelected] = useState(new Date())
    const [selectedWeekDate, setSelectedWeekDate] = useState<WeekDays>()

    const weekDates: FormatedWeekDates[] = getWeekDates(dateSelected)

    // function handleWeekDayClick(index: number) {
    //     const availabilities = courtAvailability?.court.data.attributes.court_availabilities.data

    //     const newActiveStates = Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false);
    //     newActiveStates[index] = true;
    //     setActiveStates(newActiveStates);

    //     setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays)
    //     if (availabilities)
    //         setShownAvailabilities(availabilities.filter(availabilitie =>
    //             availabilitie.attributes.weekDay === weekDates[index].dayName as unknown as WeekDays
    //         ))
    // }

    function handleCalendarClick(data: DateData) {
        const date = new Date(data.dateString)
        const weekDay = format(addDays(date, 1), 'eeee')

        setDateSelected(date)
        setSelectedWeekDate(weekDay as WeekDays)
    }

    const [activeStates, setActiveStates] = useState([])

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    return (
        <SafeAreaView className="flex flex-col justify-between h-full">
            <View className="h-[215px] w-full">
                <ImageBackground className="flex-1 flex flex-col" source={courtImage}>
                    <TouchableOpacity className="mt-[50px] ml-[20px]" onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/back_arrow.png')}></Image>
                    </TouchableOpacity>
                </ImageBackground>
            </View>

            <View className="h-fit mt-[10px]">
                <View className="h-fit items-center">
                    <Text className="text-[20px] font-black">Quadra Municipal Itaquera</Text>

                    {!showCalendar && (
                        <View className="h-fit w-full border border-[#9747FF] border-dashed p-[15px] items-center justify-around flex flex-row mt-[30px]">
                            {/* {
                                weekDates.map((date, index) => (
                                    <WeekDayButton
                                        localeDayInitial={date.localeDayInitial}
                                        day={date.day}
                                        onClick={(isClicked) => {
                                            handleWeekDayClick(index)
                                        }}
                                        active={activeStates[index]}
                                    />
                                ))
                            } */}
                        </View>
                    )}

                    {showCalendar && (
                        <Calendar
                            className="h-fit w-96"
                            current={new Date().toDateString()}
                            onDayPress={handleCalendarClick}
                            markedDates={{
                                [dateSelected.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
                                // '2023-08-02': { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
                            }}
                        />
                    )}

                    <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px]"></TouchableOpacity>
                </View>


            </View>

            <ScrollView className="max-h-[390px] w-full pl-[10px] pr-[10px] mt-[30px]">
                <CourtAvailibility startsAt="16:00" endsAt="17:00" price={190.90} busy={true} />

                <CourtAvailibility startsAt="17:00" endsAt="18:00" price={190.90} busy={false} />

                <CourtAvailibility startsAt="19:00" endsAt="20:00" price={190.90} busy={false} />

                <CourtAvailibility startsAt="20:00" endsAt="21:00" price={190.90} busy={false} />

                <CourtAvailibility startsAt="21:00" endsAt="22:00" price={190.90} busy={true} />

                <CourtAvailibility startsAt="22:00" endsAt="23:00" price={190.90} busy={false} />

                <CourtAvailibility startsAt="23:00" endsAt="00:00" price={190.90} busy={false} />
            </ScrollView>

            <View className="h-fit w-full p-[15px] mt-[30px]">
                <TouchableOpacity className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'>
                    <Text className='text-white'>RESERVAR</Text>
                </TouchableOpacity>
            </View>

            <BottomBlackMenu />

        </SafeAreaView>
    )
}