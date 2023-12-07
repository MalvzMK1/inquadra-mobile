import { ApolloError } from "@apollo/client";
import { HOST_API } from "@env";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { Fragment, useEffect, useState } from "react";
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
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Dialog,
} from "react-native-alert-notification";
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
import useUpdateUser from "../../hooks/useUpdateUser";
import useUpdateUserPassword from "../../hooks/useUpdateUserPassword";
import { useGetUserById } from "../../hooks/useUserById";
import useUserPaymentCountry from "../../hooks/useUserPaymentCountry";
import { Card } from "../../types/Card";
import { getUsersCountryId } from "../../utils/getUsersCountryId";
import storage from "../../utils/storage";
import {useUser} from "../../context/userContext";

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
  const { userData, setUserData } = useUser();

  const [userInfos, setUserInfos] = useState<UserConfigurationProps>();
  const [showCard, setShowCard] = useState(false);
  const [showCreditCards, setShowCreditCards] = useState(false);
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [countryId, setCountryId] = useState<string | number>();
  const [photoData, setPhotoData] = useState<Photo>();
  const [userPhotoID, setUserPhotoID] = useState<string>()

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

  const { data: userPaymentCountryData } = useUserPaymentCountry(userData?.id ?? '');
  const { loading, data } = useGetUserById(userData?.id ?? '');
  const { data: countriesData, loading: countriesLoading } = useCountries();
  const [updateUser] = useUpdateUser();

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
    setShowCreditCards(!showCreditCards);
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
      console.log("ur");
      Dialog.show({
        title: "Cartão adicionado com sucesso",
        type: ALERT_TYPE.SUCCESS,
        closeOnOverlayTap: true,
        autoClose: true,
      });
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
    setUserData(undefined);

    setShowExitConfirmation(false);

    navigation.navigate("Home", {
      userPhoto: undefined,
      userGeolocation: userData?.geolocation, // TODO: IMPLEMENTAR VALIDAÇÃO DE GEOLOCALIZAÇÃO INDEFINIDA
    })
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const haveProfilePicture: boolean =
    data?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url !==
      undefined
      ? true
      : false;
  const [photo, setPhoto] = useState("");
  const [imageEdited, setImageEdited] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);

  console.log("id da foto atual:", userPhotoID)

  useFocusEffect(() => {
    if (
      data &&
      data.usersPermissionsUser.data &&
      data.usersPermissionsUser.data.attributes.photo.data
    )
      setPhoto(
        data.usersPermissionsUser.data.attributes.photo.data.attributes.url,
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
        await uploadImage(result.assets[0].uri)
          .then(uploadedImageID => {
            setProfilePicture(result.assets[0].uri);
            setImageEdited(true);
            console.log("ID da imagem enviada:", uploadedImageID);
          })
          .catch(error => {
            console.error("Erro :", error);
          });
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem: ", error);
    }
  };


  const uploadImage = async (selectedImageUri: string) => {
    setIsLoading(true);
    const apiUrl = "https://api-inquadra-uat.qodeless.com.br";

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

  interface IUpdateUserValidatingPhotoProps {
    user_id: string;
    email: string;
    cpf: string;
    phone_number: string;
    username: string;
    photo?: string;
  }

  async function updateUserValidatingPhoto(
    data: IUpdateUserValidatingPhotoProps,
  ): Promise<void> {
    console.log(JSON.stringify(data, null, 2));

    if (data.photo !== undefined && data.photo !== null) {
      await updateUser({
        variables: {
          user_id: data.user_id,
          email: data.email,
          cpf: data.cpf,
          phone_number: data.phone_number,
          username: data.username,
          photo: data.photo,
        },
      });
    } else {
      console.log("ó", {
        user_id: data.user_id,
        email: data.email,
        cpf: data.cpf,
        phone_number: data.phone_number,
        username: data.username,
        photo: data.photo ?? "",
      })

      await updateUser({
        variables: {
          user_id: data.user_id,
          email: data.email,
          cpf: data.cpf,
          phone_number: data.phone_number,
          username: data.username,
          photo: data.photo,
        },
      });
    }
  }

  async function updateUserInfos(data: IFormData): Promise<void> {
    try {
      if (userInfos) {
        let uploadedImageID: string | undefined;
        if (profilePicture) {
          uploadedImageID = await uploadImage(profilePicture);

          setPhoto(profilePicture);
          console.log({ photo });
        }

        console.log("ala:", {
          photo: uploadedImageID !== undefined && uploadedImageID !== null ? uploadedImageID : userPhotoID,
          username: data.name,
          cpf: data.cpf,
          phone_number: data.phoneNumber,
          user_id: userInfos.id,
          email: data.email,
        })

        await updateUserValidatingPhoto({
          photo: uploadedImageID !== undefined && uploadedImageID !== null ? uploadedImageID : userPhotoID,
          username: data.name,
          cpf: data.cpf,
          phone_number: data.phoneNumber,
          user_id: userInfos.id,
          email: data.email,
        })
          .catch(error => {
            Dialog.show({
              type: ALERT_TYPE.WARNING,
              title: "Erro",
              textBody: "Não foi possível atualizar as informações do usuário",
            });
            console.error(
              "Erro ao atualizar informações do usuário:",
              JSON.stringify(error, null, 2),
            );
          })
          .then(() => {
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Sucesso",
              textBody: "As informações foram atualizadas",
            });
            console.log("Informações do usuário atualizadas com sucesso!");
          });
      }
    } catch (error) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Erro",
        textBody: "Não foi possível atualizar as informações do usuário",
      });
      console.error("Erro ao atualizar informações do usuário:", error);
    }
  }

  const loadInformations = async () => {
    let newUserInfos = userInfos;

    if (!loading && data && data.usersPermissionsUser.data) {
      setUserPhotoID(data.usersPermissionsUser.data.attributes.photo.data?.id !== undefined && data.usersPermissionsUser.data.attributes.photo.data?.id !== null ? data.usersPermissionsUser.data.attributes.photo.data?.id : "")
      setPhotoData({
        id: data.usersPermissionsUser.data.attributes.photo.data?.id ?? "",
        name:
          data.usersPermissionsUser.data.attributes.photo.data?.attributes
            .name ?? "",
        alternativeText: "Request tela de perfil",
        ext: "jpg",
        mime: "image/jpg",
        url:
          data.usersPermissionsUser.data.attributes.photo.data?.attributes
            .url ?? "",
        size: 1024,
      });
      if (data.usersPermissionsUser.data.attributes.paymentCardInformations !== null && data.usersPermissionsUser.data.attributes.paymentCardInformations !== undefined) {
        newUserInfos = {
          id: data.usersPermissionsUser.data.id,
          username: data.usersPermissionsUser.data.attributes.username,
          cpf: data.usersPermissionsUser.data.attributes.cpf,
          email: data.usersPermissionsUser.data.attributes.email,
          phoneNumber: data.usersPermissionsUser.data.attributes.phoneNumber,
          photo: photoData,
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
              id: userCountry?.id ?? "1",
              name: userCountry?.name ?? "Brasil",
            },
          },
        }
      } else {
        newUserInfos = {
          id: data.usersPermissionsUser.data.id,
          username: data.usersPermissionsUser.data.attributes.username,
          cpf: data.usersPermissionsUser.data.attributes.cpf,
          email: data.usersPermissionsUser.data.attributes.email,
          phoneNumber: data.usersPermissionsUser.data.attributes.phoneNumber,
          photo: photoData,
          paymentCardInfos: {
            dueDate: "",
            cvv: "",
            country: {
              id: "",
              name: "",
            },
          },
        }
      }
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

  interface IPasswordFormData {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }

  const [updatePasswordIsLoading, setUpdatePasswordIsLoading] =
    useState<boolean>(false);
  const [jwtToken, setJwtToken] = useState<string>("");
  const [editPasswordModal, setEditPasswordModal] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const [updateUserPassword] = useUpdateUserPassword();

  const passwordFormSchema = z.object({
    currentPassword: z.string().nonempty("O campo não pode estar vazio"),
    password: z.string().nonempty("O campo não pode estar vazio"),
    confirmPassword: z.string().nonempty("O campo não pode estar vazio"),
  });

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<IPasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  const closeEditPasswordModal = () => setEditPasswordModal(false);

  const handleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  function handleUpdateUserPassword(data: IPasswordFormData): void {
    setUpdatePasswordIsLoading(true);

    if (data.password === data.confirmPassword) {
      const passwordData = {
        ...data,
      };

      updateUserPassword({
        context: {
          headers: {
            Authorization: `bearer ${jwtToken}`,
          },
        },
        variables: {
          current_password: passwordData.currentPassword,
          password: passwordData.password,
          password_confirmation: passwordData.confirmPassword,
        },
      })
        .then(value => {
          alert("Senha alterada com sucesso");
        })
        .catch(reason => {
          if (reason instanceof ApolloError) {
            if (reason.message === "The provided current password is invalid")
              alert("A senha atual informada não é válida");
            alert(reason.message);
          }
          alert(
            "Erro na alteração de senha\n" + JSON.stringify(reason, null, 2),
          );
        })
        .finally(() => {
          setUpdatePasswordIsLoading(false);
          setEditPasswordModal(false);
        });
    }
  }


  useEffect(() => {
    if (!loading && data) {
      loadInformations().then(data => {
        defineDefaultFieldValues(data);
        setUserInfos(data);
      });

      storage
        .load<UserInfos>({
          key: "userInfos",
        })
        .then(data => {
          console.error(data);
          setJwtToken(data.token);
        })
    }
  }, [data, loading]);

  let userNameDefault = data?.usersPermissionsUser.data?.attributes.username!;
  let emailDefault = data?.usersPermissionsUser.data?.attributes.email!;
  let phoneDefault = data?.usersPermissionsUser.data?.attributes.phoneNumber!;
  let cpfDefault = data?.usersPermissionsUser.data?.attributes.cpf!;

  useEffect(() => {
    AsyncStorage.getItem(`user${userData?.id}Cards`, (error, result) => {
      if (error) {
        null
      } else {
        const parsedCards = JSON.parse(result || "[]");
        setCards(parsedCards);
      }
    });
  }, [showCreditCards]);

  function clearCardDatas(): void {
    setPaymentCardValue('cardNumber', '');
    setPaymentCardValue('cvv', '');
    setPaymentCardValue('cep', '');
    setPaymentCardValue('district', '');
    setPaymentCardValue('state', '');
    setPaymentCardValue('street', '');
    setPaymentCardValue('dueDate', '');
    setPaymentCardValue('complement', '');
    setPaymentCardValue('country', '');
    setPaymentCardValue('houseNumber', '');
    setPaymentCardValue('city', '');
  }

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

    await AsyncStorage.setItem(
      `user${userData?.id}Cards`,
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

    clearCardDatas();
  };

  useEffect(() => {
    let foundCountryId: string | number | undefined;
    if (userPaymentCountryData)
      foundCountryId = getUsersCountryId(userData?.id, userPaymentCountryData);
    setCountryId(foundCountryId);
  }, [userPaymentCountryData]);

  useEffect(() => {
    if (countriesData && countryId) {
      const { data: newCountries } = countriesData.countries;

      const foundCountry = newCountries.find(
        country => String(country.id) === String(countryId),
      );

      if (foundCountry)
        setUserCountry({
          name: foundCountry.attributes.name,
          ISOCode: foundCountry.attributes.ISOCode,
          flag: {
            id: foundCountry.attributes.flag.data.id,
            name: foundCountry.attributes.flag.data.attributes.name,
            url: foundCountry.attributes.flag.data.attributes.url,
            hash: foundCountry.attributes.flag.data.attributes.hash,
            alternativeText:
              foundCountry.attributes.flag.data.attributes.alternativeText,
          },
          id: foundCountry.id,
        });
    }
  }, [countriesData]);

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
                    <Image
                      source={{ uri: profilePicture }}
                      style={styles.profilePicture}
                    />
                  ) : (
                    <Image
                      source={{ uri: HOST_API + photo }}
                      style={styles.profilePicture}
                    />
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
              <View className="p-6 space-y-6 h-fit">
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
                    <View className="flex flex-row items-center gap-2">
                      <FontAwesome name="plus" size={12} color="#FF6112" />
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
                                  key: userCountry?.id ?? "1",
                                  value: userCountry?.name ?? "Brasil",
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
                      <View className="flex-1">
                        <Text className="text-sm text-[#FF6112]">CEP</Text>
                        <Controller
                          name="cep"
                          control={paymentCardControl}
                          render={({ field: { onChange } }) => (
                            <MaskInput
                              value={getPaymentCardValues("cep")}
                              className="p-3 border border-neutral-400 rounded bg-white flex-1"
                              placeholder="Ex: 00000-000"
                              onChangeText={(masked, unmasked) =>
                                onChange(unmasked)
                              }
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
                      <View className="flex-1">
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
                      <Text className="text-sm text-[#FF6112]">
                        Complemento
                      </Text>
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
                      <View className="flex-1">
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
                      <View className="flex-1">
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
                        <Fragment key={card.id}>
                          <CreditCardCard
                            number={card.number}
                            id={card.id}
                          />
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
                <View className='h-fit'>
                  <TouchableOpacity
                    onPress={() => setEditPasswordModal(true)}
                    className="flex flex-row justify-end items-center h-fit"
                  >
                    <Text className="text-orange-600 border-b border-b-orange-600 text-base mb-4 h-fit">
                      Alterar senha
                    </Text>
                  </TouchableOpacity>
                  <View className='mb-20'>
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
                    <Text className=" font-bold text-lg mb-8">
                      Sair do App?
                    </Text>
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
          paddingTop={50}
        />
      </View>
      <Modal
        visible={editPasswordModal}
        animationType="fade"
        transparent={true}
        onRequestClose={closeEditPasswordModal}
      >
        <View className="h-full w-full justify-center items-center">
          <View className="h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6">
            <View className="w-full">
              <Text className="text-[14px] font-bold">
                Insira a sua senha atual:
              </Text>
              <View
                className={
                  passwordErrors.currentPassword
                    ? "flex flex-row items-center justify-between border border-red-400 rounded"
                    : "flex flex-row items-center justify-between border border-neutral-400 rounded"
                }
              >
                <Controller
                  name="currentPassword"
                  control={controlPassword}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field: { onChange } }) => (
                    <TextInput
                      textContentType="password"
                      secureTextEntry={!showCurrentPassword}
                      onChangeText={onChange}
                      className="p-4 flex-1"
                      placeholder="Senha atual"
                      placeholderTextColor="#B8B8B8"
                    />
                  )}
                />
                <TouchableOpacity onPress={handleShowCurrentPassword}>
                  <Image
                    className="h-4 w-4 m-4"
                    source={
                      !showCurrentPassword
                        ? require("../../assets/eye.png")
                        : require("../../assets/eye-slash.png")
                    }
                  ></Image>
                </TouchableOpacity>
              </View>
              {passwordErrors.currentPassword && (
                <Text className="text-red-400 text-sm -pt-[10px]">
                  {passwordErrors.currentPassword.message}
                </Text>
              )}
            </View>

            <View className="w-full">
              <Text className="text-[14px] font-bold">
                Insira sua nova senha:
              </Text>
              <View
                className={
                  passwordErrors.password
                    ? "flex flex-row items-center justify-between border border-red-400 rounded"
                    : "flex flex-row items-center justify-between border border-neutral-400 rounded"
                }
              >
                <Controller
                  name="password"
                  control={controlPassword}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field: { onChange } }) => (
                    <TextInput
                      textContentType="password"
                      secureTextEntry={!showPassword}
                      onChangeText={onChange}
                      className="p-4 flex-1"
                      placeholder="Nova senha"
                      placeholderTextColor="#B8B8B8"
                    />
                  )}
                />
                <TouchableOpacity onPress={handleShowPassword}>
                  <Image
                    className="h-4 w-4 m-4"
                    source={
                      !showPassword
                        ? require("../../assets/eye.png")
                        : require("../../assets/eye-slash.png")
                    }
                  ></Image>
                </TouchableOpacity>
              </View>
              {passwordErrors.password && (
                <Text className="text-red-400 text-sm -pt-[10px]">
                  {passwordErrors.password.message}
                </Text>
              )}
            </View>

            <View className="w-full">
              <Text className="text-[14px] font-bold">
                Confirme sua nova senha:
              </Text>
              <View
                className={
                  passwordErrors.confirmPassword
                    ? "flex flex-row items-center justify-between border border-red-400 rounded"
                    : "flex flex-row items-center justify-between border border-neutral-400 rounded"
                }
              >
                <Controller
                  name="confirmPassword"
                  control={controlPassword}
                  rules={{
                    required: true,
                    minLength: 6,
                  }}
                  render={({ field: { onChange } }) => (
                    <TextInput
                      textContentType="password"
                      secureTextEntry={!showConfirmedPassword}
                      onChangeText={onChange}
                      className="p-4 flex-1"
                      placeholder="Confirme a nova senha"
                      placeholderTextColor="#B8B8B8"
                    />
                  )}
                />
                <TouchableOpacity onPress={handleConfirmShowPassword}>
                  <Image
                    className="h-4 w-4 m-4"
                    source={
                      !showConfirmedPassword
                        ? require("../../assets/eye.png")
                        : require("../../assets/eye-slash.png")
                    }
                  ></Image>
                </TouchableOpacity>
              </View>
              {passwordErrors.confirmPassword && (
                <Text className="text-red-400 text-sm -pt-[10px]">
                  {passwordErrors.confirmPassword.message}
                </Text>
              )}
            </View>

            <View className="flex flex-row items-center mt-[10px]">
              <TouchableOpacity
                onPress={() => {
                  closeEditPasswordModal();
                }}
                className="h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]"
              >
                <Text className="font-medium text-[14px] text-[#8D8D8D]">
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmitPassword(handleUpdateUserPassword)}
                className="h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]"
              >
                <Text className="text-white font-medium text-[14px]">
                  {updatePasswordIsLoading ? (
                    <ActivityIndicator size="small" color="#F5620F" />
                  ) : (
                    "Confirmar"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
