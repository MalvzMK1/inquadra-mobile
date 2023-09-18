
import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native"
import Slider from '@react-native-community/slider';
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { NavigationProp, useFocusEffect, useNavigation, } from "@react-navigation/native"
import NoticeCard from "../../../components/NoticeCard";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";
import { HOST_API } from "@env";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";

interface Props extends NativeStackScreenProps<RootStackParamList, 'WithdrawScreen'> {
    establishmentId: string
}

export default function WithdrawScreen({ route }: Props) {
    const { data, loading, error } = useGetUserHistoricPayment(route.params.establishmentId)
    const [withdrawalInfo, setWithdrawalInfo] = useState<Array<{
        id: string,
        key: string
    }>>([])
    const [valueCollected, setValueCollected] = useState<Array<{ valuePayment: number, payday: string }>>()
    const [isWithdrawalMade, setIsWithdrawalMade] = useState(false)
    const [selectedPixKey, setSelectedPixKey] = useState<string>("0")

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    const [number, setNumber] = useState(0)

    useFocusEffect(
        React.useCallback(() => {
            setWithdrawalInfo([])
            setValueCollected([])
            if (!error && !loading) {
                const amountPaid: { valuePayment: number, payday: string }[] = []

                data?.establishment.data.attributes.courts.data.forEach((court) => {
                    court.attributes.court_availabilities.data.forEach((availability) => {
                        availability.attributes.schedulings.data.forEach((schedulings) => {
                            schedulings.attributes.user_payments.data.forEach((payment) => {
                                amountPaid.push({
                                    valuePayment: payment.attributes.value,
                                    payday: schedulings.attributes.date
                                });
                            });
                        });
                    });
                });

                const infos = data?.establishment.data.attributes.pix_keys.data.map(item => {
                    return {
                        id: item.id,
                        key: item.attributes.key
                    }
                })

                if (infos) {
                    setWithdrawalInfo((prevState) => [...prevState, ...infos])
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
        }, [])
    )

    function isAvailableForWithdrawal() {
        const currentDate = new Date();

        const datesFilter = valueCollected?.filter((item) => {
            const paydayDate = new Date(item.payday);

            return paydayDate <= currentDate;
        });

        if (datesFilter) return datesFilter.reduce((total, current) => total + current.valuePayment, 0);
        else return 0
    }

    const fixedWithdrawalAmounts: Array<number> = [50, 100, 250, 500]


    const handleIncrement = () => {
        if (isAvailableForWithdrawal()) {
            if (number < isAvailableForWithdrawal())
                setNumber(prevNumber => prevNumber + 1)
        }
    }

    const handleDecrement = () => {
        if (isAvailableForWithdrawal()) {
            if (number > 0)
                setNumber(prevNumber => prevNumber - 1)
        }
    }



    const handleSliderChange = (value: any) => {
        setNumber(value)
    }

    function withdrawalMade() {
        setIsWithdrawalMade(true)
        setTimeout(() => navigation.navigate("HistoryPayment", {
            establishmentId: route.params.establishmentId,
            logo: route.params.logo
        }), 1000)
    }

    function WithdrawalWarningCard() {
        return (
            <View className="bg-white w-4/5 h-1/3 rounded-md absolute flex justify-center items-center z-20">
                <Text className="text-center font-bold text-sm mb-5">Saque realizado com sucesso</Text>
                <Image source={require("../../../assets/orange_logo_inquadra.png")} />
            </View>
        );
    }


    const { data: dataUserEstablishment, error: errorUserEstablishment, loading: loadingUserEstablishment } = useGetUserIDByEstablishment(route.params.establishmentId)

    return (
        <View className="flex-1 justify-center items-center ">
            {
                isWithdrawalMade ?
                    < NoticeCard text="Saque realizado com sucesso" />
                    :
                    <></>
            }
            <View className={`h-full w-screen flex items-center justify-center z-10 ${isWithdrawalMade ? "opacity-50" : ""}`}>
                <ScrollView  >
                    <View className="flex-1 " pointerEvents={isWithdrawalMade ? "none" : "auto"}>
                        <View className="p-4 flex flex-col">
                            <View className="p-5 flex flex-col justify-between">
                                <Text className="text-xl font-bold">Valor a retirar</Text>
                            </View>
                            <View className="p-3 items-center flex-row justify-center gap-5">
                                <TouchableOpacity className="bg-gray-300 w-1/12 rounded-md" onPress={handleDecrement}>
                                    <Text className="text-3xl text-center text-gray-500">-</Text>
                                </TouchableOpacity>
                                <View>
                                    <Text className="font-extrabold text-3xl">R$ {
                                        number.toFixed(2)
                                    }</Text>
                                </View>
                                <TouchableOpacity className="bg-gray-300 w-1/12 rounded-md" onPress={handleIncrement}>
                                    <Text className="text-3xl text-center text-gray-500">+</Text>
                                </TouchableOpacity>

                            </View>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={0}
                                maximumValue={isAvailableForWithdrawal()}
                                step={0.1}
                                value={number}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor="#FF6112"
                                maximumTrackTintColor="gray"
                                thumbTintColor="#FF6112"
                            />
                            <View className="flex flex-row justify-center gap-2 mt-3">
                                {
                                    fixedWithdrawalAmounts.map(value => (
                                        <TouchableOpacity
                                            key={value}
                                            disabled={isAvailableForWithdrawal() < value}
                                            className={`p-4 flex-row rounded-lg ${isAvailableForWithdrawal() >= value ? "bg-gray-400" : "bg-gray-300"}`}
                                            onPress={() => setNumber(value)}
                                        >
                                            <Text className={`${isAvailableForWithdrawal() >= value ? "text-white" : "text-gray-400"}`}>R$ {value.toFixed(2)}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                            <View className="p-5 flex flex-col justify-between">
                                <Text className="text-xl font-bold">Selecione uma chave Pix</Text>
                                {
                                    withdrawalInfo.map(card => (
                                        <TouchableOpacity
                                            key={card.id}
                                            className={`p-5 flex-row rounded-lg mt-5 ${card.id == selectedPixKey ? "bg-slate-300" : "bg-gray-300"}`}
                                            onPress={() => {
                                                if (card.id !== selectedPixKey)
                                                    setSelectedPixKey(card.id)
                                                else
                                                    setSelectedPixKey("0")
                                            }}
                                        >
                                            <Text className="font-bold text-xl">
                                                Chave pix: {card.key.substring(0, 6)}{card.key.substring(6).replace(/./g, '*')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View className="items-center justify-center flex flex-row gap-5 pb-16">
                    <TouchableOpacity className=' w-40 h-14 rounded-md bg-gray-300 flex items-center justify-center'
                        onPress={() => navigation.goBack()}
                    >
                        <Text className='font-bold text-gray-400'>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`w-40 h-14 rounded-md flex items-center justify-center ${selectedPixKey === "0" || number === 0 ? "bg-[#ffa363]" : "bg-[#FF6112]"}`}
                        disabled={selectedPixKey === "0" ? true : false}
                        onPress={withdrawalMade}
                    >
                        <Text className='text-gray-50 font-bold'>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    )
}