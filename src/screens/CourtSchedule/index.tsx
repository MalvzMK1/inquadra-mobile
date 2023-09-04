import { View, Text, ScrollView, Modal, Image, ActivityIndicator } from "react-native"
import React, { useEffect, useState } from 'react'
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
import { Button } from "react-native-paper";
import ScheduleBlockDetails from "../../components/ScheduleBlockDetails";
import { useGetUserEstablishmentInfos } from "../../hooks/useGetUserEstablishmentInfos";
import storage from "../../utils/storage";
import useCourtsByEstablishmentId from "../../hooks/useCourtsByEstablishmentId";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { schedulingByDateQuery } from "../../graphql/queries/schedulingByDate";
import { ISchedulingByDateResponse, ISchedulingByDateVariables } from "../../graphql/queries/schedulingByDate";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from "react-hook-form"

import { BarChart, Grid } from 'react-native-svg-charts'
import ScheduleChartLabels from "../../components/ScheduleChartLabels";
import { useApolloClient } from "@apollo/client";
import useBlockSchedule from "../../hooks/useBlockSchedule";

let userId = ""

storage.load<UserInfos>({
    key: 'userInfos',
}).then((data) => {
    userId = data.userId
})

const portugueseMonths = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

interface IBlockScheduleFormData {
    initialDate: string
    endDate: string
}

const blockScheduleFormSchema = z.object({
    initialDate: z.string()
        .nonempty("Insira pelo menos uma data inicial!")
        .min(10, "Insira uma data válida!"),
    endDate: z.string()
    // .min(10, "Insira uma data válida!")
})

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
    const [blockSchedule, { data: blockScheduleData, error: blockScheduleError, loading: blockScheduleLoading }] = useBlockSchedule()

    const { control, handleSubmit, formState: { errors } } = useForm<IBlockScheduleFormData>({
        resolver: zodResolver(blockScheduleFormSchema)
    })

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

    interface ICourts {
        id: string
        name: string
    }
    let allCourts: ICourts[] = []

    let courtNames: string[] = []
    if (!courtsByEstablishmentIdLoading)
        courtsByEstablishmentIdData?.establishment.data.attributes.courts.data.map(courtItem => {
            courtNames.push(courtItem.attributes.name)
            allCourts = [...allCourts, { id: courtItem.id, name: courtItem.attributes.name }]
        })

    const today = new Date()
    let nextWeekArray: string[] = []

    for (let i = 1; i <= 7; i++) {
        const nextWeek = addDays(today, i).toISOString().split("T")[0]
        nextWeekArray = [...nextWeekArray, nextWeek]
    }

    if (userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes.photo) {
        navigation.setParams({
            establishmentPhoto: userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes.photo
        })
    }

    let weekDates: FormatedWeekDates[] = []
    if (dateSelected)
        weekDates = getWeekDays(dateSelected)
    else
        weekDates = getWeekDays(today)
    interface IActiveState {
        active: boolean
        date: string
    }
    const [activeStates, setActiveStates] = useState<IActiveState[]>([])
    // console.log(activeStates)
    interface IActiveCourt {
        active: boolean
        id: string
    }
    const [activeCourts, setActiveCourts] = useState<IActiveCourt[]>([])
    console.log(activeCourts)

    useEffect(() => {
        let newActiveStates: IActiveState[] = []
        weekDates.map(weekDayItem => {
            newActiveStates = [...newActiveStates, {
                active: false,
                date: weekDayItem.date.toISOString().split("T")[0]
            }]
        })
        setActiveStates(newActiveStates)

        let newActiveCourts: IActiveCourt[] = []
        allCourts.map(courtItem => {
            newActiveCourts = [...newActiveCourts, {
                active: false,
                id: courtItem.id
            }]
        })
        setActiveCourts(newActiveCourts)
    }, [])

    const [shownSchedules, setShownSchedules] = useState<IEstablishmentSchedules[]>([])

    function handleWeekDayClick(index: number) {
        const schedules = establishmentSchedules

        let newActiveStates: IActiveState[] = []
        weekDates.map(weekDayItem => {
            newActiveStates = [...newActiveStates, {
                active: false,
                date: weekDayItem.date.toISOString().split("T")[0]
            }]
        })
        newActiveStates[index] = {
            active: true,
            date: weekDates[index].date.toISOString().split("T")[0]
        }
        setActiveStates(newActiveStates)
        // const newActiveStates = ;
        // newActiveStates[index] = true;
        // setActiveStates(newActiveStates);

        // let teste = weekDates[index].date
        // console.log(teste)
        // setDateSelected(new Date(teste))

        setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays)
        if (schedules)
            setShownSchedules(establishmentSchedules.filter(scheduleItem =>
                scheduleItem.scheduling.schedulingDate === weekDates[index].date.toISOString().split("T")[0]
            ))
    }

    async function handleCalendarClick(data: DateData) {
        const date = new Date(data.dateString)
        const weekDay = format(addDays(date, 1), 'eeee')

        setDateSelected(date)

        let newActiveStates: IActiveState[] = []
        await Promise.all(weekDates.map(weekDayItem => {
            newActiveStates = [...newActiveStates, {
                active: false,
                date: weekDayItem.date.toISOString().split("T")[0]
            }]
        }))

        const index = newActiveStates.findIndex(activeItem => activeItem.date == date.toISOString().split("T")[0])
        newActiveStates[index] = {
            active: true,
            date: weekDates[index].date.toISOString().split("T")[0]
        }

        setActiveStates(newActiveStates)

        const schedules = establishmentSchedules
        if (schedules)
            setShownSchedules([])
        setShownSchedules(establishmentSchedules.filter(scheduleItem =>
            scheduleItem.scheduling.schedulingDate === weekDates[index].date.toISOString().split("T")[0]
        ))
    }

    // const [selectedCourts, setSelectedCourts] = useState("")
    const [blockedCourtId, setBlockedCourtId] = useState<string>("")
    function handleSelectedCourt(index: number) {
        let newActiveCourts: IActiveCourt[] = []
        allCourts.map(courtItem => {
            newActiveCourts = [...newActiveCourts, {
                active: false,
                id: courtItem.id
            }]
        })
        newActiveCourts[index] = {
            active: true,
            id: allCourts[index].id
        }
        const selectedCourtId = newActiveCourts.find(courtItem => courtItem.active === true)
        setBlockedCourtId(selectedCourtId?.id)
        setActiveCourts(newActiveCourts)
    }

    interface ISchedulingsByDate {
        date: string
        scheduling_quantity: number | undefined
    }
    const [selectedCourtId, setSelectedCourtId] = useState("0")
    const [schedulingsJson, setSchedulingsJson] = useState<ISchedulingsByDate[]>([])
    const apolloClient = useApolloClient()

    const handleNextSchedules = async (selectedCourt: string) => {
        const foundCourt = allCourts.find(courtItem => courtItem.name === selectedCourt)
        if (!foundCourt) return
        setSelectedCourtId(foundCourt.id)

        if (parseFloat(foundCourt.id) > 0) {
            let scheduleInfoArray = await Promise.all(nextWeekArray.map(async (item) => {
                const { data: scheduleByDateData, error: scheduleByDateError, loading: scheduleByDateLoading } = await apolloClient.query<ISchedulingByDateResponse, ISchedulingByDateVariables>({
                    query: schedulingByDateQuery,
                    variables: {
                        date: {
                            eq: item
                        },
                        court_id: {
                            eq: foundCourt.id
                        }
                    }
                })

                return {
                    date: item,
                    scheduling_quantity: scheduleByDateData?.schedulings.data?.length
                }
            }))

            setSchedulingsJson(scheduleInfoArray)
        }

    }

    const fill = 'rgba(255, 97, 18, 1)'
    let data: number[] = []
    schedulingsJson.forEach(item => {
        data.push(item.scheduling_quantity)
    })
    const maxValue = Math.max.apply(null, data)
    const sumValues = (array: number[]): number => {
        let sum = 0
        for (let i = 0; i < array.length; i++)
            sum += array[i]
        return sum
    }
    const sumValuesTotal: number = sumValues(data)

    const [isLoading, setIsLoading] = useState(false)

    function getDatesRange(initialDate: string, endDate: string) {
        const dates: string[] = []

        let separatedInitialDate = initialDate.split("/")
        const formatedInitialDate = `${separatedInitialDate[2]}-${separatedInitialDate[1]}-${separatedInitialDate[0]}`
        const initial = new Date(formatedInitialDate)

        if (endDate == "") {
            dates.push(new Date(initial).toISOString().split("T")[0])
            return dates
        }
        else {
            let separatedEndDate = endDate.split("/")
            const formatedEndDate = `${separatedEndDate[2]}-${separatedEndDate[1]}-${separatedEndDate[0]}`
            const end = new Date(formatedEndDate)

            while (initial <= end) {
                dates.push(new Date(initial).toISOString().split("T")[0])
                initial.setDate(initial.getDate() + 1)
            }

            return dates
        }
    }

    async function setSchedulingsByDates(dates: string[], courtId: string) {
        let schedulingsByDatesArray = await Promise.all(dates.map(async (dateItem) => {
            const { data: scheduleByDateData, error: scheduleByDateError, loading: scheduleByDateLoading } = await apolloClient.query<ISchedulingByDateResponse, ISchedulingByDateVariables>({
                query: schedulingByDateQuery,
                variables: {
                    date: {
                        eq: dateItem
                    },
                    court_id: {
                        eq: courtId
                    }
                }
            })

            if (scheduleByDateData != undefined)
                return scheduleByDateData
        }))

        let schedulingsByDateObject = schedulingsByDatesArray.map(item => {
            if (JSON.stringify(item?.schedulings.data) != "[]")
                return item?.schedulings.data
        })

        interface I {
            schedulingId: number
        }
        let schedulingsByDateJson: I[] = []
        schedulingsByDateObject?.forEach(item => {
            if (item != undefined) {
                item.map(item2 => {
                    schedulingsByDateJson = [...schedulingsByDateJson, {
                        schedulingId: item2.id
                    }]
                })
            }
        })

        return schedulingsByDateJson
    }

    async function handleBlockSchedule(data: IBlockScheduleFormData) {
        setIsLoading(true)

        const blockScheduleData = {
            ...data
        }

        const datesRange = getDatesRange(blockScheduleData.initialDate, blockScheduleData.endDate)
        const courtId = blockedCourtId
        const schedulingsByDate = await setSchedulingsByDates(datesRange, courtId)

        if(courtId != "") {
            if (schedulingsByDate.length > 0) {
                try {
                    await Promise.all(schedulingsByDate.map(async (item) => {
                        await blockSchedule({
                            variables: {
                                scheduling_id: item.schedulingId.toString()
                            }
                        })
                    }))
                    console.log("FOI KCT")
                    setIsLoading(false)
                } catch (error) {
                    console.log("Deu ruim patrão", error)
                    setIsLoading(false)
                }
            } else {
                alert("Não há nenhuma reserva nesse intervalo de datas!")
                setIsLoading(false)
            }
        } else {
            alert("Selecione uma quadra para bloquear a agenda!")
            setIsLoading(false)
        }

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
                                    active={activeStates[index].active}
                                    // active={false}
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
                <Text className="text-[16px] text-[#292929] font-black">{dateSelected.toISOString().split("T")[0].split("-")[2]}/{dateSelected.toISOString().split("T")[0].split("-")[1]} - Quinta-feira</Text>
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
                <View className="pl-[25px] pr-[40px] mt-[15px] mb-[10px] w-fit h-fit">
                    <View className="w-full rounded-[4px] flex flex-row items-center justify-between">
                        <View className="flex flex-row">
                            <Text className="font-bold text-[12px] text-black">Próximos 7 dias</Text>
                        </View>

                        <SelectList
                            onSelect={() => handleNextSchedules(selectedCourt)}
                            setSelected={(val: string) => {
                                setSelectedCourt(val)
                            }}
                            data={courtNames}
                            save="value"
                            placeholder='Selecione uma quadra'
                            searchPlaceholder='Pesquisar...'
                            dropdownTextStyles={{ color: "#FF6112" }}
                            inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                            closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                            searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                            arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}
                        />
                    </View>

                    <View>
                        <Text className="font-bold text-[6px] w-[30px]">
                            Qtd. reservas
                        </Text>

                        <Text className="font-bold text-[9px]">
                            {sumValuesTotal}
                        </Text>
                    </View>

                    {maxValue > 0 && (
                        <BarChart
                            style={{ height: 200 }}
                            data={data}
                            svg={{ fill }}
                            contentInset={{ top: 20, bottom: 10 }}
                            spacing={0.2}
                            gridMin={0}
                        >
                            <Grid
                                direction={Grid.Direction.HORIZONTAL}
                            />
                            <ScheduleChartLabels
                                data={data}
                                maxValue={maxValue}
                                x={(index) => index}
                                y={(value) => value}
                                bandwidth={0}
                            />
                        </BarChart>
                    )}

                    {maxValue == 0 && (
                        <View className="h-[100px] flex items-center justify-center">
                            <Text className="text-[16px] font-bold">Não há reservas para os próximos 7 dias.</Text>
                        </View>
                    )}

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

                            {courtsByEstablishmentIdData && courtsByEstablishmentIdData.establishment.data.attributes.courts.data.map((courtItem, index) => {
                                return (
                                    <CourtSlideButton
                                        name={courtItem.attributes.name}
                                        onClick={(isClicked) => {
                                            handleSelectedCourt(index)
                                        }}
                                        active={activeCourts[index].active}
                                        // active={false}
                                    />
                                )
                            })}

                        </View>

                        <View className='flex flex-row pl-[15px] pr-[15px] w-full'>
                            <View className='flex-1 mr-[6px]'>
                                <Text className='text-sm text-[#FF6112]'>A partir de:</Text>

                                <View className={`flex flex-row items-center justify-between border ${errors.initialDate ? "border-red-400" : "border-gray-400"} rounded p-3`}>
                                    <Controller
                                        name="initialDate"
                                        control={control}
                                        rules={{
                                            required: true,
                                            minLength: 25
                                        }}
                                        render={({ field: { onChange } }) => (
                                            <MaskInput
                                                className={`w-[80%] bg-white `}
                                                placeholder='DD/MM'
                                                value={startsAt}
                                                onChangeText={(masked, unmasked) => {
                                                    onChange(masked)
                                                    setStartsAt(unmasked)
                                                }}
                                                mask={Masks.DATE_DDMMYYYY}
                                            >
                                            </MaskInput>
                                        )}
                                    />
                                    <Image source={require('../../assets/calendar_gray_icon.png')}></Image>
                                </View>
                                {errors.initialDate && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.initialDate.message}</Text>}

                            </View>

                            <View className='flex-1 ml-[6px]'>
                                <Text className='text-sm text-[#FF6112]'>Até:</Text>

                                <View className={`flex flex-row items-center justify-between border ${errors.endDate ? "border-red-400" : "border-gray-400"} rounded p-3`}>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        rules={{
                                            required: false
                                        }}
                                        render={({ field: { onChange } }) => (
                                            <MaskInput
                                                className={`w-[80%] bg-white `}
                                                placeholder='DD/MM'
                                                value={endsAt}
                                                onChangeText={(masked, unmasked) => {
                                                    onChange(masked)
                                                    setEndsAt(unmasked)
                                                }}
                                                mask={Masks.DATE_DDMMYYYY}
                                            >
                                            </MaskInput>
                                        )}
                                    />
                                    <Image source={require('../../assets/calendar_gray_icon.png')}></Image>
                                </View>
                                {errors.endDate && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.endDate.message}</Text>}

                            </View>

                        </View>

                        <View className="w-full h-fit mt-[20px] mb-[20px] justify-center items-center">
                            <Button onPress={handleSubmit(handleBlockSchedule)} className='h-[40px] w-[80%] rounded-md bg-orange-500 flex tems-center justify-center'>
                                <Text className="w-full h-full font-medium text-[16px] text-white">{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Salvar'}</Text>
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