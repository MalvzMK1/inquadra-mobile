import { View, Text, ScrollView, Modal, Image } from "react-native"
import React, { useState } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import WeekDayButton from "../../components/WeekDays";
import { Calendar } from 'react-native-calendars'
import { getWeekDays } from "../../utils/getWeekDates";
import { DateData } from "react-native-calendars"
import { addDays, format, getWeek } from 'date-fns'
import AddCourtSchedule from "../../components/AddCourtSchedule";
import { SelectList } from 'react-native-dropdown-select-list'
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import CourtSlideButton from "../../components/CourtSlideButton";
import MaskInput, { Masks } from "react-native-mask-input";
import { TextInputMask } from 'react-native-masked-text';
import { Button } from "react-native-paper";
import ScheduleBlockDetails from "../../components/ScheduleBlockDetails";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import useCourtAvailability from "../../hooks/useCourtAvailability";
import storage from "../../utils/storage";
import useCourtsByEstablishmentId from "../../hooks/useCourtsByEstablishmentId";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";

let userId = ""

storage.load<UserInfos>({
    key: 'userInfos',
}).then((data) => {
    userId = data.userId
})

const currentDate = new Date()
const currentDay = currentDate.getDay()
const currentMonth = currentDate.getMonth()
const portugueseMonths = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const courts = [
    { value: 'Quadra Fênix' },
    { value: 'Clube do Zeca' },
    { value: 'Society 21' }
]

export default function CourtSchedule({ navigation, route }: NativeStackScreenProps<RootStackParamList, "CourtSchedule">) {
    const [showCalendar, setShowCalendar] = useState(false)
    const [dateSelected, setDateSelected] = useState<Date>(new Date())
    const [selectedWeekDate, setSelectedWeekDate] = useState<WeekDays>()

    const [showAll, setShowAll] = useState(false)
    const [schedulingsFocus, setSchedulingsFocus] = useState(true)
    const [schedulingsHistoricFocus, setSchedulingsHistoricFocus] = useState(false)
    const [selectedCourt, setSelectedCourt] = useState("")
    const [blockScheduleModal, setBlockScheduleModal] = useState(false)
    const closeBlockScheduleModal = () => setBlockScheduleModal(false)
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [confirmBlockSchedule, setConfirmBlockSchedule] = useState(false)
    const closeConfirmBlockScheduleModal = () => setConfirmBlockSchedule(false)
    const [blockScheduleDetailsModal, setBlockScheduleDetailsModal] = useState(false)
    const closeBlockScheduleDetailsModal = () => setBlockScheduleDetailsModal(false)

    const { data: userByEstablishmentData, error: userByEstablishmentError, loading: userByEstablishmentLoading } = useGetUserEstablishmentInfos(userId)
    const { data: courtsByEstablishmentIdData, error: courtsByEstablishmentIdError, loading: courtsByEstablishmentIdLoading } = useCourtsByEstablishmentId(userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.id)
    // const {data: courtAvailabilityData, error: courtAvailabilityError, loading: courtAvailabilityLoading} = useCourtAvailability("1")
    const { data: schedulesData, error: schedulesError, loading: schedulesLoading } = useAllEstablishmentSchedules(userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.id)

    interface IEstablishmentSchedules {
        courtId: string
        courtName: string
        startsAt: string
        endsAt: string
        weekDay: string
        scheduling: {
            schedulingId: string,
            schedulingDate: string,
            schedulingStatus: boolean
        }
    }

    let establishmentSchedules: IEstablishmentSchedules[] = []
    schedulesData?.establishment.data?.attributes.courts.data.map(courtItem => {
        courtItem.attributes.court_availabilities.data.map(courtAvailabilitieItem => {
            courtAvailabilitieItem.attributes.schedulings.data.map(schedulingItem => {
                establishmentSchedules = [...establishmentSchedules, {
                    courtId: courtItem.id,
                    courtName: courtItem.attributes.name,
                    startsAt: courtAvailabilitieItem.attributes.startsAt,
                    endsAt: courtAvailabilitieItem.attributes.endsAt,
                    weekDay: courtAvailabilitieItem.attributes.weekDay,
                    scheduling: {
                        schedulingId: schedulingItem.id,
                        schedulingDate: schedulingItem.attributes.date,
                        schedulingStatus: schedulingItem.attributes.status
                    }
                }]
            })
        })
    })

    establishmentSchedules.map(item => {
        console.log(item.weekDay)
    })

    if (userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes.photo) {
        navigation.setParams({
            establishmentPhoto: userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes.photo
        })
    }

    const [activeStates, setActiveStates] = useState(Array(establishmentSchedules.length).fill(false))
    const [shownSchedules, setShownScedules] = useState<IEstablishmentSchedules[]>([])
    const weekDates: FormatedWeekDates[] = getWeekDays(dateSelected)

    weekDates.map(item => {
        // console.log(item)
    })

    function handleWeekDayClick(index: number) {
        const schedules = establishmentSchedules

        const newActiveStates = Array(establishmentSchedules.length).fill(false);
        newActiveStates[index] = true;
        setActiveStates(newActiveStates);

        setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays)
        if (schedules)
            setShownScedules(establishmentSchedules.filter(availabilitie =>
                availabilitie.weekDay === weekDates[index].dayName as unknown as WeekDays
            ))
    }

    function handleCalendarClick(data: DateData) {
        const date = new Date(data.dateString)
        const weekDay = format(addDays(date, 1), 'eeee')

        setDateSelected(date)
        setSelectedWeekDate(weekDay as WeekDays)
    }

    return (
        <View className="h-full w-full">

            <View className="w-full h-fit flex-col mt-[15px] pl-[25px] pr-[25px]">
                <View className="flex-row w-full justify-between items-center">
                    <Text className="font-black text-[20px] text-[#292929]">{dateSelected.toISOString().split("T")[0].split("-")[2]} {portugueseMonths[dateSelected.getMonth()]}</Text>
                    <TouchableOpacity onPress={() => setBlockScheduleModal(!blockScheduleModal)} className="h-fit w-fit justify-center items-center bg-[#FF6112] p-[10px] rounded-[4px]">
                        <Text className="font-bold text-[12px] text-white">Bloquear agenda</Text>
                    </TouchableOpacity>
                </View>

                {!showCalendar && (
                    <View className="h-fit w-full items-center justify-around flex flex-row mt-[30px]">
                        {
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
                        }
                    </View>
                )}

                {showCalendar && (
                    <Calendar
                        className="h-fit mt-[30px] p-[12px]"
                        current={new Date().toDateString()}
                        onDayPress={handleCalendarClick}
                        markedDates={{
                            [dateSelected.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
                        }}
                    />
                )}
            </View>

            <View className="w-full h-fit pl-[25px] pr-[25px] flex flex-row items-center justify-between">
                <Text className="text-[16px] text-[#292929] font-black">15/04 - Quinta-feira</Text>
                <TouchableOpacity
                    onPress={() => setShowCalendar(!showCalendar)}
                    className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px] ml-[10px]"
                />
                <View className="flex flex-row items-center gap-x-[5px]">
                    <View className="flex flex-row items-center gap-x-[3px]">
                        <View className="h-[10px] w-[10px] bg-[#FF6112] rounded-[3px]"></View>
                        <Text className="text-[10px] text-black font-light">Reservada</Text>
                    </View>

                    <View className="flex flex-row items-center gap-x-[3px]">
                        <View className="h-[10px] w-[10px] bg-[#4D4D4D] rounded-[3px]"></View>
                        <Text className="text-[10px] text-black font-light">Disponível</Text>
                    </View>
                </View>
            </View>

            {/* ${showAll ? "max-h-[350px]" : "max-h-fit"} */}

            <View className={`${showAll ? "max-h-[350px]" : "max-h-fit"}`}>
                <ScrollView className={`pl-[25px] pr-[40px] mt-[15px] w-full`}>

                    {
                        shownSchedules && shownSchedules.map((scheduleItem) => {
                            const startsAt = scheduleItem.startsAt.split(":")
                            const endsAt = scheduleItem.endsAt.split(":")

                            return (
                                <AddCourtSchedule
                                    name={scheduleItem.courtName}
                                    startsAt={`${startsAt[0]}:${startsAt[1]}h`}
                                    endsAt={`${endsAt[0]}:${endsAt[1]}h`}
                                    isReserved={true}
                                />
                            )
                        })
                    }

                </ScrollView>
            </View>

            <View className="pl-[25px] pr-[40px] justify-center items-center opacity-50">
                <TouchableOpacity onPress={() => setShowAll(!showAll)} className="bg-[#787878] h-[4px] w-[50px] mt-[10px] rounded-[5px]"></TouchableOpacity>
            </View>

            <View className="pl-[25px] w-full h-fit flex flex-row mt-[10px]">
                <Text onPress={() => {
                    setSchedulingsFocus(true)
                    setSchedulingsHistoricFocus(false)
                }}
                    className={`font-black text-[16px] ${schedulingsFocus ? "text-black" : "text-[#292929]" && "opacity-40"} ${schedulingsFocus ? "border-b-[1px]" : ""}`}>
                    Reservas
                </Text>

                <Text
                    onPress={() => {
                        setSchedulingsHistoricFocus(true)
                        setSchedulingsFocus(false)
                    }}
                    className={`font-black text-[16px] ml-[10px] ${schedulingsHistoricFocus ? "text-black" : "text-[#292929]" && "opacity-40"} ${schedulingsHistoricFocus ? "border-b-[1px]" : ""}`}>
                    Histórico de reservas
                </Text>
            </View>

            {schedulingsFocus && (
                <View className="pl-[25px] pr-[40px] mt-[15px] mb-[10px] w-full rounded-[4px] bg-[#F0F0F0] flex flex-row items-center justify-between">
                    <View className="flex flex-row">
                        <Text className="font-bold text-[12px] text-black">Próximos 7 dias</Text>
                    </View>

                    <SelectList
                        setSelected={(val: string) => {
                            setSelectedCourt(val)
                        }}
                        data={courts}
                        save="value"
                        placeholder='Selecione uma quadra'
                        searchPlaceholder='Pesquisar...'
                    />

                </View>
            )}

            <BottomNavigationBar
                isDisabled={false}
                establishmentScreen={true}
                playerScreen={false}
            />

            <Modal visible={blockScheduleModal} animationType="fade" transparent={true} onRequestClose={closeBlockScheduleModal}>
                <View className="h-full w-full justify-center items-center">
                    <View className="h-fit w-[350px] bg-white rounded-[5px] items-center">

                        <View className="w-[60%] justify-center items-center mt-[15px]">
                            <Text className="font-bold text-[14px] text-center">Escolha a quadra que deseja bloquear agenda?</Text>
                        </View>

                        <View className="flex flex-row flex-wrap w-full justify-evenly">

                            {courtsByEstablishmentIdData && courtsByEstablishmentIdData.establishment.data.attributes.courts.data.map(courtItem => (
                                <CourtSlideButton 
                                    name={courtItem.attributes.name}
                                />
                            ))}

                        </View>

                        <View className='flex flex-row pl-[15px] pr-[15px] w-full'>
                            <View className='flex-1 mr-[6px]'>
                                <Text className='text-sm text-[#FF6112]'>A partir de:</Text>

                                <View className="flex flex-row items-center justify-between border border-neutral-400 rounded p-3">
                                    <TextInputMask
                                        className='w-[80%] bg-white'
                                        options={{
                                            format: 'DD/MM'
                                        }}
                                        type={'datetime'}
                                        placeholder='DD/MM'
                                        value={startsAt}
                                        onChangeText={setStartsAt}>
                                    </TextInputMask>
                                    <Image source={require('../../assets/calendar_gray_icon.png')}></Image>
                                </View>

                            </View>

                            <View className='flex-1 ml-[6px]'>
                                <Text className='text-sm text-[#FF6112]'>Até:</Text>

                                <View className="flex flex-row items-center justify-between border border-neutral-400 rounded p-3">
                                    <TextInputMask
                                        className='w-[80%] bg-white'
                                        placeholder='DD/MM'
                                        options={{
                                            format: 'DD/MM'
                                        }}
                                        type={'datetime'}
                                        value={endsAt}
                                        onChangeText={setEndsAt}>
                                    </TextInputMask>
                                    <Image source={require('../../assets/calendar_gray_icon.png')}></Image>
                                </View>

                            </View>

                        </View>

                        <View className="w-full h-fit mt-[20px] mb-[20px] justify-center items-center">
                            <Button onPress={() => {
                                closeBlockScheduleModal()
                                setBlockScheduleDetailsModal(true)
                            }} className='h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center'>
                                <Text className="w-full h-full font-medium text-[16px] text-white">Salvar</Text>
                            </Button>
                        </View>

                    </View>
                </View>
            </Modal>

            <Modal visible={confirmBlockSchedule} animationType="fade" transparent={true} onRequestClose={closeConfirmBlockScheduleModal}>
                <View className="h-full w-full justify-center items-center">
                    <View className="h-[256px] w-[350px] bg-white rounded-[5px] items-center justify-center">
                        <View className=" items-center justify-evenly h-[80%]">
                            <Text className="font-bold text-[14px] text-center">Agenda bloqueada com sucesso</Text>
                            <Image source={require('../../assets/orange_logo_inquadra.png')}></Image>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={blockScheduleDetailsModal} animationType="fade" transparent={true} onRequestClose={closeBlockScheduleDetailsModal}>
                <View className="h-full w-full justify-center items-center">
                    <View className="h-[256px] w-[350px] bg-white rounded-[5px] items-center">
                        <Text className="font-bold text-[14px] mt-[30px]">DETALHES DA RESERVA</Text>

                        <ScheduleBlockDetails
                            userName="Lucas Santos"
                            courtType="Basquete"
                            startsAt="15:00h"
                            endsAt="16:00h"
                            payedStatus={true}
                        />

                        <View className="w-full h-fit mt-[35px] mb-[20px] justify-center items-center pl-[40px] pr-[40px]">
                            <Button onPress={() => {
                                closeBlockScheduleDetailsModal()
                                setConfirmBlockSchedule(true)
                            }} className='h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center'>
                                <Text className="w-full h-full font-medium text-[16px] text-white">Fechar</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}