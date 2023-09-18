import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import CardDetailsPaymentHistoric from "../../../components/CardDetailsPaymentHistoric";
import { useFocusEffect } from "@react-navigation/native";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HOST_API } from "@env";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";

interface Props extends NativeStackScreenProps<RootStackParamList, 'HistoryPayment'> {
    establishmentId: string
}

export default function HistoryPayment({ route }: Props) {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const formattedData = `${day}/${month}`;

    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const fiveDaysAgo = new Date(currentDate);
    fiveDaysAgo.setDate(currentDate.getDate() - 5);

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

            return paydayDate == currentDate;
        });

        return datesFilter;
    }

    const { data: dataUserEstablishment, error: errorUserEstablishment, loading: loadingUserEstablishment } = useGetUserIDByEstablishment(route.params.establishmentId)
    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="pt-6 flex flex-row justify-between">
                            <Text className="text-lg font-bold">Saques realizados</Text>
                        </View>
                        <View className="mt-2 flex flex-row">
                            <Text className="text-base text-gray-500"> Hoje {formattedData}</Text>
                        </View>
                        <View>
                            <Text className="text-base text-gray-500 mt-1">Saldo do dia: R$ {
                                isAvailableForWithdrawal()?.reduce((total, current) => total + current.valuePayment, 0)
                            }</Text>
                        </View>
                        <CardDetailsPaymentHistoric username={""} valuePayed={0} />
                    </View>
                </View>
                <View className="h-16"></View>
            </ScrollView>
            <View className={`absolute bottom-0 left-0 right-0`}>
                <BottomBlackMenuEstablishment
                    screen="Any"
                    userID={dataUserEstablishment?.establishment.data.attributes.owner.data.id!}
                    establishmentLogo={dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== undefined || dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== null ? HOST_API + dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url : null}
                    establishmentID={route.params.establishmentId}
                    key={1}
                    paddingTop={2}
                />
            </View>
        </View>
    );
}
