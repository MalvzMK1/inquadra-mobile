import { HOST_API } from "@env";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useUser } from "../../context/userContext";
import { useCreateStrapiPixCharge } from "../../hooks/useCreateStrapiPixCharge";
import { useRegisterSchedule } from "../../hooks/useRegisterSchedule";
import { useGetSchedulingsDetails } from "../../hooks/useSchedulingDetails";
import useUpdateScheduleDay from "../../hooks/useUpdateScheduleDay";
import useUpdateScheduleValue from "../../hooks/useUpdateScheduleValue";
import useUpdateUserPaymentPix from "../../hooks/useUpdateUserPaymentPix";
import { useGetUserById } from "../../hooks/useUserById";
import { useCreateCharge } from "../../services/inter";
import { verifyPixStatus } from "../../services/pixCielo";
import { generateRandomKey } from "../../utils/activationKeyGenerate";
import getAddress, { APICepResponse } from "../../utils/getAddressByCep";

interface RouteParams
  extends NativeStackScreenProps<RootStackParamList, "PixScreen"> {}

interface IPixInfos {
  txid: string;
  pixCode: string;
}

export default function PixScreen({ navigation, route }: RouteParams) {
  const { courtName, value, scheduleID, QRcodeURL, paymentID } = route.params;
  const formattedValue = Number(value).toFixed(2);

  const { data: scheduleData } = useGetSchedulingsDetails(
    route.params.scheduleID?.toString() ?? "",
  );
  const { userData } = useUser();

  const { data: userDataById } = useGetUserById(userData?.id ?? "", {
    onCompleted(data) {
      if (data?.usersPermissionsUser.data?.attributes.address) {
        getAddress(data.usersPermissionsUser.data.attributes.address.cep).then(
          response => {
            setUserAddress(response);
          },
        );
      }
    },
  });
  const [createCharge] = useCreateCharge();
  const [createStrapiCharge] = useCreateStrapiPixCharge();
  const [updateScheduleValue] = useUpdateScheduleValue();
  const [updateUserPaymentPix] = useUpdateUserPaymentPix();
  const [createSchedule] = useRegisterSchedule();
  const [updateSchedule] = useUpdateScheduleDay();
  const schedulePrice = route.params.schedulePrice!;
  const scheduleValuePayed = route.params.scheduleValuePayed!;
  const [userAddress, setUserAddress] = useState<APICepResponse>();
  const [pixInfos, setPixInfos] = useState<IPixInfos | null>(null);
  const [statusPix, setStatusPix] = useState("waiting");
  const [hasExecuted, setHasExecuted] = useState(false);
  const [userPhotoUri, setUserPhotoUri] = useState<ImageSourcePropType>(() => {
    return require("../../assets/default-user-image.png");
  });

  const valueToPay = parseFloat(
    value.replace(/[^\d.,]/g, "").replace(",", "."),
  );

  useFocusEffect(
    useCallback(() => {
      setHasExecuted(false);
    }, []),
  );

  const handleCopiarTexto = async () => {
    await Clipboard.setStringAsync(QRcodeURL);
    alert("Código PIX copiado para área de transferência.");
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;

    function checkStatus() {
      verifyPixStatus(paymentID).then(response => {
        if (isMounted) {
          if (response.Payment.Status === 2) {
            setStatusPix("payed");
          } else if (response.Payment.Status === 13) {
            setStatusPix("cancelled");
          } else {
            setStatusPix("waiting");
          }
        }
      });
    }

    const checkTimeOut = () => {
      if (statusPix === "waiting" && isFocused) {
        setStatusPix("cancelled");
        clearInterval(intervalId);
        if (route.params.screen === "signal") {
          navigation.navigate("ReservationPaymentSign", {
            amountToPay: valueToPay,
            courtAvailabilities: route.params.court_availabilityID!,
            courtAvailabilityDate: route.params.date!,
            courtName: courtName,
            userPhoto: route.params.userPhoto,
            courtId: route.params.courtId!,
            courtImage: route.params.courtImage!,
          });
        } else if (route.params.screen === "historic") {
          navigation.navigate("DescriptionReserve", {
            scheduleId: scheduleID?.toString()!,
          });
        } else {
          navigation.navigate("PaymentScheduleUpdate", {
            amountToPay: valueToPay,
            activationKey: null,
            courtAvailabilities: route.params.court_availabilityID!,
            courtAvailabilityDate: route.params.newDate!,
            courtId: route.params.courtId!,
            courtImage: route.params.courtImage!,
            courtName: courtName,
            pricePayed: route.params.pricePayed!,
            userPhoto: route.params.userPhoto!,
            scheduleUpdateID: scheduleID?.toString()!,
          });
        }
      }
    };

    const intervalId = setInterval(checkStatus, 2500);
    const timeOutPayment = setInterval(checkTimeOut, 300000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      clearInterval(timeOutPayment);
    };
  }, [isFocused]);

  const scheduleValueUpdate = async (
    value: number,
    schedule_id: number | null,
  ) => {
    let validatePayment =
      value + scheduleValuePayed! >= schedulePrice &&
      scheduleValuePayed !== undefined!
        ? "payed"
        : "waiting";

    let valuePayedUpdate =
      value + (scheduleValuePayed! !== undefined ? scheduleValuePayed : 0);
    let activation_key =
      value + scheduleValuePayed! >= schedulePrice! &&
      scheduleValuePayed !== undefined
        ? generateRandomKey(4)
        : "";

    try {
      await updateScheduleValue({
        variables: {
          payed_status: validatePayment,
          scheduling_id: schedule_id!,
          value_payed: valuePayedUpdate!,
          activated: false,
          activation_key: activation_key,
        },
      });
    } catch (error) {
      console.error("Erro na mutação updateValueSchedule", error);
    }
  };

  const createNewSchedule = async () => {
    let isPayed = route.params.isPayed!;
    try {
      const create = await createSchedule({
        variables: {
          title: "r",
          court_availability: route.params.court_availabilityID!,
          date: route.params.date!,
          pay_day: route.params.pay_day!,
          value_payed: route.params.value_payed!,
          owner: userData?.id ?? "",
          users: [userData?.id ?? ""],
          activation_key: isPayed ? generateRandomKey(4) : "",
          service_value: route.params.service_value!,
          publishedAt: new Date().toISOString(),
        },
      });

      return create.data?.createScheduling?.data?.id;
    } catch (error) {
      console.error("Erro na mutação createSchedule:", error);
    }
  };

  const updateScheduleDay = async (
    isPayed: boolean,
    activationKey: string | null,
  ) => {
    const paymentStatus: string = isPayed ? "payed" : "waiting";
    try {
      updateSchedule({
        variables: {
          availabilityID: route.params.court_availabilityID?.toString()!,
          newDate: route.params.newDate!,
          scheduleID: route.params.scheduleID?.toString()!,
          payedStatus: paymentStatus,
          newValue: route.params.userMoney!,
          activationKey: activationKey,
          payDay: route.params.newDate!,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params.screen === "historic") {
        if (statusPix === "payed") {
          Toast.show({
            type: "success",
            text1: "Pagamento",
            text2: "Efetuado com sucesso",
            position: "bottom",
            visibilityTime: 2000,
          });
          updateUserPaymentPix({
            variables: {
              userPaymentPixID: route.params.userPaymentPixID,
              scheduleID: scheduleID?.toString()!,
            },
          });

          scheduleValueUpdate(valueToPay, scheduleID!).then(() => {
            navigation.navigate("InfoReserva");
            setStatusPix("waiting");
          });
        }
      } else if (route.params.screen === "signal") {
        if (!hasExecuted) {
          if (statusPix === "payed") {
            createNewSchedule().then(schedule_id => {
              setHasExecuted(true);
              updateUserPaymentPix({
                variables: {
                  userPaymentPixID: route.params.userPaymentPixID,
                  scheduleID: schedule_id?.toString()!,
                },
              }).then(() => {
                scheduleValueUpdate(valueToPay, schedule_id!).then(() => {
                  navigation.navigate("InfoReserva");
                  setStatusPix("waiting");
                });
              });
            });
          }
        }
      } else {
        if (statusPix === "payed") {
          updateScheduleDay(
            route.params.isPayed!,
            route.params.randomKey!,
          ).then(() => {
            updateUserPaymentPix({
              variables: {
                userPaymentPixID: route.params.userPaymentPixID,
                scheduleID: route.params.scheduleID!.toString()!,
              },
            }).then(() => {
              navigation.navigate("InfoReserva");
              setStatusPix("waiting");
            });
          });
        }
      }
    }, [statusPix]),
  );

  useEffect(() => {
    if (
      userDataById?.usersPermissionsUser.data?.attributes.photo.data?.attributes
        .url
    ) {
      setUserPhotoUri({
        uri:
          HOST_API +
          userDataById.usersPermissionsUser.data.attributes.photo.data
            .attributes.url,
      });
    }

    if (
      userDataById?.usersPermissionsUser.data?.attributes.address &&
      userAddress &&
      scheduleData?.scheduling.data?.attributes.court_availability.data
        ?.attributes.court.data?.attributes.establishment.data &&
      scheduleData.scheduling.data.attributes.court_availability.data.attributes
        .court.data.attributes.court_types.data &&
      !pixInfos
    ) {
      const dueDate: string = new Date(
        scheduleData.scheduling.data.attributes.date,
      )
        .toISOString()
        .split("T")[0];
      const courtName: string =
        scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.court_types.data
          .map(courtType => courtType.attributes.name)
          .join(", ");
      const establishmentName: string =
        scheduleData.scheduling.data.attributes.court_availability.data
          .attributes.court.data.attributes.establishment.data.attributes
          .corporateName;

      createCharge({
        variables: {
          value: formattedValue,
          message: `Aluguel da quadra de ${courtName} do estabelecimento ${establishmentName}`,
          dueDate,
          debtorName:
            userDataById.usersPermissionsUser.data.attributes.name ?? "",
          debtorStreet: userAddress.address,
          debtorUf: userAddress.state,
          debtorCity: userAddress.city,
          debtorCpf: userDataById.usersPermissionsUser.data.attributes.cpf,
          debtorCep: userAddress.code.split("-").join(""),
          discountDate: new Date().toISOString().split("T")[0],
        },
      }).then(response => {
        if (response.data) {
          setPixInfos({
            txid: response.data.CreateCharge.txid,
            pixCode: response.data.CreateCharge.pixCopiaECola,
          });
          createStrapiCharge({
            variables: {
              code: response.data.CreateCharge.pixCopiaECola,
              txid: response.data.CreateCharge.txid,
              userID: userData?.id ?? "",
              establishmentID:
                scheduleData.scheduling.data!.attributes.court_availability
                  .data!.attributes.court.data!.attributes.establishment.data!
                  .id,
              publishedAt: new Date().toISOString(),
            },
          });
        }
        if (response.errors)
          Toast.show({
            text1: "Não foi possível gerar o código pix",
            text2: response.errors.join("\n"),
            position: "bottom",
          });
      });
    }
  }, [userData, userAddress, scheduleData]);

  return (
    <View className="h-full w-max bg-white">
      <View className=" h-11 w-max  bg-zinc-900"></View>
      <View className=" h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5">
        <View className="flex item-center justify-center">
          <TouchableOpacity onPress={navigation.goBack} className="ml-4">
            <Icon name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View className="w-max flex item-center justify-center">
          <Text className="text-lg font-bold text-white">PIX</Text>
        </View>
        <View className="h-max w-max flex justify-center items-center">
          <TouchableOpacity className="h-max w-max">
            <Image
              borderRadius={100}
              source={userPhotoUri}
              style={{ width: 46, height: 46 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-max w-max flex items-center justify-start pt-16">
        <Text className="font-black font text-xl pb-5">{courtName}</Text>
        {statusPix === "waiting" || statusPix === "payed" ? (
          <View>
            <QRCode value={QRcodeURL} size={200} />
          </View>
        ) : (
          <Image
            source={require("../../assets/blocked.png")}
            style={{ width: 200, height: 200 }}
            borderRadius={100}
          />
        )}
        <Text className="font-black font text-xl pt-2 pb-3">
          Pagamento do Sinal
        </Text>
        <View className="h-14 w-screen bg-gray-300 justify-center items-center ">
          <Text className="font-black font text-3xl text-gray-600">
            R${parseFloat(value).toFixed(2)}
          </Text>
        </View>

        {statusPix !== "cancelled" ? (
          <TouchableOpacity className="pt-5" onPress={handleCopiarTexto}>
            <View className="h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center">
              <Text className="text-gray-50 font-bold">Copiar código PIX</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="pt-5">
            <View className="h-14 w-80 rounded-md bg-gray-500 flex items-center justify-center">
              <Text className="text-gray-50 font-bold">Copiar código PIX</Text>
            </View>
          </TouchableOpacity>
        )}

        <View className="mt-2">
          {statusPix === "waiting" ? (
            <Text>Aguardando pagamento...</Text>
          ) : statusPix === "payed" ? (
            <Text>Pagamento efetuado com sucesso</Text>
          ) : (
            <Text>Pagamento Cancelado</Text>
          )}
        </View>
      </View>
    </View>
  );
}
