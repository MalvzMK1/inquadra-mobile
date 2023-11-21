import { HOST_API } from "@env";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import CardAmountAvailableWithdrawal from "../../../components/CardAmountAvailableWithdrawal";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";

interface Props
  extends NativeStackScreenProps<
    RootStackParamList,
    "AmountAvailableWithdrawal"
  > {
  establishmentId: string;
}
export default function AmountAvailableWithdrawal({
  route,
}: NativeStackScreenProps<RootStackParamList, "AmountAvailableWithdrawal">) {
  // export default function AmountAvailableWithdrawal({ route }: Props) {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const currentDate = new Date();
  const [valueCollected, setValueCollected] =
    useState<Array<{ valuePayment: number; payday: string; activated: boolean }>>();
  const [infosHistoric, setInfosHistoric] = useState<
    Array<{
      username: string;
      valuePayed: number;
      date: string;
      activated: boolean
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
          activated: boolean
        }[] = [];

        const amountPaid: { valuePayment: number; payday: string; activated: boolean }[] = [];

        dataHistoric?.forEach(court => {
          court.attributes.court_availabilities.data.forEach(availability => {
            availability.attributes.schedulings.data.forEach(schedulings => {
              schedulings.attributes.user_payments.data.forEach(payment => {
                const user = payment.attributes.users_permissions_user.data.attributes;
                infosCard.push({
                  username: user.username,
                  valuePayed: payment.attributes.value,
                  date: schedulings.attributes.date,
                  activated: schedulings.attributes.activated
                });
                amountPaid.push({
                  valuePayment: payment.attributes.value,
                  payday: schedulings.attributes.date,
                  activated: schedulings.attributes.activated
                });
              });
              schedulings.attributes.user_payment_pixes.data.forEach(payment => {
                const user = payment.attributes.users_permissions_user.data.attributes;
                infosCard.push({
                  username: user.username,
                  valuePayed: payment.attributes.value,
                  date: schedulings.attributes.date,
                  activated: schedulings.attributes.activated
                });
                amountPaid.push({
                  valuePayment: payment.attributes.value,
                  payday: schedulings.attributes.date,
                  activated: schedulings.attributes.activated
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
              return amountPaid;
            }
            return [...prevState, ...amountPaid];
          });
        }
      }
    }, [error, loading]),
  );

  function isAvailableForWithdrawal() {

    const activatedFilter = valueCollected?.filter(item => {

      return item.activated === true
    });

    return activatedFilter;
  }

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
              <Text className="text-lg font-bold mb-4">
                Valores disponíveis
              </Text>
            </View>
            <View className="mt-2 flex flex-row items-center gap-1">
              <AntDesign name="calendar" size={20} color="gray" />
              <Text className="text-base text-gray-500">
                {currentDate.getDate().toString().padStart(2, "0")}/
                {(currentDate.getMonth() + 1).toString().padStart(2, "0")}
              </Text>
            </View>
            <View>
              <Text className="text-base text-gray-500 mt-1">
                Saldo total disponível para saque: R$
                {isAvailableForWithdrawal()?.reduce(
                  (total, current) => total + current.valuePayment,
                  0,
                )}
              </Text>
            </View>
            <View>
              {infosHistoric?.filter(item => { return item.activated }).map((card, index) => {
                const currentDate = new Date();
                const cardDate = new Date(card.date.split("T")[0]);

                if (cardDate <= currentDate) {
                  return (
                    <CardAmountAvailableWithdrawal
                      key={index}
                      username={card.username}
                      valuePayed={card.valuePayed}
                    />
                  );
                }

                return null;
              })}
            </View>
            <View className="p-4 flex flex-row justify-center">
              <Text className="text-lg flex flex-row items-center text-gray-500">
                Isso é tudo!
                <SimpleLineIcons name="emotsmile" size={15} color="gray" />
              </Text>
            </View>
            <View className="p-3 items-center justify-center">
              <TouchableOpacity
                className="w-52 h-12 rounded-md bg-[#FF6112] flex items-center justify-center"
                onPress={() =>
                  navigation.navigate("WithdrawScreen", {
                    establishmentId: route.params.establishmentId,
                    logo: route.params.logo,
                    valueDisponible: route.params.valueDisponible
                  })
                }
              >
                <Text className="text-gray-50 font-bold">Sacar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="h-16"></View>
      </ScrollView>
      <View className={`absolute bottom-0 left-0 right-0`}>
        <BottomBlackMenuEstablishment
          screen="Any"
          userID={
            dataUserEstablishment?.establishment.data.attributes.owner.data.id!
          }
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
