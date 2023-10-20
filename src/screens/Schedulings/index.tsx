import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import CourtSchedulingContainer from "../../components/CourtSchedulingContainer"
import { BottomNavigationBar } from "../../components/BottomNavigationBar"
import CourtScheduling from "../../components/CourtScheduling"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import storage from "../../utils/storage";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";
import { addDays } from "date-fns";
import { HOST_API } from '@env';
import { Calendar, DateData } from "react-native-calendars";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";

interface ScheduleCardInfos {
    id: string,
    name: string,
    startsAt: string,
    endsAt: string,
    status: boolean,
    date: Date,
    image: string
}

interface ScheduleArray {
    date: Date,
    schedules: Array<ScheduleCardInfos>
}

export default function Schedulings({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Schedulings'>) {
    const [userId, setUserId] = useState<string>();
    const [schedules, setSchedules] = useState<Array<ScheduleArray>>([])
    const [filteredSchedules, setFilteredSchedules] = useState<Array<ScheduleArray>>([])
    const [displayDatePicker, setDisplayDatePicker] = useState<boolean>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [establishmentId, setEstablishmentId] = useState("")
    const [establishmentPicture, setEstablishentPicture] = useState("")
    useEffect(() => {
        setEstablishmentId(route.params.establishmentId)
        if (route.params.establishmentPhoto !== undefined && route.params.establishmentPhoto !== null && route.params.establishmentPhoto !== "") {
            setEstablishentPicture(route.params.establishmentPhoto)
        } else {
            setEstablishentPicture("../../assets/default-user-image.png")
        }
    }, [])
    const { data, loading, error } = useAllEstablishmentSchedules(establishmentId) // TODO: INTEGRATE WITH REAL ESTALBISHMENT ID

    function handleCalendarClick(data: DateData) {
        const date = new Date(data.dateString)

        setSelectedDate(date)
    }

    function clearFilters() {
        setSelectedDate(null)
    }

    useEffect(() => {
        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => setUserId(data.userId))
    }, [])

    useEffect(() => {
        if (!loading && data) {
            let newSchedulesArray: Array<{
                date: Date,
                schedules: Array<ScheduleCardInfos>
            }> = [];
            let newSchedules: Array<ScheduleCardInfos> = [];

            data.establishment.data?.attributes.courts.data.forEach(court => {
                court.attributes.court_availabilities.data.forEach(availability => {
                    availability.attributes.schedulings.data.forEach(schedule => {
                        console.log({ date: new Date(schedule.attributes.date) })
                        newSchedules.push({
                            id: schedule.id,
                            name: court.attributes.court_types.data.map(courtType => courtType.attributes.name).join(', '),
                            status: schedule.attributes.status,
                            endsAt: availability.attributes.endsAt.slice(0, 5),
                            startsAt: availability.attributes.startsAt.slice(0, 5),
                            date: new Date(schedule.attributes.date),
                            image: HOST_API + court.attributes.photo.data[0].attributes.url
                        })
                    })
                })
            })

            newSchedules.forEach((scheduleCard) => {
                const existingDateIndex = newSchedulesArray.findIndex(
                    (item) => item.date.getTime() === scheduleCard.date.getTime()
                );

                if (existingDateIndex !== -1) {
                    newSchedulesArray[existingDateIndex].schedules.push(scheduleCard);
                } else {
                    newSchedulesArray.push({
                        date: scheduleCard.date,
                        schedules: [scheduleCard],
                    });
                }
            });

            setSchedules(newSchedulesArray)
            setFilteredSchedules(newSchedulesArray)
        }
    }, [data])

    useEffect(() => {
        if (selectedDate) {
            const newFilteredSchedules = schedules.filter(schedule => {
                return schedule.date.toISOString() === selectedDate.toISOString()
            })
            setFilteredSchedules(newFilteredSchedules)
        } else {
            setFilteredSchedules(schedules)
        }
    }, [selectedDate, schedules])

    return (
        <View className=" h-full w-full pt-[20px] pl-[30px] pr-[30px]">
            <View className="w-full h-fit items-center justify-between flex flex-row">
                <Text className="font-black text-[16px]">Registro de reservas</Text>
                <TouchableOpacity onPress={clearFilters}>
                    <Text>Limpar filtros</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setDisplayDatePicker(!displayDatePicker)
                }}>
                    <Image source={require('../../assets/calendar_orange_icon.png')} />
                </TouchableOpacity>
            </View>



            {
                displayDatePicker &&
                <Calendar
                    current={new Date().toISOString()}
                    onDayPress={handleCalendarClick}
                />
            }

            {
                filteredSchedules.length > 0 ?
                    <ScrollView className="mt-[15px] h-full">
                        {
                            filteredSchedules.map(schedule => (
                                <CourtSchedulingContainer date={addDays(schedule.date, 1).toISOString()}>
                                    <View>
                                        {
                                            schedule.schedules.map(courtSchedule => (
                                                <CourtScheduling
                                                    id={courtSchedule.id}
                                                    name={courtSchedule.name}
                                                    startsAt={courtSchedule.startsAt}
                                                    endsAt={courtSchedule.endsAt}
                                                    status={courtSchedule.status}
                                                    image={courtSchedule.image}
                                                    establishmentId={establishmentId}
                                                    establishmentPicture={establishmentPicture}
                                                />
                                            ))
                                        }
                                    </View>
                                </CourtSchedulingContainer>
                            ))
                        }
                    </ScrollView>
                    :
                    <View className='flex-1 flex justify-center items-center'>
                        <Text className='text-base font-bold'>Nenhuma reserva encontrada</Text>
                    </View>
            }

            {
                userId ?
                    <View className={`absolute bottom-0 left-0 right-0`}>
                        <BottomBlackMenuEstablishment
                            screen="Schedule"
                            userID={userId ? userId : ""}
                            establishmentLogo={route?.params?.establishmentPhoto}
                            establishmentID={route?.params?.establishmentId}
                            key={1}
                            paddingTop={2}
                        />
                    </View>
                    :
                    null
            }
        </View>
    )
}