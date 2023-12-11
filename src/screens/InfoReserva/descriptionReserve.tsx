import { HOST_API } from "@env";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { SelectList } from "react-native-dropdown-select-list";
import MaskInput, { Masks } from "react-native-mask-input";
import { TextInputMask } from "react-native-masked-text";
import { Button, TextInput } from "react-native-paper";
import ProgressBar from "react-native-progress/Bar";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { z } from "zod";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import Countdown from "../../components/countdown/Countdown";
import { useAllPaymentsSchedulingById } from "../../hooks/useAllPaymentsScheduling";
import useCountries from "../../hooks/useCountries";
import useDeleteSchedule from "../../hooks/useDeleteSchedule";
import { useInfoSchedule } from "../../hooks/useInfoSchedule";
import { useGetMenuUser } from "../../hooks/useMenuUser";
import useUpdateScheduleValue from "../../hooks/useUpdateScheduleValue";
import { useGetUserById } from "../../hooks/useUserById";
import { useUserPaymentCard } from "../../hooks/useUserPaymentCard";
import { useUserPaymentPix } from "../../hooks/useUserPaymentPix";
import { CieloRequestManager } from "../../services/cieloRequestManager";
import { generatePix } from "../../services/pixCielo";
import { Card } from "../../types/Card";
import { generateRandomKey } from "../../utils/activationKeyGenerate";
import { formatCardNumber } from "../../utils/formatCardNumber";
import {
  convertToAmericanDate,
  formatDate,
  formatDateTime,
} from "../../utils/formatDate";
import getAddress from "../../utils/getAddressByCep";
import { isValidCPF } from "../../utils/isValidCpf";
import { transformCardExpirationDate } from "../../utils/transformCardExpirationDate";
import { useUser } from "../../context/userContext";

function getScheduleStartDate(date: string, time: string) {
  return new Date(`${date}T${time}-03:00`);
}

export default function DescriptionReserve({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DescriptionReserve">) {
  const { userData } = useUser();
  const user_id = userData?.id ?? '';
  const schedule_id = route.params.scheduleId;
  const currentTime = new Date();
  const oneHourInMs = 60 * 60 * 1000;
  const [serviceRate, setServiceRate] = useState<number>();
  const [schedulePrice, setSchedulePrice] = useState<number>();
  const [scheduleValuePayed, setScheduleValuePayed] = useState<number>();
  const [showCancelCardModal, setShowCancelCardModal] =
    useState<boolean>(false);
  const [showCardPaymentModal, setShowCardPaymentModal] =
    useState<boolean>(false);
  const [creditCard, setCreditCard] = useState("");
  const [selected, setSelected] = useState("");
  const [showPixPaymentModal, setShowPixPaymentModal] = useState(false);
  const [courtPicture, setCourtPicture] = useState<string>();
  const [schedulingPayDate, setSchedulingPayDate] = useState<Date>();
  const [isPayed, setIsPayed] = useState("payed");
  const [timeDifferenceMs, setTimeDifferenceMs] = useState<number>();
  const [isWithin24Hours, setIsWithin24Hours] = useState<boolean>();
  const [isWithinOneHour, setIsWithinOneHour] = useState<boolean>();
  const [isVanquished, setIsVanquished] = useState<boolean>();
  const [valueAvailableToPay, setValueAvailableToPay] = useState<number>();
  const [fantasyName, setFantasyName] = useState("");
  const [payedPercentage, setPayedPercentage] = useState<number>();
  const [reserveStatus, setReserveStatus] = useState(false);
  const [showCreditCards, setShowCreditCards] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(`user${userData?.id}Cards`, (error, result) => {
      if (error) {
        console.log("Deu ruim mano", error);
      } else {
        const parsedCards = JSON.parse(result || "[]");
        setCards(parsedCards);
        // console.log("Cartões recuperados com sucesso", parsedCards);
      }
    });
  }, [userData?.id]);

  const { data: infoScheduleData } = useInfoSchedule(schedule_id, user_id, {
    onCompleted(data) {
      if (!data?.scheduling.data) return;

      const { valuePayed, serviceRate: receivedServiceRate } =
        data.scheduling.data.attributes;

      setServiceRate(receivedServiceRate);
      setScheduleValuePayed(valuePayed);
      setSchedulingPayDate(new Date(data.scheduling.data.attributes.payDay));
      const schedulingDay = getScheduleStartDate(
        data.scheduling.data.attributes.date,
        data.scheduling.data.attributes.court_availability.data.attributes
          .startsAt,
      );

      setIsPayed(data.scheduling.data.attributes.payedStatus);
      setTimeDifferenceMs(schedulingDay.getTime() - currentTime.getTime());

      if (data.scheduling.data.attributes.court_availability.data) {
        const _valueDisponibleToPay =
          data.scheduling.data.attributes.court_availability.data.attributes
            .value
          -
          valuePayed;
        setValueAvailableToPay(_valueDisponibleToPay);
      }

      if (receivedServiceRate) {
        const denominator =
          data.scheduling.data.attributes.court_availability.data.attributes
            .value;

        if (denominator !== 0) {
          const newValuePayedPercentage =
            data.scheduling.data.attributes.valuePayed / denominator;

          if (
            !isNaN(newValuePayedPercentage) &&
            newValuePayedPercentage >= 0 &&
            newValuePayedPercentage <= 1
          ) {
            setPayedPercentage(newValuePayedPercentage);
          } else {
            console.log(
              "Valor inválido para payedPercentage:",
              newValuePayedPercentage,
            );
          }
        } else {
          console.error(
            "Denominador é zero. Não é possível calcular a porcentagem.",
          );
        }
      }

      if (
        data.scheduling.data.attributes.court_availability.data &&
        data.scheduling.data.attributes.court_availability.data.attributes.court
          .data &&
        data.scheduling.data.attributes.court_availability.data.attributes.court
          .data.attributes.photo.data[0]
      ) {
        const newReserveStatus = data.scheduling.data.attributes.status;
        setReserveStatus(newReserveStatus);

        const newCourtPicture =
          HOST_API +
          data.scheduling.data.attributes.court_availability.data.attributes
            .court.data.attributes.photo.data[0].attributes.url;
        setCourtPicture(newCourtPicture);
      } else {
        setCourtPicture(
          "https://cdn-icons-png.flaticon.com/512/10449/10449616.png",
        );
      }

      if (data.scheduling.data.attributes.court_availability.data) {
        const receivedSchedulePrice =
          data.scheduling.data.attributes.court_availability.data.attributes
            .value;
        setSchedulePrice(receivedSchedulePrice);
        if (
          data.scheduling.data.attributes.court_availability.data.attributes
            .court.data
        )
          setFantasyName(
            data.scheduling.data.attributes.court_availability.data.attributes
              .court.data.attributes.fantasy_name,
          );
      }
    },
  });

  const { data: dataCountry } = useCountries();
  const { data: dataUser } = useGetMenuUser(user_id);
  const { data: allUserData } = useGetUserById(user_id, {
    onCompleted(data) {
      if (data?.usersPermissionsUser.data) {
        setValue("cpf", data.usersPermissionsUser.data.attributes.cpf);
      }
    },
  });
  const { data: dataHistoricPayments } =
    useAllPaymentsSchedulingById(schedule_id);

  const [
    cancelSchedule,
    { loading: loadingCancelSchedule, error: errorCancelSchedule },
  ] = useDeleteSchedule();
  const [addPaymentPix] = useUserPaymentPix();
  const [userPaymentCard] = useUserPaymentCard();
  const [updateScheduleValue] = useUpdateScheduleValue();

  useEffect(() => {
    const _timeDifferenceHours = timeDifferenceMs! / (1000 * 60 * 60);
    setIsWithin24Hours(_timeDifferenceHours <= 24);

    const _timeDifferenceMsPayDate =
      Number(schedulingPayDate) - Number(currentTime);

    const _isWithinOneHour = _timeDifferenceMsPayDate <= oneHourInMs;
    const _isVanquishedDate = schedulingPayDate! < currentTime;
    const _isVanquished = _isVanquishedDate && isPayed !== "payed";

    setIsWithinOneHour(_isWithinOneHour);
    setIsVanquished(_isVanquished);
  }, [timeDifferenceMs, schedulingPayDate]);

  interface iFormCardPayment {
    value: string;
    name: string;
    cpf: string;
    cvv: string;
    date: string;
    cep: string;
    state: string;
    city: string;
    number: string;
    complement: string;
    district: string;
    street: string;
    cardNumber: string;
  }

  interface iFormPixPayment {
    name: string;
    cpf: string;
    value: string;
  }

  const handleCopiarTexto = () => {
    Clipboard.setStringAsync(
      infoScheduleData?.scheduling?.data?.attributes?.activationKey ?? "",
    );

    Toast.show({
      type: "success",
      text1: "Texto copiado",
      text2: "O texto foi copiado para a área de transferência.",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const formSchema = z.object({
    value: z
    .string()
    .nonempty("É necessário inserir um valor")
    .refine(value => {
      const schedulingAmount = valueAvailableToPay;

      if (schedulingAmount) {
        // Remover caracteres não numéricos
        const cleanedValue = value.replace(/[^\d,]/g, '');

        // Substituir a vírgula por ponto
        const dotValue = cleanedValue.replace(',', '.');

        const parsedValue = parseFloat(dotValue);

        if (isNaN(parsedValue)) {
          return false;
        }

        return parsedValue <= schedulingAmount;
      }

      return false;
    }, `O valor inserido excede o valor disponível para pagamento, é possível pagar até R$${valueAvailableToPay}`),
    name: z
      .string()
      .nonempty("É necessário inserir o nome")
      .max(29, "Só é possível digitar até 30 caracteres"),
    cpf: z
      .string()
      .nonempty("É necessário inserir o CPF")
      .max(15, "CPF inválido")
      .refine(isValidCPF, "CPF inválido"),
    cvv: z
      .string()
      .nonempty("É necessário inserir um CVV")
      .max(3, "Só é possível digitar até 3 caracteres")
      .min(3, "O mínimo são 3 caracteres"),
    date: z.string().refine(value => {
      const [month, year] = value.split("/");
      const currentDate = new Date();
      const inputDate = new Date(`20${year}-${month}-01`);

      if (isNaN(inputDate.getTime())) {
        return false;
      }

      return inputDate.getTime() > currentDate.getTime();
    }, "A data de vencimento é inválida"),
    cep: z
      .string()
      .nonempty("É necessário inserir o CEP")
      .min(9, "CEP inválido")
      .max(9, "CEP inválido"),
    number: z.string().nonempty("É necessário inserir o numero da residência"),
    street: z.string().nonempty("É necessário inserir o nome da rua"),
    district: z.string().nonempty("É necessário inserir o bairro"),
    city: z.string().nonempty("É necessário inserir o nome da cidade"),
    state: z
      .string()
      .nonempty("É necessário inserir o estado")
      .min(2, "Inválido")
      .max(2, "Inválido"),
    cardNumber: z
      .string()
      .nonempty("É necessário inserir o número do cartão")
      .min(16, "Inválido"),
  });

  const getCountryImage = (
    countryISOCode: string | null,
  ): string | undefined => {
    try {
      if (countryISOCode && dataCountry) {
        const selectedCountry = dataCountry.countries.data.find(
          country => country.attributes.ISOCode === countryISOCode,
        );

        if (selectedCountry) {
          return HOST_API + selectedCountry.attributes.flag.data.attributes.url;
        }
      }
      return undefined;
    } catch (error) {
      console.error(error);
    }
  };

  const formSchemaPixPayment = z.object({
    value: z
    .string()
    .nonempty("É necessário inserir um valor")
    .refine(value => {
      const schedulingAmount = valueAvailableToPay;

      if (schedulingAmount) {
        // Remover caracteres não numéricos
        const cleanedValue = value.replace(/[^\d,]/g, '');

        // Substituir a vírgula por ponto
        const dotValue = cleanedValue.replace(',', '.');

        const parsedValue = parseFloat(dotValue);

        if (isNaN(parsedValue)) {
          return false;
        }

        return parsedValue <= schedulingAmount;
      }

      return false;
    }, `O valor inserido excede o valor disponível para pagamento, é possível pagar até R$${valueAvailableToPay}`),
    name: z
      .string()
      .nonempty("É necessário inserir o nome")
      .max(29, "Só é possível digitar até 30 caracteres"),
    cpf: z
      .string()
      .nonempty("É necessário inserir o CPF")
      .max(15, "CPF inválido")
      .refine(isValidCPF, "CPF inválido"),
  });

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<iFormCardPayment>({
    resolver: zodResolver(formSchema),
  });

  const {
    control: controlPix,
    handleSubmit: handleSubmitPayment,
    formState: { errors: errorsPix },
    getValues: getValuesPix,
  } = useForm<iFormPixPayment>({
    resolver: zodResolver(formSchemaPixPayment),
  });

  const closeCardPayment = () => {
    setShowCardPaymentModal(false);
  };

  const closePixPayment = () => {
    setShowPixPaymentModal(false);
  };

  const handlePay = handleSubmit(async data => {
    try {
      const totalValue = data.value.split("R$ ")[1];
      let parsedValue: number;

      // Transformar de reais pra centavos
      if (totalValue.includes(",")) {
        if (totalValue.includes(".")) {
          parsedValue = Number(
            totalValue.split(".").join("").split(",").join(""),
          );
        } else {
          parsedValue = Number(totalValue.split(",").join(""));
        }
      } else {
        parsedValue = Number(Number(totalValue) * 100);
      }

      console.log({ parsedValue });
      if (!allUserData?.usersPermissionsUser.data) return;

      const cieloRequestManager = new CieloRequestManager();

      const address: CieloAddress = {
        Street: data.street,
        Number: data.number,
        Complement: data.complement ? data.complement : "",
        ZipCode: data.cep,
        City: data.city,
        State: data.state,
        Country: "BRA",
      };

      const body: AuthorizeCreditCardPaymentResponse = {
        MerchantOrderId: "2014111701",
        Customer: {
          Name: data.name,
          Identity: data.cpf,
          IdentityType: "cpf",
          Email: allUserData.usersPermissionsUser.data.attributes.email,
          Birthdate: "1991-01-02",
          Address: address,
          DeliveryAddress: address,
        },
        Payment: {
          Type: "CreditCard",
          Amount: parsedValue,
          Currency: "BRL",
          Country: "BRA",
          Provider: "Simulado",
          ServiceTaxAmount: 0,
          Installments: 1,
          Interest: "ByMerchant",
          Capture: "true",
          Authenticate: "false",
          Recurrent: "false",
          CreditCard: {
            CardNumber: data.cardNumber.split(" ").join(""),
            Holder: data.name,
            ExpirationDate: transformCardExpirationDate(data.date),
            SecurityCode: data.cvv,
            SaveCard: false,
            Brand: "Visa",
          },
        },
      };

      const response = await cieloRequestManager.authorizePayment(body);
      console.log(response);
      if (!schedule_id) return;

      try {
        await userPaymentCard({
          variables: {
            value: Number(response.Payment.Amount / 100),
            schedulingId: schedule_id,
            userId: user_id,
            name: data.name,
            cpf: data.cpf,
            cvv: parseInt(data.cvv),
            date: convertToAmericanDate(data.date),
            countryID: "1",
            publishedAt: new Date().toISOString(),
            cep: data.cep,
            city: data.city,
            complement: data.complement,
            number: data.number,
            state: data.state,
            neighborhood: data.district,
            street: data.street,
            paymentId: response.Payment.PaymentId!,
            payedStatus: response.Payment.Status === 2 ? "Payed" : "Waiting",
          },
        });
      }catch(error){
        alert(error)
      }
      await scheduleValueUpdate(
        parseFloat(data.value.replace(/[^\d.,]/g, "").replace(",", ".")),
      );

      setShowCardPaymentModal(false);
      alert(
        "Pagamento efetuado com sucesso, recarregue a pagina para visualizar as atualizações!",
      );
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error);
    }
  });

  const scheduleValueUpdate = async (value: number) => {
    let validatePayment =
      value + scheduleValuePayed! >= schedulePrice! ? "payed" : "waiting";
    let valuePayedUpdate = value + scheduleValuePayed!;
    let activation_key =
      value + scheduleValuePayed! >= schedulePrice!
        ? generateRandomKey(4)
        : null;

    try {
      await updateScheduleValue({
        variables: {
          payed_status: validatePayment,
          scheduling_id: parseInt(schedule_id),
          value_payed: valuePayedUpdate,
          activated: false,
          activation_key: activation_key,
        },
      });

      console.log("sucesso!");
    } catch (error) {
      console.log("Erro na mutação updateValueSchedule", error);
    }
  };

  const handlePayPix = handleSubmitPayment(async info => {
    const parsedValue = parseFloat(
      info.value.replace(/[^\d.,]/g, ""),
    );

    const generatePixJSON: RequestGeneratePix = {
      MerchantOrderId:
        schedule_id + user_id + generateRandomKey(3) + new Date().toISOString(),
      Customer: {
        Name: info.name,
        Identity: info.cpf,
        IdentityType: "CPF",
      },
      Payment: {
        Type: "Pix",
        Amount: 1,
      },
    };

    const pixGenerated = await generatePix(generatePixJSON);
    await addPaymentPix({
      variables: {
        name: info.name,
        cpf: info.cpf,
        value: parsedValue,
        schedulingID: schedule_id,
        userID: user_id,
        paymentID: pixGenerated.Payment.PaymentId,
        publishedAt: new Date().toISOString(),
      },
    }).then(response =>
      navigation.navigate("PixScreen", {
        courtName: fantasyName ?? "",
        value: parsedValue.toString()!,
        QRcodeURL: pixGenerated.Payment.QrCodeString,
        paymentID: pixGenerated.Payment.PaymentId,
        userPaymentPixID: response.data?.createUserPaymentPix.data.id!,
        scheduleID: Number(schedule_id)!,
        serviceRate: serviceRate!,
        schedulePrice: schedulePrice!,
        scheduleValuePayed: scheduleValuePayed!,
        screen: "historic",
      }),
    );
    setShowPixPaymentModal(false);
  });

  const deleteSchedule = async (idSchedule: number) => {
    try {
      await cancelSchedule({
        variables: {
          scheduling_id: idSchedule,
        },
      });

      !loadingCancelSchedule || !errorCancelSchedule
        ? navigation.navigate("InfoReserva")
        : null;
    } catch (error) {
      null;
    }
  };

  function share() {
    console.log("--- SHARE FUNCTION HAS BEEN TRIGGERED ---");
    alert("--- SHARE FUNCTION HAS BEEN TRIGGERED ---");
  }

  // TODO: TRANSFORMAR TUDO EM USE STATE --- FIX
  const usersPaymentsPixes =
    dataHistoricPayments?.scheduling?.data?.attributes?.user_payment_pixes
      ?.data ?? [];

  const usersPayments =
    dataHistoricPayments?.scheduling?.data?.attributes?.user_payments?.data ??
    [];

  const mergedPayments = [...usersPaymentsPixes, ...usersPayments].sort(
    (a, b) =>
      new Date(a.attributes.createdAt).getTime() -
      new Date(b.attributes.createdAt).getTime(),
  );

  const paymentData = {
    data: mergedPayments,
  };

  const ownerUserPaymentsPixes =
    infoScheduleData?.scheduling?.data?.attributes?.user_payments?.data ?? [];

  const ownerUserPayments =
    infoScheduleData?.scheduling?.data?.attributes?.user_payment_pixes?.data ??
    [];

  const mergedOwnerPayments = [
    ...ownerUserPaymentsPixes,
    ...ownerUserPayments,
  ].sort(
    (a, b) =>
      new Date(a.attributes.createdAt).getTime() -
      new Date(b.attributes.createdAt).getTime(),
  );

  const ownerPaymentsData = {
    data: mergedOwnerPayments,
  };

  return (
    <View className="flex-1 bg-zinc-600">
      <View className="h-11 w-max bg-zinc-900"></View>
      <View className="h-16 w-max bg-zinc-900 flex-row items-center justify-between px-5">
        <TouchableOpacity onPress={navigation.goBack}>
          <Entypo name="chevron-left" size={24} color="white" />
        </TouchableOpacity>

        <View className="flex item-center justify-center">
          <Text className="text-lg font-bold text-white">RESERVA</Text>
        </View>
        <View className="h-max w-max flex justify-center items-center">
          {dataUser?.usersPermissionsUser.data?.attributes.photo.data
            ?.attributes.url ? (
            <TouchableOpacity
              className="w-12 h-12"
              onPress={() => {
                navigation.navigate("ProfileSettings", {
                  userPhoto:
                    dataUser!.usersPermissionsUser.data!.attributes.photo.data!
                      .attributes.url,
                });
              }}
            >
              <Image
                source={{
                  uri:
                    HOST_API +
                    dataUser?.usersPermissionsUser.data?.attributes.photo.data
                      ?.attributes.url ?? "",
                }}
                style={{ width: 46, height: 46 }}
                borderRadius={100}
              />
            </TouchableOpacity>
          ) : (
            <View className="w-12 h-12" />
          )}
        </View>
      </View>
      <ScrollView>
        <View className="h-6" />
        <View className="flex w-max h-fit bg-zinc-900 px-5 pb-2">
          <View className="flex-row items-start justify-start w-max h-max pt-2">
            <View>
              <Image
                source={{ uri: courtPicture }}
                style={{ width: 138, height: 90 }}
                borderRadius={5}
              />
            </View>
            <View className="flex item-start h-24 w-max">
              <View className="flex justify-start items-start h-max w-max pl-1">
                <View className="flex-row justify-between items-center w-48">
                  <View className="flex items-center justify-center">
                    <Text className="font-black text-base text-orange-600">
                      {fantasyName}
                    </Text>
                  </View>
                  {infoScheduleData?.scheduling.data?.attributes.owner.data &&
                    user_id ===
                    infoScheduleData.scheduling.data.attributes.owner.data
                      .id ? (
                    !isWithin24Hours && reserveStatus ? (
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => {
                          navigation.navigate("UpdateSchedule", {
                            courtId:
                              infoScheduleData.scheduling.data.attributes
                                .court_availability.data.attributes.court.data
                                .id,
                            courtName: fantasyName,
                            courtImage: courtPicture!,
                            userPhoto:
                              dataUser?.usersPermissionsUser?.data?.attributes
                                ?.photo?.data?.attributes?.url!,
                            valuePayed: scheduleValuePayed!,
                            scheduleUpdateID: schedule_id,
                            activationKey:
                              infoScheduleData?.scheduling?.data?.attributes
                                ?.activationKey || null,
                          });
                        }}
                        disabled={!reserveStatus}
                      >
                        <View>
                          <Text className="font-normal text-xs text-orange-600">
                            Editar
                          </Text>
                        </View>
                        <View className="flex items-center justify-center pl-4">
                          <TextInput.Icon
                            icon={"pencil"}
                            size={15}
                            color={"#FF6112"}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : null
                  ) : null}
                </View>
                <View>
                  <Text className="font-normal text-xs text-white">
                    {fantasyName}
                  </Text>
                </View>
                <View className="flex-row pt-2">
                  {infoScheduleData?.scheduling.data && (
                    <View>
                      <Text className="font-black text-xs text-white">
                        Reserva feita em{" "}
                        {formatDateTime(
                          infoScheduleData?.scheduling?.data?.attributes?.createdAt.toString()! ??
                          "",
                        )}
                      </Text>
                    </View>
                  )}
                </View>
                {infoScheduleData?.scheduling.data?.attributes.owner.data &&
                  isWithinOneHour !== undefined &&
                  user_id ===
                  infoScheduleData.scheduling.data.attributes.owner.data.id
                  ? !isWithinOneHour && (
                    <View className="pt-2">
                      {reserveStatus && (
                        <Text
                          className="font-black text-xs text-red-500"
                          onPress={() => setShowCancelCardModal(true)}
                        >
                          CANCELAR
                        </Text>
                      )}
                    </View>
                  )
                  : null}
              </View>
            </View>
          </View>
          <View className="h-2"></View>
          <View>
            <Text className="font-black text-xs text-white pb-1">STATUS :</Text>
          </View>
          {infoScheduleData?.scheduling.data?.attributes.court_availability
            .data &&
            typeof serviceRate === "number" &&
            infoScheduleData.scheduling.data.attributes.valuePayed <
            infoScheduleData.scheduling.data.attributes.court_availability.data
              .attributes.value ? (
            <>
              <View
                style={{ width: "100%", justifyContent: "center" }}
                className="relative"
              >
                <Text className="absolute z-10 self-center text-white font-bold">
                  R${" "}
                  {infoScheduleData.scheduling.data.attributes.valuePayed.toFixed(
                    2,
                  )}{" "}
                  / R${" "}
                  {infoScheduleData.scheduling.data.attributes.court_availability.data.attributes.value.toFixed(
                    2,
                  )}
                </Text>
                {infoScheduleData.scheduling.data.attributes.valuePayed &&
                  infoScheduleData.scheduling.data.attributes.court_availability
                    .data.attributes.value &&
                  payedPercentage !== undefined && (
                    <ProgressBar
                      progress={payedPercentage}
                      width={null}
                      height={30}
                      borderRadius={5}
                      color={!reserveStatus ? "rgb(166,166,166)" : "#0FA958"}
                      unfilledColor={
                        !reserveStatus ? "rgb(166,166,166, 66)" : "#0FA95866"
                      }
                    />
                  )}
              </View>
              <View className="h-18 w-full flex items-center">
                {reserveStatus ? (
                  <View className="w-60 pt-2 item-center">
                    <Countdown
                      targetDate={getScheduleStartDate(
                        infoScheduleData.scheduling.data.attributes.date,
                        infoScheduleData.scheduling.data.attributes
                          .court_availability.data.attributes.startsAt,
                      )}
                    />
                  </View>
                ) : (
                  <Text className="py-4 text-base font-bold">
                    A reserva não está mais disponível
                  </Text>
                )}
              </View>
            </>
          ) : (
            <>
              {infoScheduleData?.scheduling.data?.attributes.court_availability
                .data && (
                  <View
                    style={{ width: "100%", justifyContent: "center" }}
                    className="relative"
                  >
                    <Text className="absolute z-10 self-center text-white font-bold">
                      Pagamento efetuado
                    </Text>
                    {payedPercentage !== undefined && (
                      <ProgressBar
                        progress={payedPercentage}
                        width={null}
                        height={30}
                        borderRadius={5}
                        color="#0FA958"
                        unfilledColor="#0FA95866"
                      />
                    )}
                  </View>
                )}
            </>
          )}
          {infoScheduleData?.scheduling.data?.attributes.owner.data &&
            isVanquished !== undefined &&
            !isWithinOneHour &&
            infoScheduleData.scheduling.data.attributes.owner.data.id !==
            user_id ? (
            <>
              {!isVanquished && reserveStatus ? (
                infoScheduleData.scheduling.data.attributes.payedStatus ===
                  "waiting" ? (
                  <View className="h-max w-full flex justify-center items-center pl-2">
                    <TouchableOpacity
                      className="pt-2 pb-5"
                      onPress={() => setShowCardPaymentModal(true)}
                      disabled={!reserveStatus}
                    >
                      <View className="w-64 h-10 bg-white rounded-sm flex-row items-center">
                        <View className="w-1"></View>
                        <View className="h-5 w-5 items-center justify-center">
                          <TextInput.Icon
                            icon={"credit-card-plus-outline"}
                            size={21}
                            color={"#FF6112"}
                          />
                        </View>
                        <View className="item-center justify-center">
                          <Text className="font-black text-xs text-center text-gray-400 pl-1">
                            Adicionar Pagamento
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="pb-2"
                      onPress={() => setShowPixPaymentModal(true)}
                      disabled={!reserveStatus}
                    >
                      <View
                        className={"h-10 w-64 rounded-md flex items-center justify-center ".concat(
                          !reserveStatus ? "bg-zinc-500" : "bg-orange-500",
                        )}
                      >
                        <Text className="text-gray-50 font-bold">
                          Adicionar pagamento PIX
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null
              ) : null}
            </>
          ) : (
            <>
              {infoScheduleData?.scheduling.data?.attributes.court_availability
                .data &&
                typeof serviceRate === "number" &&
                isVanquished !== undefined &&
                !isVanquished &&
                !isWithinOneHour &&
                reserveStatus ? (
                infoScheduleData.scheduling.data.attributes.valuePayed <
                  infoScheduleData.scheduling.data.attributes.court_availability
                    .data.attributes.value ? (
                  <View className="h-28 w-60 flex-row  pr-5">
                    <View className="h-max w-max  justify-center items-start">
                      <View className="flex-row item-center justify-center">
                        <TouchableOpacity
                          onPress={() => share()}
                          className="flex-row"
                        >
                          <View className="h-5 w-5 items-center justify-center">
                            <TextInput.Icon
                              icon={"share-variant"}
                              size={21}
                              color={"#FF6112"}
                            />
                          </View>
                          <View className="item-center justify-center">
                            <Text className="font-black text-xs text-center text-white pl-1">
                              Compartilhar
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="h-max w-full flex justify-between pl-2">
                      <TouchableOpacity
                        className="pt-2"
                        onPress={() => setShowCardPaymentModal(true)}
                        disabled={!reserveStatus}
                      >
                        <View className="w-30 h-10 bg-white rounded-sm flex-row items-center">
                          <View className="w-1"></View>
                          <View className="h-5 w-5 items-center justify-center">
                            <TextInput.Icon
                              icon={"credit-card-plus-outline"}
                              size={21}
                              color={"#FF6112"}
                            />
                          </View>
                          <View className="item-center justify-center">
                            <Text className="font-black text-xs text-center text-gray-400 pl-1">
                              Adicionar Pagamento
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="pb-2"
                        onPress={() => setShowPixPaymentModal(true)}
                        disabled={!reserveStatus}
                      >
                        <View className="h-10 w-30 rounded-md bg-orange-500 flex items-center justify-center">
                          <Text className="text-gray-50 font-bold">
                            Copiar código PIX
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View className="h-20 w-60 flex-row pr-5 items-center">
                    <View className=" w-max  justify-center items-start">
                      <View className="flex-row item-center justify-center">
                        <TouchableOpacity
                          onPress={() => share()}
                          className="flex-row"
                          disabled={!reserveStatus}
                        >
                          <View className="h-5 w-5 items-center justify-center">
                            <TextInput.Icon
                              icon={"share-variant"}
                              size={21}
                              color={"#FF6112"}
                            />
                          </View>
                          <View className="item-center justify-center">
                            <Text className="font-black text-xs text-center text-white pl-1">
                              Compartilhar
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View className="h-max w-full flex justify-between pl-2">
                      <TouchableOpacity onPress={() => handleCopiarTexto()}>
                        <View className="w-30 h-10 bg-white rounded-sm flex-row items-center justify-between">
                          <Text className="font-semibold text-xs text-black pl-2">
                            Código de ativação:
                          </Text>
                          <Text className="font-black text-sm text-center text-gray-400 pl-1 pr-7">
                            {
                              infoScheduleData.scheduling.data.attributes
                                .activationKey
                            }
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              ) : null}
            </>
          )}
        </View>
        <View className="h-max w-full  px-5 items-center justify-start pt-4">
          {ownerPaymentsData !== undefined && ownerPaymentsData !== null ? (
            <>
              <View>
                <Text className="text-gray-50 font-black">
                  MEUS PAGAMENTOS:
                </Text>
              </View>
              {ownerPaymentsData.data.map((paymentInfo, index) => (
                <View className="w-full pt-5" key={index}>
                  <View className="h-14 w-30 rounded-md bg-white flex-row items-center justify-between">
                    <Text className="text-black font-normal pl-4">
                      {
                        paymentInfo?.attributes?.users_permissions_user?.data
                          ?.attributes?.username
                      }
                    </Text>
                    <Text className="text-black font-normal">
                      {formatDate(
                        paymentInfo?.attributes?.createdAt.toString()!,
                      )}
                    </Text>
                    <Text className="text-black font-normal pr-4">
                      R${paymentInfo?.attributes?.value}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text className="text-gray-50 font-black">MEUS PAGAMENTOS:</Text>
              <Text className="text-gray-50 font-semibold text-center pt-3">
                Realize um pagamento e as Informações serão mostradas aqui uma
                vez que ela for efetuada
              </Text>
            </>
          )}
          <View className="pt-6">
            <Text className="text-gray-50 font-black">
              HISTÓRICO DE PAGAMENTOS :
            </Text>
          </View>
          <View className="pt-3 w-full">
            {paymentData.data !== undefined && paymentData.data !== null ? (
              paymentData.data.map((paymentInfo, index) => (
                <ScrollView key={index}>
                  <View className="w-full pt-5">
                    <View className="h-14 w-30 rounded-md bg-white flex-row items-center justify-between">
                      <Text className="text-black font-normal pl-4">
                        {
                          paymentInfo?.attributes?.users_permissions_user?.data
                            ?.attributes?.username
                        }
                      </Text>
                      <Text className="text-black font-normal">
                        {formatDate(
                          paymentInfo?.attributes?.createdAt.toString()!,
                        )}
                      </Text>
                      <Text className="text-black font-normal pr-4">
                        R${paymentInfo?.attributes?.value}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              ))
            ) : (
              <Text className="text-gray-50 font-semibold text-center">
                Compartilhe essa página ! Informações serão mostradas aqui uma
                vez que outros realisem pagamentos{" "}
              </Text>
            )}
          </View>
        </View>
        <View className="h-20"></View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
        <BottomBlackMenu
          screen="EstablishmentInfo"
          userPhoto={
            dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
              ?.attributes?.url
              ? HOST_API +
              dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url
              : null
          }
          key={1}
          isMenuVisible={false}
          paddingTop={2}
        />
      </View>
      <Modal
        transparent
        animationType="slide"
        visible={showCardPaymentModal}
        onRequestClose={closeCardPayment}
      >
        <View className="bg-black bg-opacity-10 flex-1 justify-center items-center">
          <View className="bg-[#292929] h-fit w-11/12 justify-center">
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={closeCardPayment}
              className="bg-[#FF6112] mt-8 mb-4 mr-4 rounded-full w-6 aspect-square items-center justify-center self-end"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 36,
              }}
            >
              <TouchableOpacity onPress={() => setShowCreditCards(true)}>
                <Text className="text-sm text-[#FF6112]">Cartões</Text>
                <View className="w-full h-14 flex flex-row justify-between items-center p-3 border border-neutral-400 rounded bg-white">
                  <FontAwesome
                    name="credit-card-alt"
                    size={24}
                    color="#FF6112"
                  />
                  <Icon
                    size={25}
                    color="#FF4715"
                    name={showCreditCards ? "chevron-up" : "chevron-down"}
                  />
                </View>
              </TouchableOpacity>
              {showCreditCards ? (
                cards.length > 0 ? (
                  <View className="border-gray-500 mt-2">
                    {cards.map(card => (
                      <Fragment key={card.id}>
                        <TouchableOpacity
                          className="flex h-[60px] w-full rounded-xl border justify-center items-start bg-white"
                          onPress={() => {
                            setShowCreditCards(false);
                            setValue("cardNumber", card.number);
                            setValue("date", card.maturityDate);
                            setValue("cep", card.cep);
                            setValue("number", card.houseNumber);
                            setValue("street", card.street);
                            setValue("district", card.district);
                            setValue("complement", card.complement ?? "");
                            setValue("city", card.city);
                            setValue("state", card.state);
                          }}
                        >
                          <View className="before:absolute before:w-1 before:h-12 before:bg-[#F5620F] before:content left-2.5" />

                          <View className="flex-row pl-5 items-center">
                            <Text className="font-bold text-base">
                              {formatCardNumber(card.number)}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        <View className="h-2" />
                      </Fragment>
                    ))}
                  </View>
                ) : (
                  <Text className="font-bold text-sm text-[#808080] text-center">
                    Você não possui nenhum cartão cadastrado no momento
                  </Text>
                )
              ) : null}

              <View className="flex gap-y-2.5 mt-2.5">
                <View>
                  <Text className="text-sm text-[#FF6112]">Nome</Text>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: nome"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {errors.name && (
                    <Text className="text-red-400 text-sm">
                      {errors.name.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">
                    Número do cartão
                  </Text>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: 0000 0000 0000 0000"
                        mask={Masks.CREDIT_CARD}
                        keyboardType={"numeric"}
                        value={getValues("cardNumber")}
                        maxLength={19}
                        onChangeText={onChange}
                      ></MaskInput>
                    )}
                  ></Controller>
                  {errors.name && (
                    <Text className="text-red-400 text-sm">
                      {errors.name.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">CPF</Text>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: 000.000.000-00"
                        maxLength={14}
                        value={getValues("cpf")}
                        onChangeText={onChange}
                        mask={Masks.BRL_CPF}
                        keyboardType="numeric"
                      ></MaskInput>
                    )}
                  ></Controller>
                  {errors.cpf && (
                    <Text className="text-red-400 text-sm">
                      {errors.cpf.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">
                    Valor da contribuição
                  </Text>
                  <Controller
                    name="value"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: R$ 30,00"
                        value={getValues("value")}
                        onChangeText={onChange}
                        mask={Masks.BRL_CURRENCY}
                        keyboardType="numeric"
                      ></MaskInput>
                    )}
                  ></Controller>
                  {errors.value && (
                    <Text className="text-red-400 text-sm">
                      {errors.value.message}
                    </Text>
                  )}
                </View>
              </View>
              <View className="h-[1px] w-full mt-[20px] mb-[20px] border border-[#4B4B4B] border-dashed"></View>
              <View className="flex gap-y-[10px]">
                <View className=" w-full flex flex-row p-3 border border-neutral-400 rounded bg-white items-center justify-between">
                  <View className="flex flex-row items-center">
                    <TouchableOpacity>
                      <Image
                        className="h-5 w-6"
                        source={require("../../assets/new_credit_card.png")}
                      ></Image>
                    </TouchableOpacity>
                    <MaskInput
                      className="bg-white w-10/12"
                      placeholder=""
                      value={creditCard}
                      onChangeText={setCreditCard}
                      mask={Masks.CREDIT_CARD}
                      keyboardType="numeric"
                    ></MaskInput>
                  </View>
                  <TouchableOpacity>
                    <Image source={require("../../assets/camera.png")}></Image>
                  </TouchableOpacity>
                </View>
                <View className="flex flex-row justify-between gap-x-6">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">
                      Data de Venc.
                    </Text>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <TextInputMask
                          className="p-3 border border-neutral-400 rounded bg-white"
                          options={{
                            format: "MM/YY",
                          }}
                          type={"datetime"}
                          value={getValues("date")}
                          onChangeText={onChange}
                          placeholder="MM/YY"
                          keyboardType="numeric"
                          maxLength={5}
                        />
                      )}
                    ></Controller>
                    {errors.date && (
                      <Text className="text-red-400 text-sm">
                        {errors.date.message}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">CVV</Text>
                    <Controller
                      name="cvv"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className="p-3 border border-neutral-400 rounded bg-white"
                          placeholder="123"
                          onChangeText={onChange}
                          keyboardType="numeric"
                          value={getValues("cvv")}
                          maxLength={3}
                        ></MaskInput>
                      )}
                    ></Controller>
                    {errors.cvv && (
                      <Text className="text-red-400 text-sm">
                        {errors.cvv.message}
                      </Text>
                    )}
                  </View>
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">País</Text>
                  <View className="flex flex-row items-center p-3 border border-neutral-400 rounded bg-white">
                    <Image
                      className="h-[21px] w-[30px] mr-[15px] rounded"
                      source={{ uri: getCountryImage(selected) }}
                    />
                    <SelectList
                      setSelected={(val: string) => {
                        setSelected(val);
                      }}
                      data={
                        dataCountry?.countries.data.map(country => ({
                          value: country.attributes.ISOCode,
                          label: country.attributes.ISOCode,
                          img: `${HOST_API}${country.attributes.flag.data?.attributes.url ?? ""
                            }`,
                        })) ?? []
                      }
                      save="value"
                      placeholder="Selecione um país"
                      searchPlaceholder="Pesquisar..."
                    />
                  </View>
                </View>
                <View className="flex flex-row justify-between gap-x-6">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">CEP</Text>
                    <Controller
                      name="cep"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className="p-3 border border-neutral-400 rounded bg-white"
                          placeholder="Ex: 00000-000"
                          value={getValues("cep")}
                          maxLength={9}
                          mask={Masks.ZIP_CODE}
                          onChangeText={masked => {
                            onChange(masked);

                            if (masked.length === 9) {
                              getAddress(masked)
                                .then(response => {
                                  console.log(response);
                                  setValue("cep", response.code);
                                  setValue("street", response.address);
                                  setValue("district", response.district);
                                  setValue("city", response.city);
                                  setValue("state", response.state);
                                })
                                .catch(error => {
                                  console.log(error);
                                  Dialog.show({
                                    type: ALERT_TYPE.WARNING,
                                    title:
                                      "Não foi possível encontrar o endereço",
                                    textBody:
                                      "Verifique se o CEP inserido é válido",
                                  });
                                });
                            }
                          }}
                          keyboardType="numeric"
                        />
                      )}
                    />
                    {errors.cep && (
                      <Text className="text-red-400 text-sm">
                        {errors.cep.message}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">Numero</Text>
                    <Controller
                      name="number"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className="p-3 border border-neutral-400 rounded bg-white"
                          placeholder="Ex: 0000"
                          value={getValues("number")}
                          onChangeText={onChange}
                          keyboardType="numeric"
                        ></MaskInput>
                      )}
                    ></Controller>
                    {errors.number && (
                      <Text className="text-red-400 text-sm">
                        {errors.number.message}
                      </Text>
                    )}
                  </View>
                </View>

                <View>
                  <Text className="text-sm text-[#FF6112]">Rua</Text>
                  <Controller
                    name="street"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: Rua xxxx"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {errors.street && (
                    <Text className="text-red-400 text-sm">
                      {errors.street.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">Bairro</Text>
                  <Controller
                    name="district"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: Jd. xxxxx"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                  {errors.district && (
                    <Text className="text-red-400 text-sm">
                      {errors.district.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112]">Complemento</Text>
                  <Controller
                    name="complement"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <MaskInput
                        className="p-3 border border-neutral-400 rounded bg-white"
                        placeholder="Ex: "
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
                <View className="flex flex-row justify-between gap-x-6">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">Cidade</Text>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className="p-3 border border-neutral-400 rounded bg-white"
                          placeholder="Ex: xxxx"
                          value={getValues("city")}
                          onChangeText={onChange}
                        ></MaskInput>
                      )}
                    ></Controller>
                    {errors.city && (
                      <Text className="text-red-400 text-sm">
                        {errors.city.message}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112]">Estado</Text>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <MaskInput
                          className="p-3 border border-neutral-400 rounded bg-white"
                          placeholder="Ex: xxxx"
                          value={getValues("state")}
                          onChangeText={onChange}
                        ></MaskInput>
                      )}
                    ></Controller>
                    {errors.state && (
                      <Text className="text-red-400 text-sm">
                        {errors.state.message}
                      </Text>
                    )}
                  </View>
                </View>
                <View>
                  <Button
                    mode="contained"
                    onPress={handlePay}
                    disabled={isSubmitting}
                    style={{
                      height: 50,
                      width: "100%",
                      backgroundColor: "#FF6112",
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size={24} color="white" />
                    ) : (
                      <Text className="text-base text-white">
                        EFETUAR PAGAMENTO
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={showPixPaymentModal}
        onRequestClose={closePixPayment}
      >
        <View className="bg-black bg-opacity-10 flex-1 justify-center items-center">
          <View className="bg-[#292929] h-fit w-11/12 p-6 justify-center">
            <View className="flex gap-y-[10px]">
              <View>
                <Text className="text-sm text-[#FF6112]">Nome</Text>
                <Controller
                  name="name"
                  control={controlPix}
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      className="p-3 border border-neutral-400 rounded bg-white"
                      placeholder="Ex: nome"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errorsPix.name && (
                  <Text className="text-red-400 text-sm">
                    {errorsPix.name.message}
                  </Text>
                )}
              </View>
              <View>
                <Text className="text-sm text-[#FF6112]">CPF</Text>
                <Controller
                  name="cpf"
                  control={controlPix}
                  render={({ field: { value, onChange } }) => (
                    <MaskInput
                      className="p-3 border border-neutral-400 rounded bg-white"
                      placeholder="Ex: 000.000.000-00"
                      value={value}
                      onChangeText={onChange}
                      mask={Masks.BRL_CPF}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errorsPix.cpf && (
                  <Text className="text-red-400 text-sm">
                    {errorsPix.cpf.message}
                  </Text>
                )}
              </View>
              <View>
                <Text className="text-sm text-[#FF6112]">
                  Valor da contribuição
                </Text>
                <Controller
                  name="value"
                  control={controlPix}
                  render={({ field: { value, onChange } }) => (
                    <MaskInput
                      className="p-3 border border-neutral-400 rounded bg-white"
                      placeholder="Ex: R$ 30,00"
                      value={value}
                      onChangeText={onChange}
                      mask={Masks.BRL_CURRENCY}
                      keyboardType="numeric"
                    />
                  )}
                />
                {errorsPix.value && (
                  <Text className="text-red-400 text-sm">
                    {errorsPix.value.message}
                  </Text>
                )}
              </View>
            </View>
            <View>
              <Button
                mode="contained"
                onPress={handlePayPix}
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "#FF6112",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text className="text-base text-white">EFETUAR PAGAMENTO</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={showCancelCardModal}
        onRequestClose={() => setShowCancelCardModal(false)}
      >
        <View className="flex-1 justify-center items-center h-screen w-screen">
          <View className="h-40 w-80 bg-gray-700 justify-center items-center border-solid border-4 border-orange-600">
            <Text className="text-base text-white font-black text-center">
              Tem certeza que deseja{" "}
              <Text className="text-red-600 font-black">cancelar</Text> o
              agendamento?
            </Text>
            <View className="justify-center items-center flex-row pt-10">
              <View className="pr-5">
                <Button
                  className="h-10 w-14 rounded-md bg-zinc-900 flex items-center justify-center"
                  onPress={() => setShowCancelCardModal(false)}
                >
                  <Text className="text-gray-50">NÃO</Text>
                </Button>
              </View>
              <View>
                <Button
                  className="h-10 w-14 rounded-md bg-zinc-900 flex items-center justify-center"
                  onPress={() => deleteSchedule(parseFloat(schedule_id))}
                >
                  <Text className="text-gray-50">SIM</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
