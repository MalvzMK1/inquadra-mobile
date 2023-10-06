import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import FilterDropdown from '../FilterDropdown'
import Animated, {
    FadeOut,
    FadeIn
} from 'react-native-reanimated'
import { Button, Checkbox } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import FilterDate from '../FilterDate'
import useFilters from '../../hooks/useFilters'


export default function FilterComponent(props: {
    setFilter: any,
    filter: {
        amenities: string[] | [],
        dayUseService: boolean | undefined,
        endsAt: string | undefined,
        startsAt: string | undefined,
        weekDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | undefined,
        date: Date | undefined
    }
}) {

    const date = new Date()

    const getWeekDay = (diaSemana: number) => {
        switch (diaSemana) {
            case 0:
                return 'Sunday'
            case 1:
                return 'Monday'
            case 2:
                return 'Tuesday'
            case 3:
                return 'Wednesday'
            case 4:
                return 'Thursday'
            case 5:
                return 'Friday'
            case 6:
                return 'Saturday'
        }
    }

    const getNumberArrayWeekDay = (diaSemana: string): number | undefined => {
        switch (diaSemana) {
            case 'Sunday':
                return 0
            case 'Monday':
                return 1
            case 'Tuesday':
                return 2
            case 'Wednesday':
                return 3
            case 'Thursday':
                return 4
            case 'Friday':
                return 5
            case 'Saturday':
                return 6
        }
    }

    const [dateSelector, setDateSelector] = useState(props.filter.date ? props.filter.date.toISOString() : "__/__/____")
    const [amenities, setAmenities] = useState<Array<string> | null>(props.filter.amenities)
    const [dayUseYes, setDayUseYes] = useState<boolean | undefined>(props.filter.dayUseService)
    const [timeInit, setTimeInit] = useState(props.filter.startsAt ? new Date(date.setHours(parseInt(props.filter.startsAt.split(":")[0]), parseInt(props.filter.startsAt.split(":")[1]))) : new Date(date.setHours(0, 0, 0, 0)))
    const [timeFinal, setTimeFinal] = useState(props.filter.endsAt ? new Date(date.setHours(parseInt(props.filter.endsAt.split(":")[0]), parseInt(props.filter.endsAt.split(":")[1]))) : new Date(date.setHours(0, 0, 0, 0)))
    const [weekDay, setWeekDay] = useState<number | undefined>(props.filter.weekDay ? getNumberArrayWeekDay(props.filter.weekDay) : undefined)
    const [showTimeInitPicker, setShowTimeInitPicker] = useState(false)
    const [showTimeFinalPicker, setShowTimeFinalPicker] = useState(false)
    const [filter, setFilter] = useState<{
        amenities: string[] | [],
        dayUseService: boolean | undefined,
        endsAt: string | undefined,
        startsAt: string | undefined,
        weekDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" | undefined
        date: Date | undefined 
    }>({
        amenities: [],
        dayUseService: undefined,
        endsAt: undefined,
        startsAt: undefined,
        weekDay: undefined,
        date: undefined
    })

    useEffect(() => {
        setFilter({
            amenities: amenities !== null ? amenities : [],
            dayUseService: dayUseYes,
            startsAt: timeInit.toLocaleTimeString() + ".00" !== "00:00:00.00" && timeInit ? timeInit.toLocaleTimeString() + ".00" : undefined,
            endsAt: timeFinal.toLocaleTimeString() + ".00" !== "00:00:00.00" && timeFinal ? timeFinal.toLocaleTimeString() + ".00" : undefined,
            weekDay: weekDay ? getWeekDay(weekDay) : undefined,
            date: dateSelector !== "__/__/____" ? new Date(dateSelector.split("T")[0]) : undefined
        })
    }, [amenities, dayUseYes, timeFinal, timeInit, weekDay])

    const handleTimeInitPicker = () => {
        setShowTimeInitPicker(true)
    }
    const handleTimeInitChange = (event: object, selectedTime: any) => {
        setShowTimeInitPicker(false)
        if (selectedTime) {
            setTimeInit(selectedTime)
        }
    }
    const handleTimeFinalPicker = () => {
        setShowTimeFinalPicker(true)
    }
    const handleTimeFinalChange = (event: object, selectedTime: any) => {
        setShowTimeFinalPicker(false)
        if (selectedTime) {
            setTimeFinal(selectedTime)
        }
    }


    return (
        <>
            <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className='bg-[#292929E5] opacity-90 z-10 w-screen h-screen'></Animated.View>
            <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className='absolute z-10 items-center w-full h-5/6'>
                <ScrollView className='flex flex-col gap-y-4 h-full w-3/4 pt-9'>
                    <FilterDropdown amenities={amenities} setAmenities={setAmenities} />
                    <FilterDate setWeekDay={setWeekDay} dateSelector={dateSelector} setDateSelector={setDateSelector} />

                    <View className='flex flex-row justify-between'>
                        <View className='w-[41%]'>
                            <Text className='font-semibold text-white text-base'>
                                Início
                            </Text>
                            <Button
                                className='rounded'
                                onPress={handleTimeInitPicker}
                                buttonColor='#FFFFFF'
                                textColor='black'
                                style={{ borderColor: "#FF6112", borderWidth: 1, padding: 10 }}
                            >
                                <Text className='text-sm'>
                                    {timeInit.toLocaleTimeString().slice(0, 5)}
                                </Text>
                            </Button>
                            {showTimeInitPicker && (
                                <DateTimePicker
                                    value={timeInit}
                                    mode="time"
                                    onChange={handleTimeInitChange}
                                />
                            )}

                        </View>
                        <View className='w-[41%]'>
                            <Text className='font-semibold text-white text-base'>
                                Final
                            </Text>
                            <Button
                                className='rounded w-full'
                                onPress={handleTimeFinalPicker}
                                buttonColor='#FFFFFF'
                                textColor='black'
                                style={{ borderColor: "#FF6112", borderWidth: 1, padding: 10 }}
                            >
                                <Text className='text-sm'>
                                    {timeFinal.toLocaleTimeString().slice(0, 5)}
                                </Text>
                            </Button>
                            {showTimeFinalPicker && (
                                <DateTimePicker
                                    value={timeFinal}
                                    mode="time"
                                    onChange={handleTimeFinalChange}
                                />
                            )}
                        </View>
                    </View>
                    <View className='flex items-center justify-between pt-3'>
                        <View className='flex flex-row items-center'>
                            <Text className='font-semibold text-white text-base'>Day-Use</Text>
                            <View className='flex flex-row gap-[22px]'>
                                <View className='flex flex-row items-center'>
                                    <Checkbox
                                        uncheckedColor='#FF6112'
                                        color='#FF6112'
                                        status={dayUseYes ? "checked" : "unchecked"}
                                        onPress={() => {
                                            if (dayUseYes) {
                                                setDayUseYes(false);
                                            } else {
                                                setDayUseYes(true);
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <Button
                            className='rounded w-full'
                            buttonColor='#FF6112'
                            textColor='white'
                            style={{ marginTop: 15, marginBottom: 10 }}
                            onPress={() => {
                                props.setFilter(filter)
                            }}
                        >
                            <Text className='font-medium text-base'>
                                Filtrar
                            </Text>
                        </Button>
                        <TouchableOpacity className='flex flex-row self-center gap-x-1 mb-8'
                            onPress={() => {
                                setTimeInit(new Date(date.setHours(0, 0, 0, 0)))
                                setTimeFinal(new Date(date.setHours(0, 0, 0, 0)))
                                setDayUseYes(undefined)
                                setAmenities([])
                                setDateSelector(`__/__/____`)
                                setWeekDay(undefined)
                                props.setFilter({
                                    amenities: [],
                                    dayUseService: undefined,
                                    endsAt: undefined,
                                    startsAt: undefined,
                                    weekDay: undefined
                                })
                            }}
                        >
                            <Text className='font-semibold text-white border-white border-b-[0.5px] border-solid'>
                                Limpar Filtros
                            </Text>
                            <Text className='text-white font-semibold'>
                                X
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animated.View>
        </>
    )
}