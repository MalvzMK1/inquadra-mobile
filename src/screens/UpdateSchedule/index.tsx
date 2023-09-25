import { View, Text, ImageBackground, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useState, useEffect } from 'react'
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useCourtAvailability from "../../hooks/useCourtAvailability";
import FilterDate from "../../components/FilterDateCourtAvailability"
import { useFocusEffect } from "@react-navigation/native"

LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function updateSchedule({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'UpdateSchedule'>) {
    const {
        data: courtAvailability,
        loading: isCourtAvailabilityLoading,
        error: isCourtAvailabilityError
    } = useCourtAvailability(route.params.courtId)

    const [dateSelector, setDateSelector] = useState(`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`)
    const [selectedWeekDate, setSelectedWeekDate] = useState<string>()
    const [availabilities, setAvailabilities] = useState<Array<{
        id: string
        startsAt: string,
        endsAt: string,
        price: number,
        busy: Boolean,
        weekDays: string,
        scheduling: Date | undefined
    }>>([])
    const [showCalendar, setShowCalendar] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString())
    const [selectedTime, setSelectedTime] = useState<{ id: string, value: number } | null>()
    const [price, setPrice] = useState()

    LocaleConfig.defaultLocale = 'pt-br';

    useEffect(() => {
        setSelectedDate(new Date().toISOString());
        setSelectedWeekDate(dayNames[new Date().getDay() - 1])
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            setAvailabilities([])
            if (!isCourtAvailabilityLoading && !isCourtAvailabilityError) {

                const courtsAvailable = courtAvailability?.court.data.attributes.court_availabilities.data.map((availability) => {
                    if (availability.attributes.schedulings.data.length > 0) {
                        return availability.attributes.schedulings.data.map((item) => {
                            return {
                                id: availability.id,
                                startsAt: availability.attributes.startsAt,
                                endsAt: availability.attributes.endsAt,
                                price: availability.attributes.value,
                                busy: availability.attributes.status,
                                weekDays: availability.attributes.weekDay,
                                scheduling: item.attributes.date
                            };
                        });
                    } else {
                        return {
                            id: availability.id,
                            startsAt: availability.attributes.startsAt,
                            endsAt: availability.attributes.endsAt,
                            price: availability.attributes.value,
                            busy: availability.attributes.status,
                            weekDays: availability.attributes.weekDay,
                            scheduling: undefined
                        };
                    }
                }).flat();

                if (courtsAvailable && courtAvailability) {
                    const uniqueCourtsAvailable = courtsAvailable.filter((court, index, self) =>
                        index === self.findIndex((c) => c.id === court.id)
                    );
                    if (uniqueCourtsAvailable.length > 0)
                        setAvailabilities(prevState => [...prevState, ...uniqueCourtsAvailable]);
                }

            }
        }, [isCourtAvailabilityLoading, isCourtAvailabilityError])
    )

    function handleCalendarClick(data: DateData) {
        const date = new Date(data.dateString)
        const dayOfWeek = date.getDay();
        const dayName = dayNames[dayOfWeek];

        setSelectedWeekDate(dayName)
        setSelectedDate(date.toISOString())
        setDateSelector(`${String(date.getDate() + 1).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`)
    }

    const toggleTimeSelection = (id: string, value: any) => {
        if (id && value) {
            if (selectedTime?.id === id) {
                setSelectedTime(null);
            } else {
                setSelectedTime({ id, value });
            }
        }
    };


    return (
        <SafeAreaView className="flex flex-col justify-between  h-full">
            {isCourtAvailabilityLoading ? <ActivityIndicator size='large' color='#F5620F' /> :
                <>
                    <ScrollView className=' h-screen flex flex-col'>
                        <ImageBackground className="h-[215px] w-full" source={{
                            uri: route.params.courtImage
                        }} />

                        <View className=" h-fit mt-2.5">
                            <View className="flex h-fit items-center">
                                <Text className="text-xl font-black">{route.params.courtName}</Text>
                                {!showCalendar && (
                                    <View className="h-fit w-full border border-[#9747FF] border-dashed p-[15px] items-center justify-around flex flex-row mt-[30px]">
                                        <FilterDate dateSelector={dateSelector} setDateSelector={setDateSelector} handleClick={handleCalendarClick} />
                                    </View>
                                )}
                                {showCalendar && (
                                    <Calendar
                                        className="h-fit w-96"
                                        current={new Date().toISOString().split('T')[0]}
                                        onDayPress={handleCalendarClick}
                                        minDate={new Date().toISOString()}
                                        selectedDate={selectedDate}
                                        markedDates={{
                                            [selectedDate.split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: '#FF6112' }
                                        }}
                                        theme={{
                                            arrowColor: "#FF6112",
                                            todayTextColor: "#FF6112"
                                        }}
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={() => setShowCalendar(!showCalendar)}
                                    className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px]"
                                />
                            </View>
                        </View>
                        <ScrollView className="h-full w-full pl-[10px] pr-[10px] mt-[30px] flex">
                            {
                                availabilities.length > 0 ? (
                                    availabilities.map((item) => {
                                        const startsAt = item.startsAt.split(':');
                                        const endsAt = item.endsAt.split(':');
                                        const ogPrice = item.price
                                        let isBusy = !item.busy;

                                        if (item.scheduling)
                                            if (selectedDate.split("T")[0] === item.scheduling.toString())
                                                isBusy = true;

                                        if (item.price < route.params.valuePayed)
                                            item.price = route.params.valuePayed
                                        else
                                            item.price = ogPrice

                                        if (selectedWeekDate === item.weekDays) {
                                            return (
                                                <CourtAvailibility
                                                    key={item.id}
                                                    id={item.id}
                                                    startsAt={`${startsAt[0]}:${startsAt[1]}`}
                                                    endsAt={`${endsAt[0]}:${endsAt[1]}`}
                                                    price={item.price}
                                                    busy={isBusy}
                                                    selectedTimes={selectedTime}
                                                    toggleTimeSelection={toggleTimeSelection}
                                                />
                                            );
                                        }

                                        return null;
                                    })
                                ) : (
                                    <Text className="text-xl font-black text-center">No momento não é possível Alugar essa quadra</Text>
                                )
                            }
                        </ScrollView>
                        <View className="h-fit w-full p-[15px] mt-[30px]">
                            <TouchableOpacity
                                className={`h-14 w-full rounded-md  ${!selectedTime ? availabilities.length <= 0 ? "bg-[#ffa363]" : "bg-[#ffa363]" : "bg-orange-500"} flex items-center justify-center`}
                                disabled={!selectedTime ? availabilities.length <= 0 ? true : true : false}
                                onPress={() => {
                                    if (selectedTime)
                                        navigation.navigate('PaymentScheduleUpdate', {
                                            courtName: route.params.courtName,
                                            courtImage: route.params.courtImage,
                                            courtId: route.params.courtId,
                                            userId: route.params.userId,
                                            amountToPay: selectedTime?.value,
                                            courtAvailabilities: selectedTime?.id,
                                            courtAvailabilityDate: selectedDate,
                                            userPhoto: route.params.userPhoto,
                                            scheduleUpdateID: route.params.scheduleUpdateID,
                                            pricePayed: route.params.valuePayed,
                                            activationKey: route.params.activationKey
                                        })
                                }}
                            >
                                <Text className='text-white'>RESERVAR</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="h-20"></View>
                    </ScrollView>
                    <View className="absolute bottom-0 left-0 right-0">
                        <BottomBlackMenu
                            screen="Any"
                            userID={route.params.userId}
                            userPhoto={route.params.userPhoto !== null && route.params.userPhoto !== undefined ? route.params.userPhoto : ''}
                            key={1}
                            isDisabled={true}
                            paddingTop={2}
                        />
                    </View>
                </>
            }
        </SafeAreaView>
    )
}
