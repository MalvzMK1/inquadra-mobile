import DateTimePicker from '@react-native-community/datetimepicker';
import { Dispatch, SetStateAction, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from "react-native-paper";


export default function FilterDate(props: { dateSelector: string, setDateSelector: Dispatch<SetStateAction<string>>, setWeekDay: (arg0: number) => void }) {

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [date, setDate] = useState(new Date())

    const handleDateChange = (event: object, selectedDate: Date | undefined) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDate(selectedDate)
            props.setDateSelector(selectedDate.toISOString())
            props.setWeekDay(selectedDate.getDay())
        }
    }


    return (
        <View className='flex flex-row items-center mt-6 justify-between pb-3'>
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
                    {props.dateSelector.split("T")[0].split("-").reverse().join("/") }
                </Text>
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    onChange={handleDateChange}
                    display='calendar'
                />
            )}
        </View>
    )
}


