import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { SimpleLineIcons } from '@expo/vector-icons';
import CardDetailsPaymentHistoric from "../../../components/CardDetailsPaymentHistoric";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CardAmountAvailableWithdrawal from "../../../components/CardAmountAvailableWithdrawal";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";
import { HOST_API } from "@env";

interface Props extends NativeStackScreenProps<RootStackParamList, 'AmountAvailableWithdrawal'> {
    establishmentId: string
}

export default function AmountAvailableWithdrawal({ route }: Props) {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const currentDate = new Date();
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

            return paydayDate <= currentDate;
        });

        return datesFilter;
    }


    const {data:dataUserEstablishment, error:errorUserEstablishment, loading:loadingUserEstablishment} = useGetUserIDByEstablishment(route.params.establishmentId)

    return (
        <View className="flex-1">
            <ScrollView>
                <View>
                    <View className="p-5 flex flex-col justify-between">
                        <View className="pt-6 flex flex-row justify-between">
                            <Text className="text-lg font-bold">Valores disponíveis</Text>
                        </View>
                        <View className="mt-2 flex flex-row">
                            <AntDesign name="calendar" size={20} color="gray" />
                            <Text className="text-base text-gray-500">{currentDate.getDate().toString().padStart(2, '0')}/{(currentDate.getMonth() + 1).toString().padStart(2, '0')}</Text>
                        </View>
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
                                    const currentDate = new Date();
                                    const cardDate = new Date(card.date.split("T")[0]);

                                    if (cardDate <= currentDate) {
                                        return <CardAmountAvailableWithdrawal
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
                            <TouchableOpacity className='w-52 h-12 rounded-md bg-[#FF6112] flex items-center justify-center' onPress={() => navigation.navigate("WithdrawScreen", {
                                establishmentId: route.params.establishmentId
                            })}>
                                <Text className='text-gray-50 font-bold'>Sacar</Text>
                            </TouchableOpacity>
                        </View>
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
