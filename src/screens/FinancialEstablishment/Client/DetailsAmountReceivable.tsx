import { HOST_API } from "@env";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import CardDetailsAmountReceivable from "../../../components/CardDetailsAmountReceivable";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";

interface Props
  extends NativeStackScreenProps<
    RootStackParamList,
    "DetailsAmountReceivable"
  > {
  establishmentId: string;
}

export default function DetailsAmountReceivable({
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailsAmountReceivable">) {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedData = `${day}/${month}`;

  const [valueCollected, setValueCollected] = useState<
    Array<{
      valuePayment: number;
      payday: string;
      activated: boolean;
    }>
  >();

  const [infosHistoric, setInfosHistoric] = useState<
    Array<{
      username: string;
      valuePayed: number;
      date: string;
      activated: boolean;
    }>
  >();

  const establishmentId = route.params.establishmentId;
  const { data, loading, error } = useGetUserHistoricPayment(establishmentId);

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
          activated: boolean;
        }[] = [];

        const amountPaid: {
          valuePayment: number;
          payday: string;
          activated: boolean;
        }[] = [];

        dataHistoric?.forEach(court => {
          court.attributes.court_availabilities.data.forEach(availability => {
            availability.attributes.schedulings.data.forEach(schedulings => {
              schedulings.attributes.user_payments.data.forEach(payment => {
                const user =
                  payment.attributes.users_permissions_user.data.attributes;
                infosCard.push({
                  username: user.name,
                  valuePayed: payment.attributes.value,
                  date: schedulings.attributes.date,
                  activated: schedulings.attributes.activated,
                });
                amountPaid.push({
                  valuePayment: payment.attributes.value,
                  payday: schedulings.attributes.date,
                  activated: schedulings.attributes.activated,
                });
              });
              schedulings.attributes.user_payment_pixes.data.forEach(
                payment => {
                  const user =
                    payment.attributes.users_permissions_user.data.attributes;
                  infosCard.push({
                    username: user.name,
                    valuePayed: payment.attributes.value,
                    date: schedulings.attributes.date,
                    activated: schedulings.attributes.activated,
                  });
                  amountPaid.push({
                    valuePayment: payment.attributes.value,
                    payday: schedulings.attributes.date,
                    activated: schedulings.attributes.activated,
                  });
                },
              );
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
              return amountPaid;
            }
            return [...prevState, ...amountPaid];
          });
        }
      }
    }, [error, loading]),
  );

  function isAvailableForWithdrawal() {
    const filteredValues = valueCollected?.filter(item => {
      return !item.activated;
    });
    return filteredValues;
  }

  const {
    data: dataUserEstablishment,
    error: errorUserEstablishment,
    loading: loadingUserEstablishment,
  } = useGetUserIDByEstablishment(route.params.establishmentId);

  return (
    <View className="flex-1">
      <ScrollView>
        <View className="p-2 flex flex-col justify-between">
          <View className="pt-6 flex flex-row justify-between">
            <Text className="text-lg font-bold">Valores a receber</Text>
          </View>
          <View className="mt-2 flex flex-row">
            <AntDesign name="calendar" size={20} color="gray" />
            <Text className="text-base text-gray-500">
              {" "}
              Hoje {formattedData}
            </Text>
          </View>
          <View>
            <Text className="text-base text-gray-500 mt-1">
              Saldo total a receber: R$
              {isAvailableForWithdrawal()?.reduce(
                (total, current) => total + current.valuePayment,
                0,
              )}
            </Text>
          </View>
          {infosHistoric?.map((card, index) => {
            if (!card.activated) {
              return (
                <CardDetailsAmountReceivable
                  key={index}
                  userName={card.username}
                  valuePayed={card.valuePayed}
                  date={card.date}
                />
              );
            }

            return null;
          })}
        </View>
        <View className="p-4 flex flex-row justify-center">
          <Text className="text-lg text-gray-500">Isso é tudo! </Text>
          <View className="p-1">
            <FontAwesome5 name="smile-beam" size={18} color="gray" />
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
