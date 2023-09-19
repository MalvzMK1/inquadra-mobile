import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import FilterDropdown from '../FilterDropdown'
import Animated, {
    FadeOut,
    FadeIn
} from 'react-native-reanimated'
import { Button, Checkbox } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import FilterDate from '../FilterDate'


export default function FilterComponent() {

    const date = new Date()

    const [dateSelector, setDateSelector] = useState(`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`)
    const [amenities, setAmenities] = useState<Array<string> | null>(null)
    const [dayUseYes, setDayUseYes] = useState(false)
    const [dayUseNot, setDayUseNot] = useState(true)
    const [timeFinal, setTimeFinal] = useState(new Date(date.setHours(0, 0, 0, 0)))
    const [showTimeFinalPicker, setShowTimeFinalPicker] = useState(false)
    const [timeInit, setTimeInit] = useState(new Date(date.setHours(0, 0, 0, 0)))
    const [showTimeInitPicker, setShowTimeInitPicker] = useState(false)

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
            <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className='bg-[#292929E5] opacity-90 absolute z-10 w-screen h-screen'></Animated.View>
            <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className='absolute z-10 items-center w-full h-full'>
                <ScrollView className='w-2/3 pt-8'>
                    <FilterDropdown amenities={amenities} setAmenities={setAmenities} />
                    <FilterDate dateSelector={dateSelector} setDateSelector={setDateSelector} />
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
                                    {`${String(timeInit.getHours()).padStart(2, '0')}:${String(timeInit.getMinutes()).padStart(2, '0')}`}
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
                                    {`${String(timeFinal.getHours()).padStart(2, '0')}:${String(timeFinal.getMinutes()).padStart(2, '0')}`}
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
                    <View className='items-center pt-3'>
                        <Text className='font-semibold text-white text-base'>Day-Use?</Text>
                        <View className='flex flex-row gap-[22px]'>
                            <View className='flex flex-row items-center'>
                                <Checkbox
                                    uncheckedColor='#FF6112'
                                    color='#FF6112'
                                    status={dayUseYes ? "checked" : "unchecked"}
                                    onPress={() => {
                                        if (dayUseYes) {
                                            setDayUseYes(false); 
                                            setDayUseNot(true);
                                        } else {
                                            setDayUseYes(true);
                                            setDayUseNot(false);
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <Button
                        className='rounded'
                        buttonColor='#FF6112'
                        textColor='white'
                        style={{ marginTop: 20, marginBottom: 15 }}
                    >
                        <Text className='font-medium text-base'>
                            Filtrar
                        </Text>
                    </Button>
                    <TouchableOpacity className='flex flex-row self-center gap-x-3'
                        onPress={() => {
                            setTimeInit(new Date(date.setHours(0, 0, 0, 0)))
                            setTimeFinal(new Date(date.setHours(0, 0, 0, 0)))
                            setDayUseYes(false)
                            setDayUseNot(false)
                            setAmenities([])
                            setDateSelector(`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`)
                        }}
                    >
                        <Text className=' font-semibold mb-5 text-white border-white border-b-[0.5px] mt border-solid'>
                            Limpar Filtros
                        </Text>
                        <Text className='text-white font-semibold'>
                            X
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animated.View>
        </>
    )
}