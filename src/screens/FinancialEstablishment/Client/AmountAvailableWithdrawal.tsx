import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker"
import CardDetailsPaymentHistoric from "../../../components/CardDetailsPaymentHistoric";



export default function AmountAvailableWithdrawal() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const [valueCollected, setValueCollected] = useState<Array<number>>()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())
    const [infosHistoric, setInfosHistoric] = useState<Array<{
        username: string;
        valuePayed: number;
        date: string
    }>>()

    const { data, loading, error } = useGetUserHistoricPayment("5")


    useEffect(() => {

        const dataHistoric = data?.establishment.data.attributes.courts.data;

        if (!error && !loading) {
            const infosCard: {
                username: string;
                valuePayed: number;
                date: string
            }[] = [];

            dataHistoric?.forEach((item) => {
                if (item.attributes.court_availabilities.data.length > 0) {
                    item.attributes.court_availabilities.data[0].attributes.schedulings.data.forEach((schedulings) => {
                        schedulings.attributes.users.data.forEach((user) => {
                            infosCard.push({
                                username: user.attributes.username,
                                valuePayed: schedulings.attributes.valuePayed,
                                date: schedulings.attributes.date
                            });
                        });
                    });
                }
            });

            if (infosCard) {
                setInfosHistoric(prevState => {
                    if (prevState === undefined) {
                        return infosCard;
                    }
                    return [...prevState, ...infosCard];
                });
            }
        }

    }, [error, loading])

    const handleDatePicker = () => {
        setShowDatePicker(true)
    }
    const handleDateChange = (event: object, selectedDate: any) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDate(selectedDate)
        }
    }


    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="pt-6 flex flex-row justify-between">
                            <Text className="text-lg font-bold">Valores disponíveis</Text>
                        </View>
                        <TouchableOpacity className="mt-2 flex flex-row" onPress={handleDatePicker}>
                            <AntDesign name="calendar" size={20} color="gray" />
                            <Text className="text-base text-gray-500 underline">{date.getDate().toString().padStart(2, '0')}/{(date.getMonth() + 1).toString().padStart(2, '0')}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                onChange={handleDateChange}
                            />
                        )}
                        <View>
                            <Text className="text-base text-gray-500 mt-1">Saldo total disponível para saque: R$ 1.390,71</Text>
                        </View>
                        <View>
                            {
                                infosHistoric?.map((card) => {
                                    const currentDate = date;
                                    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

                                    const cardDate = card.date.split("T")[0];

                                    if (cardDate === formattedDate) {
                                        return <CardDetailsPaymentHistoric
                                            username={card.username}
                                            valuePayed={card.valuePayed}
                                        />
                                    }

                                    return null
                                })
                            }
                        </View>
                        <View className="p-4 flex flex-row justify-center">
                            <Text className="text-lg flex flex-row items-center text-gray-500">Isso é tudo! <SimpleLineIcons name="emotsmile" size={15} color="gray" /></Text>
                        </View>
                        <View className="p-3 items-center justify-center">
                            <TouchableOpacity className='w-52 h-12 rounded-md bg-[#FF6112] flex items-center justify-center'>
                                <Text className='text-gray-50 font-bold'>Sacar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
