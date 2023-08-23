import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import CardDetailsPaymentHistoric from "../../../components/CardDetailsPaymentHistoric";
import { useFocusEffect } from "@react-navigation/native";

export default function AmountAvailableWithdrawal() {
    const currentDate = new Date();
    const [valueCollected, setValueCollected] = useState<Array<{ valuePayment: number, payday: string }>>()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())
    const [infosHistoric, setInfosHistoric] = useState<Array<{
        username: string;
        valuePayed: number;
        date: string
    }>>()

    const { data, loading, error } = useGetUserHistoricPayment("5")



    useFocusEffect(
        React.useCallback(() => {
            setInfosHistoric([]);
            setValueCollected([]);

            const dataHistoric = data?.establishment.data.attributes.courts.data;

            if (!error && !loading) {
                const infosCard: {
                    username: string;
                    valuePayed: number;
                    date: string;
                }[] = [];

                const amountPaid: { valuePayment: number, payday: string }[] = []

                dataHistoric?.forEach((court) => {
                    court.attributes.court_availabilities.data.forEach((availability) => {
                        availability.attributes.schedulings.data.forEach((schedulings) => {
                            schedulings.attributes.user_payments.data.forEach((payment) => {
                                const user = payment.attributes.users_permissions_user.data.attributes;
                                infosCard.push({
                                    username: user.username,
                                    valuePayed: payment.attributes.value,
                                    date: schedulings.attributes.date,
                                });
                                amountPaid.push({
                                    valuePayment: payment.attributes.value,
                                    payday: schedulings.attributes.date
                                });
                            });
                        });
                    });
                });

                if (infosCard) {
                    setInfosHistoric(prevState => {
                        if (prevState === undefined) {
                            return infosCard;
                        }
                        return [...prevState, ...infosCard];
                    });
                }

                if (amountPaid) {
                    setValueCollected(prevState => {
                        if (prevState === undefined) {
                            return amountPaid
                        }
                        return [...prevState, ...amountPaid]
                    })
                }
            }
        }, [error, loading])
    )

    const handleDatePicker = () => {
        setShowDatePicker(true)
    }
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    }

    function isAvailableForWithdrawal() {
        const currentDate = new Date();

        const datesFilter = valueCollected?.filter((item) => {
            const paydayDate = new Date(item.payday);

            return paydayDate <= currentDate;
        });

        return datesFilter;
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
                                maximumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                        <View>
                            <Text className="text-base text-gray-500 mt-1">Saldo total disponível para saque: R$
                                {
                                    isAvailableForWithdrawal()?.reduce((total, current) => total + current.valuePayment, 0)
                                }
                            </Text>
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
