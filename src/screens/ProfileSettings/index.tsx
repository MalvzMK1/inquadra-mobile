import { HOST_API } from "@env";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { showMessage } from "react-native-flash-message";
import MaskInput, { Masks } from "react-native-mask-input";
import { TextInputMask } from "react-native-masked-text";
import Icon from "react-native-vector-icons/Ionicons";
import { z } from "zod";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import CreditCardCard from "../../components/CreditCardInfoCard";
import useCountries from "../../hooks/useCountries";
import useDeleteUser from "../../hooks/useDeleteUser";
import useUpdatePaymentCardInformations from "../../hooks/useUpdatePaymentCardInformations";
import useUpdateUser from "../../hooks/useUpdateUser";
import { useGetUserById } from "../../hooks/useUserById";
import { Card } from "../../types/Card";
import { useToast } from 'native-base';
import useUserPaymentCountry from "../../hooks/useUserPaymentCountry";
import { getUsersCountryId } from "../../utils/getUsersCountryId";
import { ALERT_TYPE, AlertNotificationRoot, Dialog } from "react-native-alert-notification";
import storage from "../../utils/storage";

interface IFormData {
  photo: string;
  name: string;
  email: string;
  phoneNumber: string;
  cpf: string;
}

interface IPaymentCardFormData {
  dueDate: string;
  cvv: string;
  country: string;
  cep: string;
  cardNumber: string;
  houseNumber: string;
  street: string;
  district: string;
  complement: string;
  city: string;
  state: string;
}

const formSchema = z.object({
  name: z.string().nonempty("Esse campo não pode estar vazio"),
  email: z
    .string()
    .nonempty("Esse campo não pode estar vazio")
    .max(256, "Insira um E-mail válido")
    .includes("@", {
      message: "Insira um E-mail válido",
    }),
  phoneNumber: z.string().nonempty("Esse campo não pode estar vazio"),
  cpf: z.string().nonempty("Esse campo não pode estar vazio"),
});

const paymentCardFormSchema = z.object({
  dueDate: z.string().nonempty("Esse campo não pode estar vazio"),
  cvv: z
    .string()
    .nonempty("Esse campo não pode estar vazio")
    .min(3, "Insira um CVV válido")
    .max(3, "Insira um CVV válido"),
  country: z.string().nonempty("Esse campo não pode estar vazio"),
  cep: z
    .string()
    .nonempty("É necessário inserir o CEP")
    .min(8, "CEP inválido")
    .max(8, "CEP inválido"),
  houseNumber: z
    .string()
    .nonempty("É necessário inserir o número da residência"),
  cardNumber: z.string().nonempty("É necessário inserir o número do cartão"),
  street: z.string().nonempty("É necessário inserir o nome da rua"),
  district: z.string().nonempty("É necessário inserir o bairro"),
  city: z.string().nonempty("É necessário inserir o nome da cidade"),
  state: z
    .string()
    .nonempty("É necessário inserir o estado")
    .min(2, "Inválido")
    .max(2, "Inválido"),
});

type UserConfigurationProps = Omit<
  User,
  "cep" | "latitude" | "longitude" | "streetName"
> & {
  paymentCardInfos: {
    dueDate: string;
    cvv: string;
    country: { id: string; name: string };
  };
};

export default function ProfileSettings({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ProfileSettings">) {
  const { userID } = route.params;
  const [userInfos, setUserInfos] = useState<UserConfigurationProps>();
  const [showCard, setShowCard] = useState(false);
  const [showCreditCards, setShowCraditCards] = useState(false);
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [countryId, setCountryId] = useState<string | number>();
  const [countries, setCountries] = useState<Array<Country>>();
  const [countriesArray, setCountriesArray] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [deleteAccountLoading, setDeleteAccountLoading] =
    useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Fazendo upload da imagem",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<Country>();

  const { data: userPaymentCountryData, error: userPaymentCountryError } = useUserPaymentCountry(userID)
  const { loading, error, data, refetch } = useGetUserById(userID);
  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const [
    updateUser,
    { data: updatedUserData, loading: isUpdateLoading, error: updateUserError },
  ] = useUpdateUser();
  const [
    updatePaymentCardInformations,
    {
      data: updatedPaymentCardInformations,
      loading: isUpdatePaymentCardLoading,
    },
  ] = useUpdatePaymentCardInformations();
  const [deleteUser] = useDeleteUser();

  useEffect(() => {
    let newCountriesArray: Array<{ key: string; value: string; img: string }> =
      [];
    if (!countriesLoading && countriesData) {
      newCountriesArray = countriesData.countries.data.map(country => {
        return {
          key: country.id,
          value: country.attributes.name,
          img: HOST_API + country.attributes.flag,
        };
      });
    }

    setCountriesArray(prevState => [...prevState, ...newCountriesArray]);
  }, [countriesData, countriesLoading]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    control: paymentCardControl,
    handleSubmit: handlePaymentCardSubmit,
    formState: { errors: paymentCardErrors },
    getValues: getPaymentCardValues,
    setValue: setPaymentCardValue,
    resetField,
  } = useForm<IPaymentCardFormData>({
    resolver: zodResolver(paymentCardFormSchema),
  });

  const handleCardClick = () => {
    setShowCard(!showCard);
    setShowCameraIcon(false);
  };

  const handleOpenCardsModal = () => {
    setShowCraditCards(!showCreditCards);
  };

  const updateCardInfos = (data: IPaymentCardFormData) => {
    addCard(
      data.cardNumber,
      data.dueDate,
      data.country.toString(),
      data.cep,
      data.houseNumber,
      data.street,
      data.district,
      data.complement,
      data.city,
      data.state,
    ).then(() => {
      console.log('ur')
      Dialog.show({
        title: 'Cartão adicionado com sucesso',
        type: ALERT_TYPE.SUCCESS,
        closeOnOverlayTap: true,
        autoClose: true
      })
    });
  };

  const resetFieldsCard = () => {
    resetField("cardNumber");
    resetField("dueDate");
    resetField("country");
    resetField("cep");
    resetField("houseNumber");
    resetField("district");
    resetField("complement");
    resetField("city");
    resetField("state");
    resetField("cvv");
    resetField("street");
  };
  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (userInfos) {
      // TODO: IMPLEMENT ACCOUNT DELETE
      setDeleteAccountLoading(true);

      deleteUser({
        variables: {
          user_id: userInfos.id,
        },
      })
        .then(() => navigation.navigate("DeleteAccountSuccess"))
        .catch(err => alert(JSON.stringify(err)))
        .finally(() => setDeleteAccountLoading(false));
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleExitApp = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    storage.remove({
      key: 'userInfos',
    }).then(() => console.log('Removed user infos from local storage'))
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const haveProfilePicture: boolean = data?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url !== undefined ? true : false
  const [photo, setPhoto] = useState("");
  const [imageEdited, setImageEdited] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);

  useFocusEffect(() => {
    setPhoto(
      data?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url!,
    );
  });



  const handleProfilePictureUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Desculpe, precisamos da permissão para acessar a galeria!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri).then(uploadedImageID => {
          setProfilePicture(result.assets[0].uri);
          setImageEdited(true);
          console.log("ID da imagem enviada:", uploadedImageID);
        });
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  };

  const uploadImage = async (selectedImageUri: string) => {
    setIsLoading(true);
    const apiUrl = HOST_API;

    const formData = new FormData();
    formData.append("files", {
      uri: selectedImageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImageID = response.data[0].id;

      console.log("Imagem enviada com sucesso!", response.data);

      setIsLoading(false);

      return uploadedImageID;
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      setIsLoading(false);
      return "Deu erro";
    }
  };

  async function updateUserInfos(data: IFormData): Promise<void> {
    try {
      if (profilePicture) {
        const uploadedImageID = await uploadImage(profilePicture);

        await updateUser({
          variables: {
            user_id: route.params.userID,
            email: data.email,
            cpf: data.cpf,
            phone_number: data.phoneNumber,
            username: data.name,
            photo: uploadedImageID,
          },
        });

        console.log(profilePicture);
        setPhoto(profilePicture);
        console.log(photo);
      } else {
        const uploadedImageID = await uploadImage(profilePicture!);
        // Se não houver uma nova imagem, apenas atualize as informações do usuário
        await updateUser({
          variables: {
            user_id: userInfos?.id!,
            email: data.email,
            cpf: data.cpf,
            phone_number: data.phoneNumber,
            username: data.name,
            photo: uploadedImageID,
          },
        });

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Sucesso',
          textBody: 'As informações foram atualizadas'
        })
        console.log("Informações do usuário atualizadas com sucesso!");
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Erro',
        textBody: 'Não foi possível atualizar as informações do usuário'
      })
      console.error("Erro ao atualizar informações do usuário:", error);
    }
  }

  async function loadInformations() {
    let newUserInfos = userInfos;
    if (!loading && data) {
      newUserInfos = {
        id: data.usersPermissionsUser.data.id,
        username: data.usersPermissionsUser.data.attributes.username,
        cpf: data.usersPermissionsUser.data.attributes.cpf,
        email: data.usersPermissionsUser.data.attributes.email,
        phoneNumber: data.usersPermissionsUser.data.attributes.phoneNumber,
        photo: data.usersPermissionsUser.data?.attributes.photo.data?.id!,
        paymentCardInfos: {
          dueDate: data.usersPermissionsUser.data.attributes
            .paymentCardInformations.dueDate
            ? data.usersPermissionsUser.data.attributes.paymentCardInformations
              .dueDate
            : "",
          cvv: data.usersPermissionsUser.data.attributes.paymentCardInformations
            .cvv
            ? data.usersPermissionsUser.data.attributes.paymentCardInformations.cvv.toString()
            : "",
          country: {
            id: userCountry?.id ?? '1',
            name: userCountry?.name ?? 'Brasil',
          },
        },
      };
    }

    return newUserInfos;
  }

  function defineDefaultFieldValues(
    userData:
      | (Omit<User, "id" | "cep" | "latitude" | "longitude" | "streetName"> & {
        paymentCardInfos: { dueDate: string; cvv: string };
      })
      | undefined,
  ): void {
    if (userData) {
      setValue("name", userData.username);
      setValue("email", userData.email);
      setValue("phoneNumber", userData.phoneNumber);
      setValue("cpf", userData.cpf);
      setPaymentCardValue("cvv", userData.paymentCardInfos.cvv);
      setPaymentCardValue("dueDate", userData.paymentCardInfos.dueDate);
    }
  }

  useEffect(() => {
    loadInformations().then(data => {
      console.log({ data });
      defineDefaultFieldValues(data);
      setUserInfos(data);
    });
  }, [loading]);

  let userNameDefault = data?.usersPermissionsUser.data?.attributes.username!;
  let emailDefault = data?.usersPermissionsUser.data?.attributes.email!;
  let phoneDefault = data?.usersPermissionsUser.data?.attributes.phoneNumber!;
  let cpfDefault = data?.usersPermissionsUser.data?.attributes.cpf!;

  useEffect(() => {
    AsyncStorage.getItem(`user${userID}Cards`, (error, result) => {
      if (error) {
        console.log("Deu ruim mano", error);
      } else {
        const parsedCards = JSON.parse(result || "[]");
        setCards(parsedCards);
        console.log("Cartões recuperados com sucesso", parsedCards);
      }
    });
  }, [showCreditCards]);

  const addCard = async (
    number: string,
    maturityDate: string,
    countryID: string,
    cep: string,
    houseNumber: string,
    street: string,
    district: string,
    complement: string,
    city: string,
    state: string,
  ): Promise<void> => {
    const newCard: Card = {
      id: cards.length, // Use cards.length para obter o próximo ID.
      number: number,
      maturityDate: maturityDate,
      countryID: countryID,
      cep: cep,
      houseNumber: houseNumber,
      street: street,
      district: district,
      complement: complement,
      city: city,
      state: state,
    };
    setCards(prevCards => [...prevCards, newCard]);
    console.log("log cards", cards);

    await AsyncStorage.setItem(
      `user${userID}Cards`,
      JSON.stringify([...cards, newCard]),
      error => {
        if (error) {
          console.log("deu ruim paew", error);
        } else {
          setShowCard(false);
          showMessage({
            message: " ",
            description: "Cartão cadastrado com sucesso",
            type: "default",
            backgroundColor: "green",
            // resetFieldsCard()
          });
        }
      },
    );
  };

  useEffect(() => {
    let foundCountryId: string | number | undefined
    if (userPaymentCountryData)
      foundCountryId = getUsersCountryId(userID, userPaymentCountryData);
    setCountryId(foundCountryId);
  }, [userPaymentCountryData])

  useEffect(() => {
    if (countriesData && countryId) {
      const { data: newCountries } = countriesData.countries

      const foundCountry = newCountries.find(country => String(country.id) === String(countryId));

      if (foundCountry) setUserCountry({
        name: foundCountry.attributes.name,
        ISOCode: foundCountry.attributes.ISOCode,
        flag: {
          id: foundCountry.attributes.flag.data.id,
          name: foundCountry.attributes.flag.data.attributes.name,
          url: foundCountry.attributes.flag.data.attributes.url,
          hash: foundCountry.attributes.flag.data.attributes.hash,
          alternativeText: foundCountry.attributes.flag.data.attributes.alternativeText
        },
        id: foundCountry.id,
      });
    }
  }, [countriesData])

  return (
    <AlertNotificationRoot>
      <View className="flex-1 bg-white h-full">
        <View className=" h-11 w-max  bg-[#292929]"></View>
        <View className=" h-16 w-max  bg-[#292929] flex-row item-center justify-between px-5">
          <View className="flex item-center justify-center">
            <MaterialIcons
              name="arrow-back"
              color={"white"}
              size={30}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View className="flex item-center justify-center">
            <Text className="text-lg font-bold text-white">EDITAR</Text>
          </View>
          <View className="h-max w-max flex justify-center items-center">
            <TouchableOpacity className="h-12 W-12 ">
              <Image
                source={{ uri: HOST_API + photo }}
                style={{ width: 46, height: 46 }}
                borderRadius={100}
              />
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View className="flex-1">
            <ActivityIndicator size="large" color="#F5620F" />
          </View>
        ) : (
          <>
            <ScrollView className="flex-grow p-1">
              <TouchableOpacity style={{ alignItems: "center", marginTop: 8 }}>
                <View style={styles.container}>
                  {profilePicture ? (
                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                  ) : (
                    <Image source={{ uri: HOST_API + photo }} style={styles.profilePicture} />
                  )}

                  <TouchableOpacity
                    onPress={handleProfilePictureUpload}
                    style={styles.uploadButton}
                  >
                    {haveProfilePicture ? (
                      <Ionicons name="pencil-outline" size={30} color="#fff" />
                    ) : (
                      <Ionicons name="camera-outline" size={30} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              <View className="p-6 space-y-6">
                <View>
                  <Text className="text-base">Nome</Text>
                  <Controller
                    name="name"
                    control={control}
                    defaultValue={userNameDefault}
                    render={({ field: { onChange } }) => (
                      <TextInput
                        value={getValues("name")}
                        onChangeText={onChange}
                        className={
                          errors.name
                            ? "p-4 border border-red-400 rounded"
                            : "p-4 border border-neutral-400 rounded"
                        }
                        placeholder="Ex.: João"
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
                  <Text className="text-base">E-mail</Text>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue={emailDefault}
                    render={({ field: { onChange } }) => (
                      <TextInput
                        value={getValues("email")}
                        onChangeText={onChange}
                        className={
                          errors.email
                            ? "p-4 border border-red-400 rounded"
                            : "p-4 border border-neutral-400 rounded"
                        }
                        placeholder="email@email.com"
                        maxLength={256}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text className="text-red-400 text-sm">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-base">Telefone</Text>
                  <Controller
                    name="phoneNumber"
                    defaultValue={phoneDefault}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <MaskInput
                        className="p-4 border border-gray-500 rounded-md h-45"
                        placeholder="Ex: 000.000.000-00"
                        value={getValues("phoneNumber")}
                        onChangeText={onChange}
                        mask={Masks.BRL_PHONE}
                        maxLength={15}
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <Text className="text-red-400 text-sm">
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                </View>
                <View>
                  <Text className="text-base">CPF</Text>
                  <Controller
                    name="cpf"
                    defaultValue={cpfDefault}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <MaskInput
                        className="p-4 border border-gray-500 rounded-md h-45"
                        placeholder="Ex: 000.000.000-00"
                        value={getValues("cpf")}
                        onChangeText={onChange}
                        mask={Masks.BRL_CPF}
                        editable={false}
                        maxLength={14}
                      />
                    )}
                  />
                  {errors.cpf && (
                    <Text className="text-red-400 text-sm">
                      {errors.cpf.message}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={handleCardClick}>
                  <Text className="text-base">Adicionar Cartão</Text>
                  <View className="w-full h-14 border border-gray-500 rounded-md flex flex-row justify-between items-center px-4">
                    <View className='flex flex-row items-center gap-2'>
                      <FontAwesome
                        name='plus'
                        size={12}
                        color='#FF6112'
                      />
                      <FontAwesome
                        name="credit-card-alt"
                        size={24}
                        color="#FF6112"
                      />
                    </View>
                    <Icon
                      name={showCard ? "chevron-up" : "chevron-down"}
                      size={25}
                      color="#FF4715"
                    />
                  </View>
                </TouchableOpacity>
                {showCard && (
                  <View className="border border-gray-500 p-4 mt-10">
                    <View>
                      <Text className="text-sm text-[#FF6112]">
                        Número do cartão
                      </Text>
                      <Controller
                        name="cardNumber"
                        control={paymentCardControl}
                        render={({ field: { onChange } }) => (
                          <MaskInput
                            value={getPaymentCardValues("cardNumber")}
                            placeholder="Ex: 0000-0000-0000-0000"
                            className={`p-3 border ${paymentCardErrors.cvv
                              ? "border-red-400"
                              : "border-gray-500"
                              } rounded-md h-18`}
                            onChangeText={onChange}
                            mask={Masks.CREDIT_CARD}
                            keyboardType="numeric"
                            maxLength={19}
                          />
                        )}
                      ></Controller>
                    </View>
                    {paymentCardErrors.cardNumber && (
                      <Text className="text-red-400 text-sm">
                        {paymentCardErrors.cardNumber.message}
                      </Text>
                    )}
                    <View className="flex flex-row justify-between">
                      <View className="flex flex-1 mr-5">
                        <Text className="text-base text-[#FF6112]">
                          Data venc.
                        </Text>
                        <Controller
                          name="dueDate"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <TextInputMask
                              value={getPaymentCardValues("dueDate")}
                              className={`p-3 border ${paymentCardErrors.dueDate
                                ? "border-red-400"
                                : "border-gray-500"
                                } rounded-md h-18 flex-1`}
                              type={"datetime"}
                              options={{
                                format: "MM/YY",
                              }}
                              onChangeText={onChange}
                              placeholder="MM/YY"
                              keyboardType="numeric"
                              maxLength={5}
                            />
                          )}
                        />
                        {paymentCardErrors.dueDate && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.dueDate.message}
                          </Text>
                        )}
                      </View>
                      <View className="flex-1 ml-5">
                        <Text className="text-base text-[#FF6112]">CVV</Text>
                        <Controller
                          name="cvv"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <TextInput
                              value={getPaymentCardValues("cvv")}
                              className={`p-3 border ${paymentCardErrors.cvv
                                ? "border-red-400"
                                : "border-gray-500"
                                } rounded-md h-18 flex-1`}
                              onChangeText={onChange}
                              placeholder="***"
                              keyboardType="numeric"
                              maxLength={3}
                              secureTextEntry
                            />
                          )}
                        />
                        {paymentCardErrors.cvv && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.cvv.message}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View>
                      <Text className="text-base text-[#FF6112]">País</Text>
                      <View className="flex flex-row items-center">
                        <View style={{ width: "100%" }}>
                          <Controller
                            name="country"
                            control={paymentCardControl}
                            render={({ field: { onChange } }) => (
                              <SelectList
                                setSelected={(val: string) => {
                                  onChange(val);
                                }}
                                defaultOption={{
                                  key: userCountry?.id ?? '1',
                                  value: userCountry?.name ?? 'Brasil',
                                }}
                                data={countriesArray}
                                save="key"
                                placeholder="Selecione um país..."
                                searchPlaceholder="Pesquisar..."
                              />
                            )}
                          />
                          {paymentCardErrors.country && (
                            <Text className="text-red-400 text-sm">
                              {paymentCardErrors.country.message}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <View className="flex flex-row justify-between gap-8">
                      <View className='flex-1'>
                        <Text className="text-sm text-[#FF6112]">CEP</Text>
                        <Controller
                          name="cep"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <MaskInput
                              value={getPaymentCardValues("cep")}
                              className="p-3 border border-neutral-400 rounded bg-white flex-1"
                              placeholder="Ex: 00000-000"
                              onChangeText={(masked, unmasked) => onChange(unmasked)}
                              keyboardType="numeric"
                              mask={Masks.ZIP_CODE}
                              maxLength={9}
                            />
                          )}
                        />
                        {paymentCardErrors.cep && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.cep.message}
                          </Text>
                        )}
                      </View>
                      <View className='flex-1'>
                        <Text className="text-sm text-[#FF6112]">Numero</Text>
                        <Controller
                          name="houseNumber"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <MaskInput
                              value={getPaymentCardValues("houseNumber")}
                              className="p-3 border border-neutral-400 rounded bg-white flex-1"
                              placeholder="Ex: 0000"
                              onChangeText={onChange}
                              keyboardType="numeric"
                            ></MaskInput>
                          )}
                        ></Controller>
                        {paymentCardErrors.houseNumber && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.houseNumber.message}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View>
                      <Text className="text-sm text-[#FF6112]">Rua</Text>
                      <Controller
                        name="street"
                        control={paymentCardControl}
                        render={({ field: { onChange } }) => (
                          <MaskInput
                            value={getPaymentCardValues("street")}
                            className="p-3 border border-neutral-400 rounded bg-white"
                            placeholder="Ex: Rua xxxx"
                            onChangeText={onChange}
                          ></MaskInput>
                        )}
                      ></Controller>
                    </View>
                    {paymentCardErrors.street && (
                      <Text className="text-red-400 text-sm">
                        {paymentCardErrors.street.message}
                      </Text>
                    )}
                    <View>
                      <Text className="text-sm text-[#FF6112]">Bairro</Text>
                      <Controller
                        name="district"
                        control={paymentCardControl}
                        render={({ field: { onChange } }) => (
                          <MaskInput
                            value={getPaymentCardValues("district")}
                            className="p-3 border border-neutral-400 rounded bg-white"
                            placeholder="Ex: Jd. xxxxx"
                            onChangeText={onChange}
                          ></MaskInput>
                        )}
                      ></Controller>
                    </View>
                    {paymentCardErrors.district && (
                      <Text className="text-red-400 text-sm">
                        {paymentCardErrors.district.message}
                      </Text>
                    )}
                    <View>
                      <Text className="text-sm text-[#FF6112]">Complemento</Text>
                      <Controller
                        name="complement"
                        control={paymentCardControl}
                        render={({ field: { onChange } }) => (
                          <MaskInput
                            value={getPaymentCardValues("complement")}
                            className="p-3 border border-neutral-400 rounded bg-white"
                            placeholder="Ex: "
                            onChangeText={onChange}
                          ></MaskInput>
                        )}
                      ></Controller>
                    </View>
                    {paymentCardErrors.complement && (
                      <Text className="text-red-400 text-sm">
                        {paymentCardErrors.complement.message}
                      </Text>
                    )}
                    <View className="flex flex-row justify-between gap-8">
                      <View className='flex-1'>
                        <Text className="text-sm text-[#FF6112]">Cidade</Text>
                        <Controller
                          name="city"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <MaskInput
                              value={getPaymentCardValues("city")}
                              className="p-3 border border-neutral-400 rounded bg-white"
                              placeholder="Ex: xxxx"
                              onChangeText={onChange}
                            ></MaskInput>
                          )}
                        ></Controller>
                        {paymentCardErrors.city && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.city.message}
                          </Text>
                        )}
                      </View>
                      <View className='flex-1'>
                        <Text className="text-sm text-[#FF6112]">Estado</Text>
                        <Controller
                          name="state"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <MaskInput
                              value={getPaymentCardValues("state")}
                              className="p-3 border border-neutral-400 rounded bg-white"
                              placeholder="Ex: xxxx"
                              onChangeText={onChange}
                            ></MaskInput>
                          )}
                        ></Controller>
                        {paymentCardErrors.state && (
                          <Text className="text-red-400 text-sm">
                            {paymentCardErrors.state.message}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className="p-2 justify-center items-center">
                      <TouchableOpacity
                        onPress={handlePaymentCardSubmit(updateCardInfos)}
                        className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center"
                      >
                        <Text className="text-white">Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                <TouchableOpacity onPress={handleOpenCardsModal}>
                  <Text className="text-base">Cartões</Text>
                  <View className="w-full h-14 border border-gray-500 rounded-md flex flex-row justify-between items-center px-4">
                    <FontAwesome
                      name="credit-card-alt"
                      size={24}
                      color="#FF6112"
                    />
                    <Icon
                      name={showCreditCards ? "chevron-up" : "chevron-down"}
                      size={25}
                      color="#FF4715"
                    />
                  </View>
                </TouchableOpacity>
                {showCreditCards ? (
                  cards.length > 0 ? (
                    <View className=" border-gray-500 flex w-max h-max">
                      {cards.map(card => (
                        <>
                          <CreditCardCard
                            number={card.number}
                            id={card.id}
                            userID={userID}
                          />
                          <View className="h-2"></View>
                        </>
                      ))}
                    </View>
                  ) : (
                    <Text className="font-bold text-sm text-[#808080] text-center">
                      Você não possui nenhum cartão cadastrado no momento
                    </Text>
                  )
                ) : null}
                <View>
                  <View className="p-2">
                    <TouchableOpacity
                      onPress={handleSubmit(updateUserInfos)}
                      className="h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center"
                    >
                      <Text className="text-white">
                        {isLoading ? (
                          <View style={{ alignItems: "center", paddingTop: 5 }}>
                            <ActivityIndicator size="small" color="#FFFF" />
                            <Text style={{ marginTop: 6, color: "white" }}>
                              {loadingMessage}
                            </Text>
                          </View>
                        ) : (
                          "Salvar"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="p-2">
                    <TouchableOpacity
                      onPress={handleExitApp}
                      className="h-14 w-81 rounded-md bg-red-500 flex items-center justify-center"
                    >
                      <Text className="text-gray-50">Sair do App</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="p-2">
                    <TouchableOpacity
                      onPress={handleDeleteAccount}
                      className="h-14 w-81 rounded-md  flex items-center justify-center"
                    >
                      <Text className="text-base text-gray-400">
                        Excluir essa conta
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Modal
                visible={showDeleteConfirmation}
                animationType="fade"
                transparent={true}
              >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
                  <View className="bg-white rounded-md p-20 items-center">
                    <Text className=" font-bold text-lg mb-8">
                      Confirmar exclusão da conta?
                    </Text>
                    <TouchableOpacity
                      className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center"
                      onPress={handleCancelDelete}
                    >
                      <Text className="text-white">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center"
                      onPress={handleConfirmDelete}
                    >
                      <Text className="text-white">
                        {deleteAccountLoading ? (
                          <ActivityIndicator size={"small"} color={"#F5620F"} />
                        ) : (
                          "Confirmar"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal
                visible={showExitConfirmation}
                animationType="fade"
                transparent={true}
              >
                <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
                  <View className="bg-white rounded-md p-20 items-center">
                    <Text className=" font-bold text-lg mb-8">Sair do App?</Text>
                    <TouchableOpacity
                      className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center"
                      onPress={handleCancelExit}
                    >
                      <Text className="text-white">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center"
                      onPress={handleConfirmExit}
                    >
                      <Text className="text-white">Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          </>
        )}
        <BottomBlackMenu
          screen="Home"
          isDisabled={true}
          userPhoto={route.params.userPhoto ? route.params.userPhoto : ""}
          userID={route.params.userID}
          paddingTop={50}
        />
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6112",
    borderRadius: 15,
    padding: 8,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  label: {
    color: "black",
    paddingBottom: 20,
    fontSize: 20,
  },
  maskedInput: {
    borderWidth: 2,
    borderRadius: 6,
    width: "80%",
    padding: 12,
    color: "black",
    fontSize: 20,
  },
});
//
// const handleCVVChange = (input: any) => {
// 	const numericInput = input.replace(/\D/g, '');
//
// 	const truncatedCVV = numericInput.slice(0, 3);
//
// 	setCVV(truncatedCVV);
// };
//
// const [ phoneNumber, setPhoneNumber ] = useState("")
// const [ cpf, setCpf ] = useState("")
//
// const getCountryImage = (countryName: string) => {
// 	const countryImg = countriesData.find(item => item.value === countryName)?.img
// 	return countryImg
// }
