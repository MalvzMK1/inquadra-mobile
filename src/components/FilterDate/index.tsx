import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Button } from "react-native-paper";
import { format, eachDayOfInterval, formatDistanceToNow, startOfDay, getDay, endOfYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function FilterDate( props: {dateSelector: string, setDateSelector: any} ) {

    const getAbreviacaoDiaSemana = (diaSemana: number) => {
        switch (diaSemana) {
            case 0:
                return 'D'
            case 1:
                return 'S'
            case 2:
                return 'T'
            case 3:
                return 'Q'
            case 4:
                return 'Q'
            case 5:
                return 'S'
            case 6:
                return 'S'
            default:
                return ''
        }
    }
    
    const today = startOfDay(new Date())
    const endDate = endOfYear(new Date())

    const generateYearDates = (start: number | Date, end: number | Date) => {
        const yearDates = eachDayOfInterval({ start, end })
        return yearDates.map(date => ({
            date: format(date, 'dd/MM/yyyy'),
            dayOfWeek: getAbreviacaoDiaSemana(getDay(date)),
        }))
    }

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className={`flex items-center justify-center p-2 rounded ${item.date == props.dateSelector ? "bg-[#FF6112]" : ""}`} onPress={() => {
            props.setDateSelector(item.date)
            setShowDatePicker(false)
        }}>
            <Text className={`text-xs font-medium ${item.date == props.dateSelector ? "text-white" : "text-[#BCC1CD]"}`}>{item.dayOfWeek}</Text>
            <Text className={`text-base font-semibold ${item.date == props.dateSelector ? "text-white" : "text-[#BCC1CD]"}`}>{item.date.split('/')[0]}</Text>
        </TouchableOpacity>
    )

    const yearDates = generateYearDates(today, endDate)
    const [showDatePicker, setShowDatePicker] = useState(false)

    return (
        <View className='flex flex-row items-center mt-6 justify-between pb-3'>
            {
                !showDatePicker ?
                    <>
                        <Text className='font-semibold text-white text-base'>
                            Data
                        </Text>
                        <Button
                            className='rounded'
                            onPress={() => setShowDatePicker(true)}
                            buttonColor='#FFFFFF'
                            textColor='black'
                            style={{ borderColor: "#FF6112", borderWidth: 1, padding: 10 }}
                        >
                            <Text className='text-sm'>
                                {props.dateSelector}
                            </Text>
                        </Button>
                    </>
                    :
                    <FlatList
                        data={yearDates}
                        horizontal
                        contentContainerStyle={{ display: 'flex', gap: 30 }}
                        renderItem={renderItem}
                    />
            }
        </View>
    )
}