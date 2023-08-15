import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CardPaymentHistoric from "../../components/CardPaymentHistoric";
import { useGetUserHistoricPayment } from "../../hooks/useGetHistoricPayment";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker"
import { HOST_API } from "@env";

export default function FinancialEstablishment() {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const currentDate = new Date();
    const [valueCollected, setValueCollected] = useState<Array<number>>()
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [date, setDate] = useState(new Date())

    const [infosHistoric, setInfosHistoric] = useState<Array<{
        username: string;
        photoCourt: string;
        valuePayed: number;
        courtName: string;
        date: string
        photoUser: string | null
        startsAt: string;
        endsAt: string
    }>>()

    const { data, loading, error } = useGetUserHistoricPayment("5")

    useEffect(() => {

        const dataHistoric = data?.establishment.data.attributes.courts.data;

        if (!error && !loading) {
            const infosCard: {
                username: string;
                photoUser: string | null;
                photoCourt: string;
                valuePayed: number;
                courtName: string;
                date: string;
                startsAt: string;
                endsAt: string
            }[] = [];

            const amountPaid: number[] = []

            dataHistoric?.forEach((item) => {
                let photo = item.attributes.photo.data[0].attributes.url;
                if (item.attributes.court_availabilities.data.length > 0) {
                    item.attributes.court_availabilities.data[0].attributes.schedulings.data.forEach((schedulings) => {
                        // console.log(item.attributes.court_availabilities.data)

                        schedulings.attributes.users.data.forEach((user) => {
                            console.log(user.attributes.username)
                            infosCard.push({
                                startsAt: item.attributes.court_availabilities.data[0].attributes.startsAt,
                                endsAt: item.attributes.court_availabilities.data[0].attributes.endsAt,
                                username: user.attributes.username,
                                photoUser: user.attributes.photo.data ? HOST_API + user.attributes.photo.data.attributes.url : null,
                                photoCourt: HOST_API + photo,
                                valuePayed: schedulings.attributes.valuePayed,
                                courtName: item.attributes.name,
                                date: schedulings.attributes.date
                            });
                            amountPaid.push(schedulings.attributes.valuePayed)
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
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor disponível para saque</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ {valueCollected ? valueCollected.reduce((total, current) => total + current, 0) : 0}</Text>
                            </View>
                            <View className="p-3 items-center justify-center">
                                <TouchableOpacity className='h-10 w-40 rounded-md bg-[#FF6112] flex items-center justify-center'>
                                    <Text className='text-gray-50 font-bold'>Retirar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#FF6112] h-7 rounded flex items-center justify-center" onPress={() => navigation.navigate("AmountAvailableWithdrawal")}>
                            <Text className="text-center h-4 underline">Ver detalhes</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor pago no crédito a receber</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ {valueCollected ? valueCollected.reduce((total, current) => total + current, 0) : 0}</Text>
                            </View>
                        </View>
                        <View className="bg-[#FF6112] h-7 rounded flex items-center justify-center">
                            <Text className="text-center h-4 underline">Ver detalhes</Text>
                        </View>
                        <View className="pt-6 flex flex-row justify-between">
                            <Text className="text-lg font-bold">Valores recebidos</Text>
                            <Text className="text-lg font-bold underline text-[#FF6112]">Histórico</Text>
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
                            <Text className="text-base text-gray-500 mt-1">Saldo recebido do dia: R$ {valueCollected ? valueCollected.reduce((total, current) => total + current, 0) : 0}</Text>
                        </View>
                        {
                            infosHistoric?.map((card) => {
                                const currentDate = date;
                                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

                                const cardDate = card.date;

                                if (cardDate === formattedDate) {
                                    return (
                                        <CardPaymentHistoric
                                            username={card.username}
                                            valuePayed={card.valuePayed}
                                            photoCourt={card.photoCourt}
                                            courtName={card.courtName}
                                            photoUser={card.photoUser}
                                            startsAt={card.startsAt}
                                            endsAt={card.endsAt}
                                        />
                                    );
                                }

                                return null;
                            })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
