import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import CardDetailsAmountReceivable from "../../../components/CardDetailsAmountReceivable";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface Props extends NativeStackScreenProps<RootStackParamList, 'AmountAvailableWithdrawal'> {
    establishmentId: string
}


export default function DetailsAmountReceivable({ route }: Props) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    const [valueCollected, setValueCollected] = useState<Array<{ valuePayment: number, payday: string }>>()
    const [infosHistoric, setInfosHistoric] = useState<Array<{
        username: string;
        valuePayed: number;
        date: string
    }>>()

    const establishmentId = route.params.establishmentId
    const { data, loading, error } = useGetUserHistoricPayment(establishmentId)



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

    function isAvailableForWithdrawal() {
        const currentDate = new Date();

        const datesFilter = valueCollected?.filter((item) => {
            const paydayDate = new Date(item.payday);

            return paydayDate > currentDate;
        });

        return datesFilter;
    }

    return (
        <View className="flex-1">
            <ScrollView>
                <View className="p-2 flex flex-col justify-between">
                    <View className="pt-6 flex flex-row justify-between">
                        <Text className="text-lg font-bold">Valores a receber</Text>
                    </View>
                    <View className="mt-2 flex flex-row">
                        <AntDesign name="calendar" size={20} color="gray" />
                        <Text className="text-base text-gray-500"> Hoje {formattedData}</Text>
                    </View>
                    <View>
                        <Text className="text-base text-gray-500 mt-1">Saldo total a receber: R$
                            {
                                isAvailableForWithdrawal()?.reduce((total, current) => total + current.valuePayment, 0)
                            }
                        </Text>
                    </View>
                    {
                        infosHistoric?.map((card) => {
                            const currentDate = new Date();
                            const cardDate = new Date(card.date);
                            console.log(card);
                            

                            if (cardDate > currentDate) {
                                return <CardDetailsAmountReceivable 
                                    userName={card.username}
                                    valuePayed={card.valuePayed}
                                    date={card.date}
                                />
                            }

                            return null
                        })
                    }

                </View>
                <View className="p-4 flex flex-row justify-center">
                    <Text className="text-lg text-gray-500">Isso é tudo! </Text>
                    <View className="p-1">
                        <FontAwesome5 name="smile-beam" size={18} color="gray" />
                    </View>
                </View>
            </ScrollView >
        </View >
    );
}
