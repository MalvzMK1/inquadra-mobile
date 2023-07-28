import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState } from "react"
import PriceHour from '../../components/CourtPriceHour';
import CourtAvailibilityDay from '../../components/CourtAvailibilityDay';

let test: string

export default function CourtPriceHour() {
    const [componentInstances, setComponentInstances] = useState([PriceHour])
    const [mondayView, setMondayView] = useState(true)
    const [tuesdayView, setTuesdayView] = useState(false)
    const [wednesdayView, setWednesdayView] = useState(false)
    const [thursdayView, setThursdayView] = useState(false)
    const [fridayView, setFridayView] = useState(false)
    const [saturdayView, setSaturdayView] = useState(false)
    const [sundayView, setSundayView] = useState(false)

    const setAllFalse = () => {
        setMondayView(false)
        setTuesdayView(false)
        setWednesdayView(false)
        setThursdayView(false)
        setFridayView(false)
        setSaturdayView(false)
        setSundayView(false)
    }

    return (
        <View className='bg-[#292929] h-full w-full items-center pl-[15px] pr-[15px] pt-[10px]'>
            <Text className='text-white font-black text-xs'>Selecione o dia</Text>
            <View className='w-full h-fit flex-row flex-wrap items-center justify-between gap-y-[5px] mt-[10px]'>
                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setMondayView(!mondayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Segunda</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setTuesdayView(!tuesdayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Terça</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setWednesdayView(!wednesdayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Quarta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setThursdayView(!thursdayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Quinta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setFridayView(!fridayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Sexta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setSaturdayView(!saturdayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Sábado</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {
                        setAllFalse()
                        setSundayView(!sundayView)
                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Domingo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                    onPress={() => {

                    }}
                >
                    <Text className='font-normal text-[#FF6112] text-[11px]'>Dia especial</Text>
                </TouchableOpacity>
            </View>

            <View className='w-full h-full mt-[15px]'>
                <CourtAvailibilityDay key={1} day='Segunda-feira' buttonBoolean={mondayView} setter={setMondayView} />
                <CourtAvailibilityDay key={2} day='Terça-feira' buttonBoolean={tuesdayView} setter={setTuesdayView} />
                <CourtAvailibilityDay key={3} day='Quarta-feira' buttonBoolean={wednesdayView} setter={setWednesdayView} />
                <CourtAvailibilityDay key={4} day='Quinta-feira' buttonBoolean={thursdayView} setter={setThursdayView} />
                <CourtAvailibilityDay key={5} day='Sexta-feira' buttonBoolean={fridayView} setter={setFridayView} />
                <CourtAvailibilityDay key={6} day='Sábado' buttonBoolean={saturdayView} setter={setSaturdayView} />
                <CourtAvailibilityDay key={7} day='Domingo' buttonBoolean={sundayView} setter={setSundayView} />
            </View>
        </View>
    )
}