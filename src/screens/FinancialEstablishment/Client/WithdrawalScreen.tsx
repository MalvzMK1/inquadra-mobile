import { HOST_API } from "@env";
import Slider from "@react-native-community/slider";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import NoticeCard from "../../../components/NoticeCard";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "WithdrawScreen"> {
  establishmentId: string;
}
export default function WithdrawScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, "WithdrawScreen">) {
  const { data, loading, error } = useGetUserHistoricPayment(
    route.params.establishmentId,
  );
  const [withdrawalInfo, setWithdrawalInfo] = useState<
    Array<{
      id: string;
      key: string;
    }>
  >([]);
  const [valueCollected, setValueCollected] =
    useState<
      Array<{ valuePayment: number; payday: string; activated: boolean }>
    >();
  const [isWithdrawalMade, setIsWithdrawalMade] = useState(false);
  const [selectedPixKey, setSelectedPixKey] = useState<string>("0");
  const [errorPop, setErrorPop] = useState<string>();
  const [havePixKey, setHavePixKey] = useState<boolean>();
  const [infos, setInfos] = useState<{ id: string; key: string }[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [number, setNumber] = useState(0);
  const avaibleToCashOut = route.params.valueDisponible;

  useFocusEffect(
    React.useCallback(() => {
      setWithdrawalInfo([]);
      setValueCollected([]);
      if (!error && !loading) {
        const amountPaid: {
          valuePayment: number;
          payday: string;
          activated: boolean;
        }[] = [];
        if (
          data &&
          data?.establishment.data.attributes.courts.data.length > 0
        ) {
          data?.establishment.data.attributes.courts.data.forEach(court => {
            if (court.attributes.court_availabilities.data.length > 0) {
              court.attributes.court_availabilities.data.forEach(
                availability => {
                  if (availability.attributes.schedulings.data.length > 0) {
                    availability.attributes.schedulings.data.forEach(
                      schedulings => {
                        if (
                          schedulings.attributes.user_payments.data.length > 0
                        ) {
                          schedulings.attributes.user_payments.data.forEach(
                            payment => {
                              amountPaid.push({
                                valuePayment: payment.attributes.value,
                                payday: schedulings.attributes.date,
                                activated: schedulings.attributes.activated,
                              });
                            },
                          );
                        } else {
                          setErrorPop("Não foi encontrado nenhum pagamento");
                        }
                      },
                    );
                  } else {
                    setErrorPop("Não foi encontrado nenhum agendamento");
                  }
                },
              );
            } else {
              setErrorPop("Não foi encontrado nenhuma disponibilidade");
            }
          });
        } else {
          setErrorPop("Não foi encontrado nenhuma quadra registrada");
        }

        if (
          data &&
          data.establishment.data.attributes.pix_keys.data.length > 0
        ) {
          const infosHold =
            data?.establishment.data.attributes.pix_keys.data.map(item => {
              return {
                id: item.id,
                key: item.attributes.key,
              };
            });
          setInfos(infosHold);
          setHavePixKey(true);
          setWithdrawalInfo(prevState => [...prevState, ...infosHold]);
        } else {
          setHavePixKey(false);
        }
        if (amountPaid) {
          setValueCollected(prevState => {
            if (prevState === undefined) {
              return amountPaid;
            }
            return [...prevState, ...amountPaid];
          });
        }
      }
    }, [error, loading, data]),
  );

  function isAvailableForWithdrawal() {
    const validateActivatedStatus = valueCollected?.filter(item => {
      return item.activated === true;
    });

    if (validateActivatedStatus) {
      return validateActivatedStatus!.reduce(
        (total, current) => total + current.valuePayment,
        0,
      );
    } else return 0;
  }

  const fixedWithdrawalAmounts: Array<number> = [50, 100, 250, 500];

  const handleIncrement = () => {
    if (isAvailableForWithdrawal()) {
      if (number < isAvailableForWithdrawal())
        setNumber(prevNumber => prevNumber + 1);
    }
  };

  const handleDecrement = () => {
    if (isAvailableForWithdrawal()) {
      if (number > 0) setNumber(prevNumber => prevNumber - 1);
    }
  };

  const handleSliderChange = (value: any) => {
    setNumber(value);
  };

  function withdrawalMade() {
    setIsWithdrawalMade(true);
    setTimeout(
      () =>
        navigation.navigate("HistoryPayment", {
          establishmentId: route.params.establishmentId,
          logo: route.params.logo,
          dateFilter: null,
        }),
      1000,
    );
  }
  const {
    data: dataUserEstablishment,
    error: errorUserEstablishment,
    loading: loadingUserEstablishment,
  } = useGetUserIDByEstablishment(route.params.establishmentId);

  return (
    <View>
      <ScrollView>
        <View className="flex-1 justify-center items-center ">
          {isWithdrawalMade ? (
            <NoticeCard text="Saque realizado com sucesso" />
          ) : (
            <></>
          )}
          <View
            className={`flex-1 pb-8 items-center justify-center z-10 ${
              isWithdrawalMade ? "opacity-50" : ""
            }`}
          >
            <View>
              <View
                className="flex-1 "
                pointerEvents={isWithdrawalMade ? "none" : "auto"}
              >
                <View className="p-4 flex flex-col">
                  <View className="p-5 flex flex-col justify-between">
                    <Text className="text-xl font-bold">Valor a retirar</Text>
                  </View>
                  <View className="p-3 items-center flex-row justify-center gap-5">
                    <TouchableOpacity
                      className="bg-gray-300 w-1/12 rounded-md"
                      onPress={handleDecrement}
                    >
                      <Text className="text-3xl text-center text-gray-500">
                        -
                      </Text>
                    </TouchableOpacity>
                    <View>
                      <Text className="font-extrabold text-3xl">
                        R$ {number.toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      className="bg-gray-300 w-1/12 rounded-md"
                      onPress={handleIncrement}
                    >
                      <Text className="text-3xl text-center text-gray-500">
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={avaibleToCashOut}
                    step={0.1}
                    value={number}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor="#FF6112"
                    maximumTrackTintColor="gray"
                    thumbTintColor="#FF6112"
                  />
                  <FlatList
                    horizontal
                    contentContainerStyle={{ gap: 8 }}
                    data={fixedWithdrawalAmounts}
                    keyExtractor={value => value.toString()}
                    renderItem={({ item: value }) => {
                      return (
                        <TouchableOpacity
                          disabled={avaibleToCashOut < value}
                          className={`p-4 flex-row rounded-lg ${
                            avaibleToCashOut >= value
                              ? "bg-gray-400"
                              : "bg-gray-300"
                          }`}
                          onPress={() => setNumber(value)}
                        >
                          <Text
                            className={`${
                              avaibleToCashOut >= value
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            R$ {value.toFixed(2)}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />

                  <View className="p-5 flex flex-col justify-between">
                    {havePixKey ? (
                      <>
                        <Text className="text-xl font-bold">
                          Selecione uma chave Pix
                        </Text>
                        <FlatList
                          data={withdrawalInfo}
                          keyExtractor={card => card.id}
                          renderItem={({ item: card }) => {
                            return (
                              <TouchableOpacity
                                className={`p-5 flex-row rounded-lg mt-5 ${
                                  card.id == selectedPixKey
                                    ? "bg-slate-500"
                                    : "bg-gray-300"
                                }`}
                                onPress={() => {
                                  if (card.id !== selectedPixKey)
                                    setSelectedPixKey(card.id);
                                  else setSelectedPixKey("0");
                                }}
                              >
                                <Text className="font-bold text-xl">
                                  Chave pix: {card.key.substring(0, 6)}
                                  {card.key.substring(6).replace(/./g, "*")}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                        />
                      </>
                    ) : (
                      <Text className="text-sm text-gray-400 p-5">
                        Não foi encontrada nenhuma chave pix
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-gray-400 p-5">
                    Análise de pagamento em até 48 horas*
                  </Text>
                </View>
              </View>
              <View className="items-center justify-center flex flex-row gap-5 pb-16">
                <TouchableOpacity
                  className=" w-40 h-14  rounded-md bg-gray-300 flex items-center justify-center"
                  onPress={() => navigation.goBack()}
                >
                  <Text className="font-bold text-gray-400">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`w-40 h-14 rounded-md flex items-center justify-center ${
                    selectedPixKey === "0" || number === 0
                      ? "bg-[#ffa363]"
                      : "bg-[#FF6112]"
                  }`}
                  disabled={selectedPixKey === "0" ? true : false}
                  onPress={withdrawalMade}
                >
                  <Text className="text-gray-50 font-bold">Agendar Pix</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className={`absolute bottom-0 left-0 right-0`}>
        <BottomBlackMenuEstablishment
          screen="Any"
          establishmentLogo={
            dataUserEstablishment?.establishment?.data?.attributes?.logo?.data
              ?.attributes?.url !== undefined ||
            dataUserEstablishment?.establishment?.data?.attributes?.logo?.data
              ?.attributes?.url !== null
              ? HOST_API +
                dataUserEstablishment?.establishment?.data?.attributes?.logo
                  ?.data?.attributes?.url
              : null
          }
          establishmentID={route.params.establishmentId}
          key={1}
          paddingTop={2}
        />
      </View>
    </View>
  );
}
