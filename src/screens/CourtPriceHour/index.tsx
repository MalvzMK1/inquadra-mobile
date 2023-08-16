import {View, Text, ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useState } from "react"
import CourtAvailibilityDay from '../../components/CourtAvailibilityDay';
import SetCourtAvailibility from '../../components/SetCourtAvailibility';
import {formatLocaleWeekDayName, getWeekDays} from "../../utils/getWeekDates";
import {addDays} from "date-fns";
import {ComponentProvider} from "../../context/ComponentContext";

interface DayAvailability {
  dayUse: boolean
}

export default function CourtPriceHour() {
  const weekDays = getWeekDays(new Date())
  weekDays.push({
    dayName: 'Special Day',
    day: (Number(weekDays[weekDays.length - 1].day) - 1).toString(),
    localeDayInitial: 'D.E.',
    localeDayName: 'Dia Especial',
    date: addDays(new Date(weekDays[weekDays.length - 1].date), 1)
  })

  const formattedWeekDayNames = formatLocaleWeekDayName(weekDays)

  formattedWeekDayNames.forEach((formattedDayName, index) => {
    weekDays[index]["localeDayName"] = formattedDayName
  })

  const [weekDaysView, setWeekDaysView] = useState<Array<boolean>>(Array(weekDays.length).fill(true, 0, 0).fill(false, 1))
  const [dayAvailability, setDayAvailability] = useState([])
    const setAllFalse = () => {
        setWeekDaysView(Array(weekDays.length).fill(false))
    }

  function handleWeekDayClick(index: number) {
    const newWeekDaysView = Array(weekDays.length).fill(false);

    newWeekDaysView[index] = !weekDaysView[index];

    setWeekDaysView(newWeekDaysView);
  }

  return (
    <ScrollView className='bg-[#292929]'>
      <View className='bg-[#292929] h-full w-full items-center pl-[15px] pr-[15px] pt-[10px]'>
        <Text className='text-white font-black text-xs'>Selecione o dia</Text>
        <View className='w-full h-fit flex-row flex-wrap items-center justify-between gap-y-[5px] mt-[10px]'>
          {
            weekDays.map((day, index) => (
              <TouchableOpacity
                className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center'
                onPress={() => {
                  setAllFalse()
                  handleWeekDayClick(index)
                }}
              >
                <Text className='font-normal text-[#FF6112] text-[11px]'>{day.localeDayName}</Text>
              </TouchableOpacity>
            ))
          }
        </View>

        <View className='w-full h-full mt-[15px]'>
          {
            weekDays.map((day, index) => (
              <ComponentProvider>
                <CourtAvailibilityDay
                  key={index}
                  day={day.localeDayName}
                  setAllFalse={setAllFalse}
                  clicked={weekDaysView[index]}
                  onClick={(clicked) => {
                    handleWeekDayClick(index)
                  }}
                >
                  <SetCourtAvailibility />
                </CourtAvailibilityDay>
              </ComponentProvider>
            ))
          }
        </View>
      </View>
    </ScrollView>
    )
}