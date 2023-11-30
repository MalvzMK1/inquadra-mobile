import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button } from "react-native-paper";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function FilterDate(props: { dateSelector: string, setDateSelector: Dispatch<SetStateAction<string>>, setWeekDay: (arg0: number) => void }) {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event: object, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      props.setDateSelector(selectedDate.toISOString());
      props.setWeekDay(selectedDate.getDay());
    }
  };

  const showDatePickerIOS = () => {
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  return (
    <View>
      <View className='flex flex-row items-center mt-6 justify-between pb-3'>
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>
          Data
        </Text>
        <Button
          className='rounded'
          onPress={Platform.OS === "ios" ? showDatePickerIOS : () => setShowDatePicker(true)}
          buttonColor='#FFFFFF'
          style={{ borderColor: "#FF6112", borderWidth: 1, padding: 11 }}
        >
          <Text style={{ color: 'black' }}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </Button>
        {showDatePicker && (
          Platform.OS === "ios" ? (
            <DateTimePickerModal
              isVisible={true}
              mode="date"
              onConfirm={(date) => {
                hideDatePicker();
                handleDateChange({}, date);
              }}
              onCancel={hideDatePicker}
              locale='pt-BR'
              cancelTextIOS="Cancelar"
              confirmTextIOS="Confirmar"
              textColor="#333" 
              isDarkModeEnabled={false}
            />
          ) : (
            <DateTimePicker
              value={selectedDate}
              onChange={handleDateChange}
              display='calendar'
            />
          )
        )}
      </View>
    </View>
  );
}
