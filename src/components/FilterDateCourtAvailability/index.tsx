import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { format, eachDayOfInterval, startOfDay, getDay, endOfYear, addYears } from 'date-fns';


export default function FilterDate(props: { dateSelector: string, setDateSelector: any, handleClick: Function }) {

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

    const [dateSelector, setDateSelector] = useState(new Date().toISOString())

    useEffect(() => {
        setDateSelector(props.dateSelector)
    }, [])

    const today = startOfDay(new Date())
    const [endDate, setEndDate] = useState(endOfYear(new Date()));

    const generateYearDates = (start: any, end: any) => {
        const yearDates = eachDayOfInterval({ start, end })
        return yearDates.map(date => ({
            date: format(date, 'yyyy-MM-dd'),
            dayOfWeek: getAbreviacaoDiaSemana(getDay(date)),
        }))
    }

    const [yearDates, setYearDates] = useState(generateYearDates(today, endDate));

    const loadMoreYearDates = () => {
        const newEndDate = addYears(endDate, 1);
        const newYearDates = generateYearDates(endDate, newEndDate);
        
        setEndDate(newEndDate);
        setYearDates([...yearDates, ...newYearDates]);
    }

    // dateSelector.split("-")[2]

    const renderItem = ({ item }: any) => (
        <TouchableOpacity className={`flex items-center justify-center p-2 rounded ${item.date == dateSelector ? "bg-[#FF6112]" : ""}`} onPress={() => { 
            props.handleClick({ dateString: item.date })
            setDateSelector(item.date)
        }}>
            <Text className={`text-xs font-medium ${item.date == dateSelector ? "text-white" : "text-[#BCC1CD]"}`}>{item.dayOfWeek}</Text>
            <Text className={`text-base font-semibold ${item.date == dateSelector ? "text-white" : "text-[#BCC1CD]"}`}>{item.date.split('-')[2]}</Text>
        </TouchableOpacity>
    )


    return (
        <View className='flex flex-row items-center mt-6 justify-between pb-3'>
            <FlatList
                data={yearDates}
                horizontal
                bounces
                contentContainerStyle={{ display: 'flex', gap: 30 }}
                renderItem={renderItem}
                onEndReached={loadMoreYearDates}
                onEndReachedThreshold={0.1}
            />
        </View>
    )
}