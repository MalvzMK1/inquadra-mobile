import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Checkbox } from "react-native-paper";

const data = [
    { label: 'Vestuários', value: '1' },
    { label: 'Estacionamento', value: '2' },
    { label: 'Lanchonete', value: '3' },
    { label: 'Área de estar', value: '4' },
    { label: 'Loja de artigos esportivos', value: '5' },
    { label: 'Área de recreação infantil', value: '6' },
    { label: 'Sala de estar', value: '7' },
    { label: 'Quadras cobertas', value: '8' },
];

export default function FilterComponent() {

    const [date, setDate] = useState(new Date());
    const [timeInit, setTimeInit] = useState(new Date())
    const [amenities, setAmenities] = useState("Amenidades")
    const [timeFinal, setTimeFinal] = useState(new Date())
    const [dayUseYes, setDayUseYes] = useState(false)
    const [dayUseNot, setDayUseNot] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDropdownChange = (item: { label: string, value: string }) => {
        setAmenities(item.label);
    };

    return (
        <>
            <View className='bg-[#292929E5] absolute z-10 opacity-90 w-screen h-screen'></View>
            <View className=' absolute z-10 justify-center items-center w-full h-full'>
                <ScrollView className='w-2/3 pt-3'>
                    <Dropdown
                        iconColor='#FFFFFF'
                        iconStyle={{
                            height: 30,
                        }}
                        labelField={'label'}
                        valueField={'label'}
                        selectedTextStyle={{color: "white", textAlign: "center", fontWeight: "600", paddingLeft: 25}}
                        style={{
                            backgroundColor: "#FF6112",
                            borderRadius: 5,
                            height: 35,
                            paddingRight: 12
                        }}
                        placeholderStyle={{
                            color: "#FFFFFF",
                            textAlign: 'center',
                            fontWeight: "600",
                            fontSize: 15,
                            paddingLeft: 25
                        }}
                        data={data}
                        placeholder={amenities}
                        onChange={handleDropdownChange}
                    />
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
                                {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
                            </Text>
                        </Button>
                        {/* <DateTimePicker
                            value={date}
                            mode="date"
                            onChange={() => (
                                onChange
                            )}
                        /> */}
                    </View>
                    <View className='flex flex-row justify-between'>
                        <View className='w-[41%]'>
                            <Text className='font-semibold text-white text-base'>
                                Horário de Início
                            </Text>
                            <Button
                                className='rounded'
                                onPress={() => setShowDatePicker(true)}
                                buttonColor='#FFFFFF'
                                textColor='black'
                                style={{ borderColor: "#FF6112", borderWidth: 1, padding: 10 }}
                            >
                                <Text className='text-sm'>
                                    {`${timeInit.getHours()}:${timeInit.getMinutes()}`}
                                </Text>
                            </Button>
                            {/* <DateTimePicker
                                value={timeInit}
                                mode="date"
                                onChange={() => (onChange)}
                            /> */}
                        </View>
                        <View className='w-[41%]'>
                            <Text className='font-semibold text-white text-base'>
                                Horário Final
                            </Text>
                            <Button
                                className='rounded w-full'
                                onPress={() => setShowDatePicker(true)}
                                buttonColor='#FFFFFF'
                                textColor='black'
                                style={{ borderColor: "#FF6112", borderWidth: 1, padding: 10 }}
                            >
                                <Text className='text-sm'>
                                    {`${timeFinal.getHours()}:${timeFinal.getMinutes()}`}
                                </Text>
                            </Button>
                            {/* <DateTimePicker
                                value={timeFinal}
                                mode="date"
                                onChange={() => (onChange)}
                            /> */}
                        </View>
                    </View>
                    <View className='items-center pt-3'>
                        <Text className='font-semibold text-white text-base'>Day-Use?</Text>
                        <View className='flex flex-row gap-[22px]'>
                            <View className='flex flex-row items-center'>
                                <Checkbox uncheckedColor='#FF6112' color='#FF6112' status={dayUseYes ? "checked" : "unchecked"} onPress={() => setDayUseYes((prevState) => !prevState)} />
                                <Text className='text-white'>
                                    Sim
                                </Text>
                            </View>
                            <View className='flex flex-row items-center'>
                                <Checkbox uncheckedColor='#FF6112' color='#FF6112' status={dayUseNot ? "checked" : "unchecked"} onPress={() => setDayUseNot((prevState) => !prevState)} />
                                <Text className='text-white'>
                                    Não
                                </Text>
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
                </ScrollView>
            </View>
        </>
    )
}