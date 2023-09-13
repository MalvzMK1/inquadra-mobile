import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CardFinancialEstablishment from "../../components/CardFinancialEstablishment";
import { useGetUserHistoricPayment } from "../../hooks/useGetHistoricPayment";
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker"
import { HOST_API } from "@env";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


interface Props extends NativeStackScreenProps<RootStackParamList, 'FinancialEstablishment'> { }

export default function FinancialEstablishment({ route }: Props) {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [valueCollected, setValueCollected] = useState<Array<{ valuePayment: number, payday: string }>>()
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

    const establishmentId = route.params.establishmentId
    const logo = route.params.logo
    const { data, loading, error } = useGetUserHistoricPayment(establishmentId ?? "")

    useFocusEffect(
        React.useCallback(() => {
            setInfosHistoric([]);
            setValueCollected([]);

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

                const amountPaid: { valuePayment: number, payday: string }[] = []

                dataHistoric?.forEach((court) => {
                    let courtPhoto = court.attributes.photo.data[0].attributes.url;

                    court.attributes.court_availabilities.data.forEach((availability) => {
                        availability.attributes.schedulings.data.forEach((schedulings) => {

                            schedulings.attributes.user_payments.data.forEach((payment) => {

                                const user = payment.attributes.users_permissions_user.data.attributes;

                                infosCard.push({
                                    startsAt: availability.attributes.startsAt,
                                    endsAt: availability.attributes.endsAt,
                                    username: user.username,
                                    photoUser: user.photo.data.attributes.url ? HOST_API + user.photo.data.attributes.url : null,
                                    photoCourt: HOST_API + courtPhoto,
                                    valuePayed: payment.attributes.value,
                                    courtName: court.attributes.name,
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
    const handleDateChange = (event: object, selectedDate: any) => {
        setShowDatePicker(false)
        if (selectedDate) {
            setDate(selectedDate)
        }
    }

    function isAvailableForWithdrawal() {
        const currentDate = new Date();

        const futureDates: { valuePayment: number; payday: string; }[] = [];
        const pastDates: { valuePayment: number; payday: string; }[] = [];

        valueCollected?.forEach((item) => {
            const paydayDate = new Date(item.payday);

            if (paydayDate > currentDate) {
                futureDates.push(item);
            } else {
                pastDates.push(item);
            }
        });

        return {
            futureDates: futureDates,
            pastDates: pastDates,
        };
    }

    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor disponível para saque</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ {valueCollected ? isAvailableForWithdrawal().pastDates.reduce((total, current) => total + current.valuePayment, 0) : 0}</Text>
                            </View>
                            <View className="p-3 items-center justify-center">
                                <TouchableOpacity className='h-10 w-40 rounded-md bg-[#FF6112] flex items-center justify-center'
                                    onPress={() => {
                                        navigation.navigate("WithdrawScreen", {
                                            establishmentId: establishmentId ?? "",
                                            logo: logo ?? ""
                                        })
                                    }}
                                >
                                    <Text className='text-gray-50 font-bold'>Retirar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#FF6112] h-7 rounded flex items-center justify-center" onPress={() => navigation.navigate("AmountAvailableWithdrawal", {
                            establishmentId: establishmentId ?? "",
                            logo: logo ?? ""
                        })}>
                            <Text className="text-center h-4 underline">Ver detalhes</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="bg-[#292929] border rounded-md p-5">
                            <Text className="text-[#FF6112] text-base font-bold">Valor pago no crédito a receber</Text>
                            <View className="pt-5 gap-2">
                                <Text className="text-white text-3xl font-extrabold text-center">R$ {valueCollected ? isAvailableForWithdrawal().futureDates.reduce((total, current) => total + current.valuePayment, 0) : 0}</Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-[#FF6112] h-7 rounded flex items-center justify-center" onPress={() => navigation.navigate("DetailsAmountReceivable", {
                            establishmentId: establishmentId ?? "",
                            logo: logo ?? ""
                        })}>
                            <Text className="text-center h-4 underline">Ver detalhes</Text>
                        </TouchableOpacity>
                        <View className="pt-6 flex flex-row justify-between">
                            <Text className="text-lg font-bold">Valores recebidos</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("HistoryPayment", {
                                establishmentId: establishmentId ?? "",
                                logo: logo ?? ""
                            })}>
                                <Text className="text-lg font-bold underline text-[#FF6112]">Histórico</Text>
                            </TouchableOpacity>
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
                            <Text className="text-base text-gray-500 mt-1">Saldo recebido do dia: R$
                                {
                                    valueCollected?.map((item) => {
                                        if (new Date(item.payday).toISOString().split("T")[0] === date.toISOString().split("T")[0]) {
                                            return item.valuePayment;
                                        } else {
                                            return 0;
                                        }
                                    }).reduce((total, current) => total + current, 0)
                                }
                            </Text>
                        </View>
                        {
                            infosHistoric?.map((card) => {
                                const currentDate = date;
                                const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

                                const cardDate = card.date;

                                if (cardDate === formattedDate) {
                                    return (
                                        <CardFinancialEstablishment
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
