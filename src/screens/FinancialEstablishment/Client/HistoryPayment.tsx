import { HOST_API } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import CardDetailsPaymentHistoric from "../../../components/CardDetailsPaymentHistoric";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useGetUserHistoricPaymentFiltred } from "../../../hooks/useHistoricPaymentsFiltred";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "HistoryPayment"> {
  establishmentId: string;
}
export default function HistoryPayment({
  route,
}: NativeStackScreenProps<RootStackParamList, "HistoryPayment">) {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedData = `${day}/${month}`;

  const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const fiveDaysAgo = new Date(currentDate);
  fiveDaysAgo.setDate(currentDate.getDate() - 5);
  const establishmentId = route.params.establishmentId;
  let { data, loading, error } = useGetUserHistoricPayment(establishmentId);
  if (route.params.dateFilter !== null) {
    ({ data, loading, error } = useGetUserHistoricPaymentFiltred(
      establishmentId,
      route.params.dateFilter,
    ));
  }
  const [mergedPayments, setMergedPayments] = useState<[] | null>();
  const [balance, setBalance] = useState<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      if (!error && !loading) {
        if (
          data &&
          data.establishment.data &&
          data.establishment.data.attributes.courts.data.length > 0
        ) {
          const allPayments =
            data?.establishment.data.attributes.courts.data.flatMap(court => {
              if (court.attributes.court_availabilities.data.length > 0) {
                return court.attributes.court_availabilities.data.flatMap(
                  availability => {
                    if (availability.attributes.schedulings.data.length > 0) {
                      return availability.attributes.schedulings.data.flatMap(
                        schedulings => {
                          if (
                            schedulings.attributes.user_payment_pixes.data
                              .length > 0 &&
                            schedulings.attributes.user_payments.data.length > 0
                          ) {
                            const userPayments =
                              schedulings.attributes.user_payments.data.map(
                                payment => ({
                                  type: "user_payment",
                                  PayedStatus: payment.attributes.payedStatus,
                                  createdAt: payment.attributes.createdAt,
                                  value: payment.attributes.value,
                                  user: payment.attributes
                                    .users_permissions_user.data.attributes,
                                }),
                              );
                            const userPaymentPixes =
                              schedulings.attributes.user_payment_pixes.data.map(
                                pix => ({
                                  type: "user_payment_pix",
                                  createdAt: pix.attributes.createdAt,
                                  value: pix.attributes.value,
                                  PayedStatus: pix.attributes.PayedStatus, // Ajuste no nome do atributo
                                  paymentId: pix.attributes.paymentId,
                                }),
                              );
                            let allPaymentsByDate = [
                              ...userPayments,
                              ...userPaymentPixes,
                            ];
                            allPaymentsByDate.sort(
                              (a, b) =>
                                new Date(a!.createdAt).getTime() -
                                new Date(b!.createdAt).getTime(),
                            );
                            const totalBalance = allPaymentsByDate.reduce(
                              (total, payment) => total + payment.value,
                              0,
                            );

                            setBalance(totalBalance);
                            setMergedPayments(allPaymentsByDate);
                          } else if (
                            schedulings.attributes.user_payment_pixes.data
                              .length <= 0 &&
                            schedulings.attributes.user_payments.data.length > 0
                          ) {
                            const userPayments =
                              schedulings.attributes.user_payments.data.map(
                                payment => ({
                                  type: "user_payment",
                                  PayedStatus: payment.attributes.payedStatus,
                                  createdAt: payment.attributes.createdAt,
                                  value: payment.attributes.value,
                                  user: payment.attributes
                                    .users_permissions_user.data.attributes,
                                }),
                              );
                            const totalBalance = userPayments.reduce(
                              (total, payment) => total + payment.value,
                              0,
                            );

                            setBalance(totalBalance);
                            setMergedPayments(userPayments);
                          } else if (
                            schedulings.attributes.user_payment_pixes.data
                              .length > 0 &&
                            schedulings.attributes.user_payments.data.length <=
                              0
                          ) {
                            const userPaymentPixes =
                              schedulings.attributes.user_payment_pixes.data.map(
                                pix => ({
                                  type: "user_payment_pix",
                                  createdAt: pix.attributes.createdAt,
                                  value: pix.attributes.value,
                                  PayedStatus: pix.attributes.PayedStatus, // Ajuste no nome do atributo
                                  paymentId: pix.attributes.paymentId,
                                }),
                              );
                            const totalBalance = userPaymentPixes.reduce(
                              (total, payment) => total + payment.value,
                              0,
                            );

                            setBalance(totalBalance);
                            setMergedPayments(userPaymentPixes);
                          } else {
                            setMergedPayments(null);
                          }
                        },
                      );
                    } else {
                      setMergedPayments(null);
                    }
                  },
                );
              } else {
                setMergedPayments(null);
              }
            }) || [];
        }
      }
    }, [error, loading, data]),
  );

  const {
    data: dataUserEstablishment,
    error: errorUserEstablishment,
    loading: loadingUserEstablishment,
  } = useGetUserIDByEstablishment(route.params.establishmentId);
  return (
    <View className="flex-1">
      <ScrollView>
        <View>
          <View className="p-5 flex flex-col justify-between">
            <View className="pt-6 flex flex-row justify-between">
              <Text className="text-lg font-bold">Saques realizados</Text>
            </View>
            <View className="mt-2 flex flex-row">
              <Text className="text-base text-gray-500">
                {" "}
                Hoje {formattedData}
              </Text>
            </View>
            <View>
              <Text className="text-base text-gray-500 mt-1">
                Saldo do dia: R$ {balance}
              </Text>
            </View>
            {mergedPayments !== undefined ? (
              mergedPayments !== null ? (
                mergedPayments.map(payment => (
                  <CardDetailsPaymentHistoric
                    valuePayed={payment.value}
                    username={"Enzudo Graxa"}
                    payedStatus={payment.PayedStatus}
                  ></CardDetailsPaymentHistoric>
                ))
              ) : (
                <Text className="text-lg font-bold">
                  Não existe algum saque para hoje
                </Text>
              )
            ) : (
              <ActivityIndicator size="large" color="#FF6112" />
            )}
          </View>
        </View>
        <View className="h-16"></View>
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
