import { FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { TextInputMask } from "react-native-masked-text";
import SvgUri from "react-native-svg-uri";
import Icon from "react-native-vector-icons/Ionicons";
import { z } from "zod";
import { calculateDistance } from "../../components/calculateDistance/calculateDistance";
import useCountries from "../../hooks/useCountries";
import { useReserveInfo } from "../../hooks/useInfoReserve";
import { useRegisterSchedule } from "../../hooks/useRegisterSchedule";
import useUpdateCourtAvailabilityStatus from "../../hooks/useUpdateCourtAvailabilityStatus";
import { useGetUserById } from "../../hooks/useUserById";
import { useUserPaymentCard } from "../../hooks/useUserPaymentCard";
import { useUserPaymentPix } from "../../hooks/useUserPaymentPix";
import { CieloRequestManager } from "../../services/cieloRequestManager";
import { generatePix } from "../../services/pixCielo";
import { generateRandomKey } from "../../utils/activationKeyGenerate";
import { convertToAmericanDate } from "../../utils/formatDate";
import getAddress from "../../utils/getAddressByCep";
import { isValidCPF } from "../../utils/isValidCpf";
import storage from "../../utils/storage";
import { transformCardExpirationDate } from "../../utils/transformCardExpirationDate";

const formSchema = z.object({
  name: z
    .string({ required_error: "É necessário inserir o nome" })
    .max(29, { message: "Só é possivel digitar até 30 caracteres" }),
  cpf: z
    .string({ required_error: "É necessário inserir o CPF" })
    .max(15, { message: "CPF invalido" })
    .refine(isValidCPF, { message: "CPF inválido" }),
  cvv: z
    .string({ required_error: "É necessário inserir um CVV" })
    .max(3, { message: "Só é possivel digitar até 3 caracteres" })
    .min(3, { message: "O minimo são 3 caracteres" }),
  date: z
    .string({ required_error: "É necessário inserior a data de vencimento" })
    .refine(
      value => {
        const [month, year] = value.split("/");
        const numericMonth = parseInt(month, 10);
        const numericYear = parseInt(year, 10);
        if (isNaN(numericMonth) || isNaN(numericYear)) {
          return false;
        }
        if (numericMonth < 1 || numericMonth > 12) {
          return false;
        }
        const currentDate = new Date();
        const inputDate = new Date(`20${year}-${month}-01`);
        if (isNaN(inputDate.getTime())) {
          return false;
        }
        return inputDate > currentDate;
      },
      { message: "A data de vencimento é inválida" },
    ),
  cep: z
    .string({ required_error: "É necessário inserir o CEP" })
    .nonempty("É necessário inserir o CEP")
    .min(8, "CEP inválido")
    .max(9, "CEP inválido"),
  number: z
    .string({ required_error: "É necessário inserir o número da residência" })
    .nonempty("É necessário inserir o número da residência"),
  street: z
    .string({ required_error: "É necessário inserir o nome da rua" })
    .nonempty("É necessário inserir o nome da rua"),
  district: z
    .string({ required_error: "É necessário inserir o bairro" })
    .nonempty("É necessário inserir o bairro"),
  city: z
    .string({ required_error: "É necessário inserir o nome da cidade" })
    .nonempty("É necessário inserir o nome da cidade"),
  state: z
    .string({ required_error: "É necessário inserir o estado" })
    .nonempty("É necessário inserir o estado")
    .min(2, "Inválido")
    .max(2, "Inválido"),
  cardNumber: z
    .string({ required_error: "É necessário inserir o número do cartão" })
    .nonempty("É necessário inserir o número do cartão"),
});

export interface iFormCardPayment {
  name: string;
  cpf: string;
  cvv: string;
  date: string;
  cep: string;
  number: string;
  street: string;
  district: string;
  complement: string;
  city: string;
  state: string;
  cardNumber: string;
}

export default function ReservationPaymentSign({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ReservationPaymentSign">) {
  const {
    courtId,
    courtImage,
    userId,
    courtAvailabilityDate,
    courtAvailabilities,
  } = route.params;

  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [reserveValue, setReserveValue] = useState<number>();
  const [serviceValue, setServiceValue] = useState<number>();
  const [userName, setUserName] = useState<string>();
  const [userCPF, setUserCPF] = useState<string>();
  const [courtName, setCourtName] = useState<string>();
  const [signalValueValidate, setSignalValueValidate] = useState<boolean>();
  const [userPhoto, setUserPhoto] = useState<string>();
  const [selected, setSelected] = useState("");
  const [totalValue, setTotalValue] = useState<number>();
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [amountToPay, setAmountToPay] = useState<number>();
  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(false);
  const [valuePayed, setValuePayed] = useState<number>();
  const [signalValue, setSignalValue] = useState<number>();
  const [signalValuePix, setSignalValuePix] = useState<number>();

  const { data: dataReserve, loading: loadingReserve } = useReserveInfo(
    courtAvailabilities,
    {
      onCompleted(data) {
        if (data?.courtAvailability.data?.attributes.court.data) {
          const scheduleValue = data.courtAvailability.data.attributes.value;

          setReserveValue(scheduleValue);
          setServiceValue(scheduleValue * 0.04);
          setTotalValue(scheduleValue + scheduleValue * 0.04);
        }
      },
    },
  );

  const [userPaymentCard] = useUserPaymentCard();
  const { data: dataCountry } = useCountries();
  const { data: userData } = useGetUserById(userId, {
    onCompleted(data) {
      if (data?.usersPermissionsUser.data) {
        setValue("cpf", data.usersPermissionsUser.data.attributes.cpf);
        if (data.usersPermissionsUser.data.attributes.address) {
          setValue(
            "cep",
            data.usersPermissionsUser.data.attributes.address.cep,
          );
        }
      }
    },
  });

  const [updateStatusCourtAvailability] = useUpdateCourtAvailabilityStatus();
  const [createSchedule] = useRegisterSchedule();
  const { data: dataUser, loading: loadingUser } = useGetUserById(userId);
  const [addPaymentPix] = useUserPaymentPix();

  const loadingScreenInfos = () => {
    setAmountToPay(route.params.amountToPay);
    let amountToPayHold = route.params.amountToPay;
    setUserName(dataUser?.usersPermissionsUser.data?.attributes.username!);
    setUserCPF(dataUser?.usersPermissionsUser.data?.attributes.cpf!);
    setCourtName(
      dataReserve?.courtAvailability.data.attributes.court.data.attributes
        .fantasy_name
        ? dataReserve?.courtAvailability.data.attributes.court.data.attributes
            .fantasy_name
        : "",
    );
    setSignalValueValidate(
      dataReserve?.courtAvailability.data.attributes.value ===
        amountToPayHold! + serviceValue!
        ? true
        : false,
    );
    console.log(
      "validação:",
      dataReserve?.courtAvailability.data.attributes.value ===
        amountToPayHold! + serviceValue!,
    );
    setUserPhoto(route.params.userPhoto!);
    setValuePayed(
      dataReserve?.courtAvailability?.data?.attributes?.minValue
        ? dataReserve?.courtAvailability?.data?.attributes?.minValue
        : 0,
    );
    setSignalValue(
      Number(
        dataReserve?.courtAvailability.data.attributes.court.data.attributes.minimumScheduleValue!.toFixed(
          2,
        ),
      ),
    );
    setSignalValuePix(
      Number(
        dataReserve?.courtAvailability.data.attributes.court.data.attributes.minimumScheduleValue!.toFixed(
          2,
        ),
      ) * 100,
    );
  };

  useFocusEffect(
    useCallback(() => {
      if (!isScreenLoading) {
        loadingScreenInfos();
      }
    }, [isScreenLoading]),
  );

  useEffect(() => {
    setIsScreenLoading(loadingUser || loadingReserve);
  }, [dataUser, dataReserve]);

  const handleCardClick = () => {
    setShowCard(!showCard);
    setShowCameraIcon(false);
  };

  const handleSaveCard = () => {
    setShowCard(false);
  };

  const [showPaymentInformation, setShowPaymentInformation] = useState(false);
  const [showRateInformation, setShowRateInformation] = useState(false);

  const handleRateInformation = () => {
    setShowRateInformation(true);
  };

  const handlePaymentInformation = () => {
    setShowPaymentInformation(true);
  };

  const handleCancelExit = () => {
    setShowPaymentInformation(false);
    setShowRateInformation(false);
  };

  storage
    .load<{ latitude: number; longitude: number }>({
      key: "userGeolocation",
    })
    .then(data => setUserGeolocation(data));

  const courtLatitude = parseFloat(
    dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes
      ?.establishment?.data?.attributes?.address?.latitude ?? "0",
  );
  const courtLongitude = parseFloat(
    dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes
      ?.establishment?.data?.attributes?.address?.longitude ?? "0",
  );
  const userLatitude = parseFloat(userGeolocation?.latitude.toString() ?? "0");
  const userLongitude = parseFloat(
    userGeolocation?.longitude.toString() ?? "0",
  );

  let distanceInMeters = calculateDistance(
    userLatitude,
    userLongitude,
    courtLatitude,
    courtLongitude,
  );
  const distanceText =
    distanceInMeters >= 1000
      ? `${(distanceInMeters / 1000).toFixed(1)} Km`
      : `${distanceInMeters.toFixed(0)} metros`;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<iFormCardPayment>({
    resolver: zodResolver(formSchema),
  });

  const getCountryIdByName = (countryName: string | null): string => {
    try {
      if (countryName && dataCountry) {
        const selectedCountry = dataCountry.countries.data.find(
          name => name.attributes.name === countryName,
        );

        if (selectedCountry) {
          return selectedCountry.id;
        }
      }
      return "";
    } catch (error) {
      Alert.alert(
        "Erro ao procurar país",
        JSON.stringify(error) ?? String(error),
      );
      return "";
    }
  };

  const handlePay = handleSubmit(async values => {
    try {
      if (
        !userData?.usersPermissionsUser.data ||
        typeof serviceValue === "undefined" ||
        typeof signalValue === "undefined"
      ) {
        return Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: "Pagamento não efetuado",
        });
      }

      const cieloRequestManager = new CieloRequestManager();
      const totalValue =
        (Number(signalValue.toFixed(2)) + Number(serviceValue.toFixed(2))) *
        100;

      let brand = "";

      if (/^3(4|7)/.test(values.cardNumber)) {
        brand = "American Express";
      } else if (values.cardNumber.startsWith("4")) {
        brand = "Visa";
      } else if (/^3(01|05|6|8)/.test(values.cardNumber)) {
        brand = "Dinners Club";
      } else if (values.cardNumber.startsWith("5")) {
        brand = "Mastercard";
      } else if (values.cardNumber.startsWith("6")) {
        brand = "Discord";
      }

      const address: CieloAddress = {
        Street: values.street,
        Number: values.number,
        Complement: values.complement ? values.complement : "",
        ZipCode: values.cep,
        City: values.city,
        State: values.state,
        Country: "BRA",
      };

      const body: AuthorizeCreditCardPaymentResponse = {
        MerchantOrderId: "2014111701",
        Customer: {
          Name: values.name,
          Identity: values.cpf,
          IdentityType: "cpf",
          Email: userData.usersPermissionsUser.data.attributes.email,
          Birthdate: "1991-01-02",
          Address: address,
          DeliveryAddress: address,
        },
        Payment: {
          Type: "CreditCard",
          Amount: totalValue,
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
            CardNumber: values.cardNumber.split(" ").join(""),
            Holder: values.name,
            ExpirationDate: transformCardExpirationDate(values.date),
            SecurityCode: values.cvv,
            SaveCard: false,
            Brand: brand,
          },
        },
      };

      cieloRequestManager
        .authorizePayment(body)
        .then(async response => {
          const newScheduleId = await createNewSchedule();
          const countryId = getCountryIdByName(selected);

          if (newScheduleId && response.Payment.Status === 2) {
            userPaymentCard({
              variables: {
                value: Number(response.Payment.Amount / 100),
                schedulingId: newScheduleId,
                userId: Number(userId),
                name: values.name,
                cpf: values.cpf,
                cvv: parseInt(values.cvv),
                date: convertToAmericanDate(values.date),
                countryID: Number(countryId),
                publishedAt: new Date().toISOString(),
                cep: values.cep,
                city: values.city,
                complement: values.complement,
                number: values.number,
                state: values.state,
                neighborhood: values.district,
                street: values.street,
                paymentId: response.Payment.PaymentId!,
                payedStatus:
                  response.Payment.Status === 2 ? "Payed" : "Waiting",
              },
            })
              .then(() => {
                updateStatusDisponibleCourt();
                handleSaveCard();
                navigation.navigate("InfoReserva", { userId: userId });
              })
              .catch(error => {
                console.error(error);
                Alert.alert(
                  "Não foi possível realizar o pagamento",
                  String(error),
                );
              });
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Não foi possível realizar o pagamento", String(error));
        });
    } catch (error) {
      console.error("Erro ao criar o agendamento:", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Pagamento não efetuado",
        textBody: String(error),
      });
    }
  });

  const createNewSchedule = async () => {
    let isPayed =
      dataReserve?.courtAvailability.data?.attributes.minValue ===
      dataReserve?.courtAvailability.data.attributes.value;

    try {
      const { data } = await createSchedule({
        variables: {
          title: "r",
          court_availability: courtAvailabilities,
          date: courtAvailabilityDate.split("T")[0],
          pay_day: courtAvailabilityDate.split("T")[0],
          value_payed: valuePayed!,
          owner: userId,
          users: [userId],
          activation_key: isPayed ? generateRandomKey(4) : null,
          service_value: serviceValue!,
          publishedAt: new Date().toISOString(),
        },
      });

      return data?.createScheduling?.data?.id;
    } catch (error) {
      alert(error);
      console.error("Erro na mutação createSchedule:", error);
    }
  };

  const updateStatusDisponibleCourt = () => {
    updateStatusCourtAvailability({
      variables: {
        id: courtAvailabilityDate,
        status: true,
      },
    });
  };

  const generatePixSignal = async () => {
    try {
      setIsPaymentLoading(true);
      const generatePixJSON: RequestGeneratePix = {
        MerchantOrderId:
          userId + generateRandomKey(3) + new Date().toISOString(),
        Customer: {
          Name: userName!,
          Identity: userCPF!,
          IdentityType: "cpf",
        },
        Payment: {
          Type: "Pix",
          Amount: 1,
        },
      };

      const pixGenerated = await generatePix(generatePixJSON);

      await addPaymentPix({
        variables: {
          name: userName!,
          cpf: userCPF!,
          value: signalValue!,
          schedulingID: null,
          paymentID: pixGenerated.Payment.PaymentId,
          publishedAt: new Date().toISOString(),
          userID: userId,
        },
      }).then(response =>
        navigation.dispatch(
          StackActions.replace("PixScreen", {
            courtName: courtName,
            value: signalValue!.toString(),
            userID: userId,
            QRcodeURL: pixGenerated.Payment.QrCodeString,
            paymentID: pixGenerated.Payment.PaymentId,
            userPaymentPixID: response.data?.createUserPaymentPix.data.id!,
            screen: "signal",
            court_availabilityID: courtAvailabilities,
            date: courtAvailabilityDate.split("T")[0],
            pay_day: courtAvailabilityDate.split("T")[0],
            value_payed: signalValue ? signalValue : 0,
            ownerID: userId,
            service_value: serviceValue,
            isPayed: signalValueValidate,
            schedulePrice: signalValue!,
            courtId: courtId,
            courtImage: courtImage,
            userPhoto: userPhoto!,
          }),
        ),
      );
      setIsPaymentLoading(false);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <View className="flex-1 bg-white w-full h-full pb-10">
      {!isScreenLoading ? (
        <ScrollView>
          <View>
            <Image source={{ uri: courtImage }} className="w-full h-[230]" />
          </View>
          <View className="pt-5 pb-4 flex justify-center flex-row">
            <Text className="text-base text-center font-bold">
              Para realizar sua reserva é necessário pagar um sinal.
            </Text>
            <TouchableOpacity
              className="py-1 px-3"
              onPress={handleRateInformation}
            >
              <FontAwesome name="question-circle-o" size={13} color="black" />
            </TouchableOpacity>
          </View>
          <View className="bg-gray-300 p-4">
            <Text className="text-5xl text-center font-extrabold text-gray-700">
              R$ {signalValue}
            </Text>
          </View>
          <View className="px-10 py-5">
            {!isPaymentLoading ? (
              <TouchableOpacity
                className="py-4 rounded-xl bg-orange-500 flex items-center justify-center"
                onPressIn={() => {
                  generatePixSignal();
                }}
              >
                <Text className="text-lg text-gray-50 font-bold">
                  Gerar código PIX
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="py-4 rounded-xl bg-orange-500 flex items-center justify-center">
                <ActivityIndicator size="small" color="white" />
              </TouchableOpacity>
            )}
          </View>
          <View>
            <Text className="text-center font-bold text-base text-gray-700">
              ou
            </Text>
          </View>
          <View className="pt-5 px-9">
            <TouchableOpacity onPress={handleCardClick}>
              <View className="h-30 border border-gray-500 rounded-md">
                <View className="w-full h-14 border border-gray-500 rounded-md flex flex-row justify-between items-center px-4">
                  <FontAwesome
                    name="credit-card-alt"
                    size={24}
                    color="#FF6112"
                  />
                  <Text className="flex-1 text-base text-center mb-0">
                    Selecionar Cartão
                  </Text>
                  <Icon
                    name={showCard ? "chevron-up" : "chevron-down"}
                    size={25}
                    color="#FF4715"
                  />
                </View>
              </View>
            </TouchableOpacity>
            {showCard && (
              <View className="border border-gray-500 rounded-xl p-4 mt-3 space-y-2">
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">
                      Data de Venc.
                    </Text>
                    <Controller
                      name="date"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <TextInputMask
                            className="p-3 border border-gray-500 rounded-md h-18"
                            options={{ format: "MM/YY" }}
                            type={"datetime"}
                            value={value}
                            onChangeText={onChange}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            maxLength={5}
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">CVV</Text>
                    <Controller
                      name="cvv"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <TextInput
                            className="p-3 border border-gray-500 rounded-md h-18"
                            placeholder="123"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            maxLength={3}
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">Nome</Text>
                  <Controller
                    name="name"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <TextInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: nome"
                          onChangeText={onChange}
                          value={value}
                        />

                        {error?.message && (
                          <Text
                            className="text-red-400 text-sm mt-1"
                            numberOfLines={1}
                          >
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">
                    Número do Cartão
                  </Text>
                  <Controller
                    name="cardNumber"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <MaskInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: 0000 0000 0000 0000"
                          mask={Masks.CREDIT_CARD}
                          maxLength={19}
                          keyboardType={"numeric"}
                          value={value}
                          onChangeText={onChange}
                        />

                        {error?.message && (
                          <Text className="text-red-400 text-sm mt-1">
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">CPF</Text>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <MaskInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: 000.000.000-00"
                          value={value}
                          onChangeText={masked => onChange(masked)}
                          mask={Masks.BRL_CPF}
                          keyboardType="numeric"
                        />

                        {error?.message && (
                          <Text
                            className="text-red-400 text-sm mt-1"
                            numberOfLines={1}
                          >
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">País</Text>
                  <View className="flex flex-row items-center justify-between p-3 border border-neutral-400 rounded bg-white">
                    <SelectList
                      setSelected={(val: string) => {
                        setSelected(val);
                      }}
                      data={
                        (dataCountry &&
                          dataCountry.countries.data.map(country => ({
                            value: country.attributes.name,
                            label: country.attributes.name,
                            img: `${
                              country.attributes.flag.data?.attributes.url ?? ""
                            }`,
                          }))) ||
                        []
                      }
                      save="value"
                      placeholder="Selecione um país"
                      searchPlaceholder="Pesquisar..."
                    />
                  </View>
                </View>
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">CEP</Text>
                    <Controller
                      name="cep"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <MaskInput
                            className="p-3 border border-gray-500 rounded-md h-18"
                            placeholder="Ex: 00000-000"
                            value={value}
                            keyboardType="numeric"
                            mask={Masks.ZIP_CODE}
                            maxLength={9}
                            onChangeText={masked => {
                              onChange(masked);

                              if (masked.length === 9) {
                                getAddress(masked)
                                  .then(response => {
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
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">Número</Text>
                    <Controller
                      name="number"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <TextInput
                            value={value}
                            placeholder="Ex: nome"
                            onChangeText={onChange}
                            className="p-3 border border-gray-500 rounded-md h-18"
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">Rua</Text>
                  <Controller
                    name="street"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <TextInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: Rua xxxxxx"
                          value={value}
                          onChangeText={onChange}
                        />

                        {error?.message && (
                          <Text
                            className="text-red-400 text-sm mt-1"
                            numberOfLines={1}
                          >
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">Bairro</Text>
                  <Controller
                    name="district"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <TextInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: Jd. xxxxxxx"
                          value={value}
                          onChangeText={onChange}
                        />

                        {error?.message && (
                          <Text
                            className="text-red-400 text-sm mt-1"
                            numberOfLines={1}
                          >
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View>
                  <Text className="text-sm text-[#FF6112] mb-1">
                    Complemento
                  </Text>
                  <Controller
                    name="complement"
                    control={control}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Fragment>
                        <TextInput
                          className="p-3 border border-gray-500 rounded-md h-18"
                          placeholder="Ex: Lado ABC"
                          onChangeText={onChange}
                          value={value}
                        />

                        {error?.message && (
                          <Text
                            className="text-red-400 text-sm mt-1"
                            numberOfLines={1}
                          >
                            {error.message}
                          </Text>
                        )}
                      </Fragment>
                    )}
                  />
                </View>
                <View className="flex-row space-x-4">
                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">Cidade</Text>
                    <Controller
                      name="city"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <TextInput
                            className="p-3 border border-gray-500 rounded-md h-18"
                            placeholder="Ex: xxxxx"
                            value={value}
                            onChangeText={onChange}
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm text-[#FF6112] mb-1">Estado</Text>
                    <Controller
                      name="state"
                      control={control}
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Fragment>
                          <TextInput
                            className="p-3 border border-gray-500 rounded-md h-18"
                            placeholder="Ex: XX"
                            value={value}
                            maxLength={2}
                            onChangeText={onChange}
                          />

                          {error?.message && (
                            <Text
                              className="text-red-400 text-sm mt-1"
                              numberOfLines={1}
                            >
                              {error.message}
                            </Text>
                          )}
                        </Fragment>
                      )}
                    />
                  </View>
                </View>
                <View className="p-2 justify-center items-center pt-5">
                  <TouchableOpacity
                    onPress={handlePay}
                    disabled={isSubmitting}
                    className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size={"small"} color={"#F5620F"} />
                    ) : (
                      <Text className="text-white">Pagar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View>
              <Text className="text-center font-extrabold text-3xl text-gray-700 pt-10 pb-4">
                Detalhes Reserva
              </Text>
            </View>
          </View>
          <View className="bg-gray-300 flex flex-row">
            <View className="m-6">
              <Text className="text-base">
                {
                  dataReserve?.courtAvailability?.data?.attributes?.court?.data
                    ?.attributes?.name
                }
              </Text>
              <Text className="text-base">{distanceText} de distância</Text>
              <View className="flex flex-row">
                <Text className="text-base">
                  Avaliação:{" "}
                  {
                    dataReserve?.courtAvailability?.data?.attributes?.court
                      ?.data?.attributes?.rating
                  }
                </Text>
                <View className="pt-1.5 pl-1.5">
                  <FontAwesome name="star" color="#FF4715" size={11} />
                </View>
              </View>
              <Text className="text-base">
                {
                  dataReserve?.courtAvailability?.data?.attributes?.court?.data
                    ?.attributes?.establishment?.data?.attributes?.address
                    ?.streetName
                }
              </Text>
            </View>
            <View className="justify-center gap-1">
              {dataReserve?.courtAvailability.data.attributes.court.data.attributes.establishment.data.attributes.amenities.data.map(
                amenitieInfo => (
                  <View className="flex flex-row  items-center">
                    <SvgUri
                      width="14"
                      height="14"
                      source={{
                        uri: amenitieInfo.attributes.iconAmenitie.data
                          .attributes.url,
                      }}
                    />
                    <Text className="text-base pl-2">
                      {amenitieInfo.attributes.name}
                    </Text>
                  </View>
                ),
              )}
            </View>
          </View>
          <View className="p-4 justify-center items-center border-b ml-8 mr-8">
            <View className="flex flex-row gap-6">
              <Text className="font-bold text-xl text-[#717171]">
                Valor da Reserva
              </Text>
              <Text className="font-bold text-xl text-right text-[#717171]">
                R$ {amountToPay && amountToPay.toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-row gap-6">
              <View className="flex flex-row pt-1">
                <Text className="font-bold text-xl text-[#717171]">
                  Taxa de Serviço
                </Text>
                <TouchableOpacity onPress={handlePaymentInformation}>
                  <FontAwesome
                    name="question-circle-o"
                    size={13}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <Text className="font-bold text-xl text-right text-[#717171]">
                R$ {serviceValue && serviceValue.toFixed(2)}
              </Text>
            </View>
          </View>
          <View className="justify-center items-center pt-6">
            <View className="flex flex-row gap-10">
              <Text className="font-bold text-xl text-right text-[#717171]">
                Total:{" "}
              </Text>
              <Text className="flex flex-row font-bold text-xl text-right text-[#717171]">
                {" "}
                R$ {(amountToPay! + serviceValue!).toFixed(2)}
              </Text>
            </View>
          </View>
          <Modal
            visible={showPaymentInformation}
            animationType="fade"
            transparent={true}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
              <View className="bg-white rounded-md items-center ">
                <Text className="bg-white p-8 rounded text-base text-center">
                  Através dessa taxa provemos a tecnologia necessária para você
                  reservar suas quadras com antecedência e rapidez.
                </Text>
                <TouchableOpacity
                  className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center"
                  onPress={handleCancelExit}
                >
                  <Text className="text-white">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal
            visible={showRateInformation}
            animationType="fade"
            transparent={true}
          >
            <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
              <View className="bg-white rounded-md items-center">
                <Text className="bg-white p-8 rounded text-base text-center">
                  Esse valor será deduzido do valor total e não será estornado,
                  mesmo no caso de não comparecimento ao local ou cancelamento
                  da reserva.
                </Text>
                <TouchableOpacity
                  className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center"
                  onPress={handleCancelExit}
                >
                  <Text className="text-white">OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <View className="w-screen h-screen flex justify-center items-center">
          <ActivityIndicator size="large" color={"#F5620F"} />
        </View>
      )}
    </View>
  );
}
