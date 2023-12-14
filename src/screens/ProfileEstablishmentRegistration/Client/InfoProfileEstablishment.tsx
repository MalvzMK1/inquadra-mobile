import { HOST_API } from "@env";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
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
import MaskInput, { Masks } from "react-native-mask-input";
import Icon from "react-native-vector-icons/Ionicons";
import { z } from "zod";
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import { useUser } from "../../../context/userContext";
import useDeletePhoto from "../../../hooks/useDeletePhoto";
import { useGetUserHistoricPayment } from "../../../hooks/useGetHistoricPayment";
import { useGetUserEstablishmentInfos } from "../../../hooks/useGetUserEstablishmentInfos";
import { useQueryPolling } from "../../../hooks/useQueryPolling";
import useRegisterPixKey from "../../../hooks/useRegisterPixKey";
import useUpdateEstablishmentAddress from "../../../hooks/useUpdateEstablishmentAddress";
import useUpdateEstablishmentFantasyName from "../../../hooks/useUpdateEstablishmentFantasyName";
import useUpdateEstablishmentLogo from "../../../hooks/useUpdateEstablishmentLogo";
import useUpdateEstablishmentPhotos from "../../../hooks/useUpdateEstablishmentPhotos";
import useUpdateEstablishmentUser from "../../../hooks/useUpdateEstablishmentUser";
import useUpdateUserPassword from "../../../hooks/useUpdateUserPassword";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";
type DateTime = Date;

export default function InfoProfileEstablishment({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "InfoProfileEstablishment">) {
  const { userData, setUserData } = useUser();

  const [userId, setUserId] = useState<string>();
  const [establishmentId, setEstablishmentId] = useState<string | number>();

  const {
    data: userByEstablishmentData,
    error: userByEstablishmentError,
    loading: userByEstablishmentLoading,
  } = useGetUserEstablishmentInfos(userId ?? "");

  const [cep, setCep] = useState<string>("");
  const [fantasyName, setFantasyName] = useState<string>("");
  const [streetName, setStreetName] = useState<string>("");
  const [photos, setPhotos] = useState<Array<{ uri: string; id: string }>>([]);
  const [logo, setLogo] = useState<string>();

  interface IFormData {
    userName: string;
    email: string;
    phoneNumber: string;
  }

  interface IFantasyNameFormData {
    fantasyName: string;
  }

  const fantasyNameFormSchema = z.object({
    fantasyName: z
      .string()
      .nonempty("O campo não pode estar vazio")
      .default(fantasyName),
  });

  interface IAddressFormData {
    cep: string;
    streetName: string;
  }

  const addressFormSchema = z.object({
    cep: z.string().nonempty("O campo não pode estar vazio").default(cep),
    streetName: z
      .string()
      .nonempty("O campo não pode estar vazio")
      .default(streetName),
  });

  interface IPasswordFormData {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }

  const passwordFormSchema = z.object({
    currentPassword: z.string().nonempty("O campo não pode estar vazio"),
    password: z.string().nonempty("O campo não pode estar vazio"),
    confirmPassword: z.string().nonempty("O campo não pode estar vazio"),
  });

  interface IPixKeyFormData {
    pixKey: string;
  }

  const pixKeyFormSchema = z.object({
    pixKey: z.string().nonempty("O campo não pode estar vazio"),
  });

  const defaultUserName =
    userByEstablishmentData?.usersPermissionsUser.data?.attributes.name || "";
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const defaultUserEmail =
    userByEstablishmentData?.usersPermissionsUser.data?.attributes.email!;

  const formSchema = z.object({
    name: z
      .string()
      .nonempty("O campo não pode estar vazio")
      .default(defaultUserName),
    email: z
      .string()
      .nonempty("O campo não pode estar vazio")
      .default(defaultUserEmail),
    phoneNumber: z
      .string()
      .nonempty("O campo não pode estar vazio")
      .default(phoneNumber!),
  });

  const cpf =
    userByEstablishmentData?.usersPermissionsUser.data?.attributes.cpf;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });
  const {
    control: controlAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
  } = useForm<IAddressFormData>({
    resolver: zodResolver(addressFormSchema),
  });
  const {
    control: controlFantasyName,
    handleSubmit: handleSubmitFantasyName,
    formState: { errors: fantasyNameErrors },
  } = useForm<IFantasyNameFormData>({
    resolver: zodResolver(fantasyNameFormSchema),
  });
  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<IPasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });
  const {
    control: controlPixKey,
    handleSubmit: handleSubmitPixKey,
    formState: { errors: pixKeyErrors },
  } = useForm<IPixKeyFormData>({
    resolver: zodResolver(pixKeyFormSchema),
  });
  const [updateUserHook] = useUpdateEstablishmentUser();
  const [updateEstablishmentLogo] = useUpdateEstablishmentLogo();
  const [updateEstablishmentAddressHook, { data, error, loading }] =
    useUpdateEstablishmentAddress();
  const [updateEstablishmentFantasyNameHook] =
    useUpdateEstablishmentFantasyName();

  const [updateUserPassword] = useUpdateUserPassword();
  const [newPixKey] = useRegisterPixKey();

  const [amenities, setAmenities] = useState<string[]>([]);

  const [courts, setCourts] = useState<string[]>([]);
  interface ICourts {
    id: string;
    courtName: string;
  }

  const [courtsJson, setCourtsJson] = useState<ICourts[]>([]);

  let establishmentPhotos: string[] = [];

  const [pixKeys, setPixKeys] = useState<string[]>([]);

  const [editFantasyNameModal, setEditFantasyNameModal] = useState(false);
  const closeEditFantasyNameModal = () => setEditFantasyNameModal(false);
  const [editAddressModal, setEditAddressModal] = useState(false);
  const closeEditAddressModal = () => setEditAddressModal(false);
  const [editCNPJModal, setEditCNPJModal] = useState(false);
  const closeEditCNPJModal = () => setEditCNPJModal(false);
  const [editPasswordModal, setEditPasswordModal] = useState(false);
  const closeEditPasswordModal = () => setEditPasswordModal(false);
  const [selected, setSelected] = useState("");
  const [amenitieSelected, setAmeniniteSelected] = useState("");
  const [courtSelected, setCourtSelected] = useState("");
  const [uploadedPictureID, setUploadedPictureID] = useState<number | string>();
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const setAllFalse = () => {
    setEditFantasyNameModal(false);
    setEditAddressModal(false);
    setEditCNPJModal(false);
    setEditPasswordModal(false);
  };
  const handleOptionChange = (option: string) => {
    setSelected(option);

    if (selected == "Nome Fantasia") {
      setAllFalse();
      setEditFantasyNameModal(true);
    } else if (selected == "Endereço") {
      setAllFalse();
      setEditAddressModal(true);
    } else if (selected == "CNPJ") {
      setAllFalse();
      setEditCNPJModal(true);
    } else if (selected == "Alterar Senha") {
      setAllFalse();
      setEditPasswordModal(true);
    } else {
      setAllFalse();
    }
  };
  const [selectedPixKey, setSelectedPixKey] = useState<string>("0");

  const {
    data: dataPayment,
    loading: loadingPayment,
    startPolling,
    stopPolling,
    error: errorPayment,
  } = useGetUserHistoricPayment(route.params.establishmentId);
  useQueryPolling(10000, startPolling, stopPolling);
  const [withdrawalInfo, setWithdrawalInfo] = useState<
    Array<{
      id: string;
      key: string;
    }>
  >([]);

  useEffect(() => {
    if (!errorPayment) {
      if (
        dataPayment &&
        dataPayment.establishment.data.attributes.pix_keys.data.length > 0
      ) {
        const infosHold =
          dataPayment?.establishment.data.attributes.pix_keys.data.map(item => {
            return {
              id: item.id,
              key: item.attributes.key,
            };
          });
        setWithdrawalInfo(prevState => [...prevState, ...infosHold]);
      }
    } else {
      console.log("entrou aquii");
    }
  }, [dataPayment]);
  const [updateUserIsLoading, setUpdateUserIsLoading] = useState(false);

  const handleUpdateUser = async (data: IFormData): Promise<void> => {
    try {
      if (profilePicture) {
        const uploadedImageID = uploadedPictureID?.toString()!;

        const userDatas = {
          ...data,
        };

        userId &&
          updateUserHook({
            variables: {
              user_id: userId,
              email: userDatas.email,
              name: userDatas.userName,
              username: userDatas.email,
              phone_number: userDatas.phoneNumber,
              cpf: cpf!,
            },
          })
            .then(response => {
              updateEstablishmentLogo({
                variables: {
                  establishment_id: establishmentId!,
                  photo_id: uploadedImageID,
                },
              });
            })
            .catch(reason => alert(reason))
            .finally(() => {
              navigation.setParams({ establishmentPhoto: profilePicture });
            });
      } else {
        const uploadedImageID = await uploadImage(profilePicture!);

        const userDatas = {
          ...data,
        };

        userId &&
          updateUserHook({
            variables: {
              user_id: userId,
              name: userDatas.userName,
              email: userDatas.email,
              username: userDatas.email,
              phone_number: userDatas.phoneNumber,
              cpf: cpf!,
            },
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [updateAddressIsLoading, setUpdateAddressIsLoading] = useState(false);

  const handleUpdateEstablishmentAddress = (data: IAddressFormData): void => {
    setUpdateAddressIsLoading(true);

    const addressData = {
      ...data,
    };

    updateEstablishmentAddressHook({
      variables: {
        establishment_id:
          userByEstablishmentData?.usersPermissionsUser.data?.attributes
            .establishment.data?.id ?? "",
        cep: addressData.cep,
        street_name: addressData.streetName,
        latitude: userGeolocation?.latitude.toString() ?? "",
        longitude: userGeolocation?.longitude.toString() ?? "",
      },
    })
      .then(() => alert("Endereço atualizado com sucesso!"))
      .catch(reason => alert(reason))
      .finally(() => {
        setUpdateAddressIsLoading(false);
        setEditAddressModal(false);
      });
  };

  useEffect(() => {
    if (
      userByEstablishmentData &&
      userByEstablishmentData.usersPermissionsUser.data &&
      userByEstablishmentData.usersPermissionsUser.data.attributes.establishment
        .data
    ) {
      setCep(
        userByEstablishmentData.usersPermissionsUser.data.attributes
          .establishment.data?.attributes.address.cep!,
      );
      setLogo(
        userByEstablishmentData.usersPermissionsUser.data.attributes
          .establishment.data.attributes.logo.data?.attributes.url ?? undefined,
      );
      setPhotos(
        userByEstablishmentData.usersPermissionsUser.data.attributes.establishment.data.attributes.photos.data?.map(
          photo => ({
            uri: photo.attributes.url,
            id: photo.id,
          }),
        ) ?? [],
      );

      setEstablishmentId(
        userByEstablishmentData.usersPermissionsUser.data?.attributes
          .establishment.data?.id,
      );

      setPhoneNumber(
        userByEstablishmentData?.usersPermissionsUser.data?.attributes
          .phoneNumber,
      );

      navigation.setParams({
        establishmentId:
          userByEstablishmentData.usersPermissionsUser.data.attributes
            .establishment.data.id,
      });

      userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.amenities.data.map(
        amenitieItem => {
          amenitieItem &&
            setAmenities(prevState => [
              ...prevState,
              amenitieItem.attributes.name,
            ]);
        },
      );

      userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.courts.data.map(
        item => {
          setCourtsJson(prevState => [
            ...prevState,
            {
              id: item.id,
              courtName: item.attributes.name,
            },
          ]);
          item && setCourts(prevState => [...prevState, item?.attributes.name]);
        },
      );
      userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.photos.data!.map(
        photoItem => {
          establishmentPhotos.push(photoItem.id);
        },
      );
      userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.pix_keys.data.map(
        pixKeyItem => {
          setPixKeys(prevState => [...prevState, pixKeyItem?.attributes.key]);
        },
      );

      setStreetName(
        userByEstablishmentData?.usersPermissionsUser.data?.attributes
          .establishment.data?.attributes.address.streetName!,
      );
      setFantasyName(
        userByEstablishmentData?.usersPermissionsUser.data?.attributes
          .establishment.data?.attributes.fantasyName!,
      );
    }
    if (userData) {
      if (userData.id) {
        setUserId(userData.id);
        setUserGeolocation(userData.geolocation);
      } else
        navigation.navigate("Home", {
          userGeolocation: userData.geolocation,
          userPhoto: undefined,
          loadUserInfos: true,
        });
    }
  }, [userByEstablishmentData]);

  const [updateFantasyNameIsLoading, setUpdateFantasyNameIsLoading] =
    useState(false);

  const handleUpdateEstablishmentFantasyName = (
    data: IFantasyNameFormData,
  ): void => {
    setUpdateFantasyNameIsLoading(true);

    const fantasyNameData = {
      ...data,
    };

    updateEstablishmentFantasyNameHook({
      variables: {
        establishment_id:
          userByEstablishmentData?.usersPermissionsUser.data?.attributes
            .establishment.data?.id ?? "",
        fantasy_name: fantasyNameData.fantasyName,
        corporate_name: fantasyNameData.fantasyName,
      },
    })
      .then(value => {
        alert("Nome fantasia alterado com sucesso!");
      })
      .catch(reason => alert(reason))
      .finally(() => {
        setUpdateFantasyNameIsLoading(false);
        setEditFantasyNameModal(false);
      });
  };

  const [updatePasswordIsLoading, setUpdatePasswordIsLoading] = useState(false);

  const handleUpdateUserPassword = (data: IPasswordFormData): void => {
    setUpdatePasswordIsLoading(true);

    if (data.password === data.confirmPassword) {
      const passwordData = {
        ...data,
      };

      updateUserPassword({
        context: {
          headers: {
            Authorization: `bearer ${userData?.jwt ?? ''}`,
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
        .catch(reason => alert(reason))
        .finally(() => {
          setUpdatePasswordIsLoading(false);
          setEditPasswordModal(false);
        });
    }
  };

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  const [newPixKeyIsLoading, setNewPixKeyIsLoading] = useState(false);

  const handleNewPixKey = (data: IPixKeyFormData): void => {
    setNewPixKeyIsLoading(true);

    const pixKeyData = {
      ...data,
    };

    const currentDate: DateTime = new Date();

    setPixKeys(prevState => [...prevState, pixKeyData.pixKey]);

    newPixKey({
      variables: {
        establishment_id:
          userByEstablishmentData?.usersPermissionsUser.data?.attributes
            .establishment.data?.id ?? "",
        pix_key: pixKeyData.pixKey,
        published_at: currentDate,
      },
    })
      .then(() => {
        alert("Chave pix cadastrada com sucesso");
      })
      .catch(reason => alert(reason))
      .finally(() => setNewPixKeyIsLoading(false));
  };

  const [expiryDate, setExpiryDate] = useState("");

  const handleExpiryDateChange = (formatted: string) => {
    setExpiryDate(formatted);
  };

  const [cvv, setCVV] = useState("");

  const dataEstablishment = [
    { key: "1", value: "Razão Social" },
    { key: "2", value: "Nome Fantasia" },
    { key: "3", value: "Endereço" },
    { key: "4", value: "CNPJ" },
    { key: "5", value: "Alterar Senha" },
  ];

  const [profilePicture, setProfilePicture] = useState<string>();

  const [uploadImageIsLoading, setUploadImageIsLoading] = useState(false);

  const uploadImage = async (selectedImageUri: string) => {
    const apiUrl = "https://api-inquadra-uat.qodeless.com.br";

    const formData = new FormData();
    formData.append("files", {
      uri: selectedImageUri,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const uploadedImageID = response.data[0].id;

      return uploadedImageID;
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      return "Deu erro";
    }
  };

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
          setUploadedPictureID(uploadedImageID);
        });
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  };

  const [showCard, setShowCard] = useState(false);

  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handleCardClick = () => {
    setShowCard(!showCard);
    setShowCameraIcon(false);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleSaveCard = () => {
    setShowCard(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleExitApp = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const handleCVVChange = (input: any) => {
    const numericInput = input.replace(/\D/g, "");

    const truncatedCVV = numericInput.slice(0, 3);

    setCVV(truncatedCVV);
  };

  const handleEditCourt = (selectedCourt: string) => {
    const findCourt = courtsJson.find(
      courtItem => courtItem.courtName === selectedCourt,
    );

    navigation.navigate("EditCourt", {
      courtId: findCourt?.id,
      userPhoto: logo,
    });
  };

  const haveProfilePicture: boolean = !!logo;

  const { data: dataUserEstablishment } = useGetUserIDByEstablishment(
    route.params.establishmentId ?? "",
  );

  const [selectedImage, setSelectedImage] = useState<number>();
  const [deletePhoto] = useDeletePhoto();
  const [updateEstablishmentPhotos] = useUpdateEstablishmentPhotos();

  async function uploadNewEstablishmentPhoto() {
    try {
      if (establishmentId) {
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
          uploadImage(result.assets[0].uri).then(uploadedImage => {
            const newPhotos = photos;

            newPhotos.push({ uri: uploadedImage.uri, id: uploadedImage.id });

            setPhotos(newPhotos);
            updateEstablishmentPhotos({
              variables: {
                establishment_id: establishmentId,
                photos_id: newPhotos.map(photo => photo.id),
              },
            });
          });
        }
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  }

  function deleteEstablishmentPhoto(id: string, event: GestureResponderEvent) {
    try {
      event.preventDefault();

      deletePhoto({
        variables: {
          photo_id: id,
        },
      })
        .then(response => {
          if (response.data?.deleteUploadFile.data?.id === id) {
            const deletedPhotoIndex = photos.findIndex(
              photo => photo.id === id,
            );
            const updatedPhotos = photos;

            updatedPhotos.splice(deletedPhotoIndex, 1);

            setPhotos(updatedPhotos);

            alert("Foto deletada com sucesso!");

            return;
          }
        })
        .catch(error => {
          alert("Não foi possível deletar a imagem!");
          console.error(JSON.stringify(error, null, 2));
        });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }

  return (
    <View className="flex-1 bg-white h-full">
      <ScrollView className="flex-grow p-1">
        <TouchableOpacity className="items-center mt-8">
          <View style={styles.container}>
            {profilePicture ? (
              <Image
                source={{ uri: profilePicture }}
                style={styles.profilePicture}
              />
            ) : (
              <Image
                source={{
                  uri:
                    HOST_API +
                    userByEstablishmentData?.usersPermissionsUser.data
                      ?.attributes.establishment.data?.attributes.logo.data
                      ?.attributes.url,
                }}
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

        <View className="p-6 space-y-10">
          <View>
            <Text className="text-base">Nome</Text>
            <Controller
              name="userName"
              control={control}
              defaultValue={defaultUserName}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field: { onChange } }) => (
                <TextInput
                  textContentType="username"
                  defaultValue={defaultUserName}
                  onChangeText={onChange}
                  className={`p-4 border ${
                    errors.userName ? "border-red-400" : "border-gray-500"
                  }  rounded-lg h-45`}
                  placeholder="Jhon"
                  placeholderTextColor="#B8B8B8"
                />
              )}
            />
            {errors.userName && (
              <Text className="text-red-400 text-sm -pt-[10px]">
                {errors.userName.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base">E-mail</Text>
            <Controller
              name="email"
              defaultValue={defaultUserEmail}
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field: { onChange } }) => (
                <TextInput
                  textContentType="emailAddress"
                  defaultValue={defaultUserEmail}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  className={`p-4 border ${
                    errors.email ? "border-red-400" : "border-gray-500"
                  }  rounded-lg h-45`}
                  placeholder="Jhon@mail.com.br"
                  placeholderTextColor="#B8B8B8"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-400 text-sm -pt-[10px]">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base">Telefone</Text>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field: { onChange } }) => (
                <MaskInput
                  className={`p-4 border ${
                    errors.phoneNumber ? "border-red-400" : "border-gray-500"
                  }  rounded-lg h-45`}
                  placeholder="Ex: (00) 0000-0000"
                  value={phoneNumber}
                  onChangeText={(masked, unmasked) => {
                    onChange(masked);
                    setPhoneNumber(masked);
                  }}
                  mask={Masks.BRL_PHONE}
                ></MaskInput>
              )}
            />
            {errors.phoneNumber && (
              <Text className="text-red-400 text-sm -pt-[10px]">
                {errors.phoneNumber.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base">CPF</Text>
            <MaskInput
              className="p-4 border border-gray-500 rounded-lg"
              placeholder="Ex: 000.000.000-00"
              value={cpf}
              mask={Masks.BRL_CPF}
              editable={false}
            ></MaskInput>
          </View>

          <View>
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-base">Fotos do Estabelecimento</Text>
              <TouchableOpacity
                onPress={uploadNewEstablishmentPhoto}
                className="p-2 border-orange-500 border rounded-full"
              >
                <Ionicons name={"add"} color={"#F5620F"} size={32} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={photos}
              horizontal
              renderItem={({ item, index }) => (
                <View className="w-32 h-32 rounded-md relative block mx-2">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedImage(index);
                    }}
                  >
                    <Image
                      source={{ uri: HOST_API + item.uri }}
                      className="h-full"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={event => deleteEstablishmentPhoto(item.id, event)}
                    className="absolute bottom-0 right-0"
                  >
                    <Ionicons name="trash" size={25} color="#FF6112" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <Modal
            visible={selectedImage !== undefined}
            transparent
            animationType={"fade"}
          >
            {selectedImage !== undefined && (
              <View className="flex-1 justify-center items-center bg-[#0008] rounded">
                <View className="w-5/6 aspect-square flex justify-center items-center">
                  <Image
                    className="w-full h-full"
                    source={{ uri: HOST_API + photos[selectedImage].uri }}
                  />
                  <TouchableOpacity
                    className="self-end"
                    onPress={() => {
                      setSelectedImage(undefined);
                    }}
                  >
                    <Text className="text-base border-b border-b-orange-600">
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>

          <TouchableOpacity onPress={handleCardClick}>
            <Text className="text-base">Chave PIX</Text>
            <View className="h-16 border border-gray-500 rounded-lg flex flex-row items-center">
              <View className="flex-row justify-center items-center m-2">
                <Text className="flex-1 text-base text-[#B8B8B8]">
                  {" "}
                  Chaves Cadastradas
                </Text>

                <Icon
                  name={showCard ? "chevron-up" : "chevron-down"}
                  size={25}
                  color="#FF4715"
                  style={{ marginRight: 8 }}
                />
              </View>
            </View>
          </TouchableOpacity>

          {showCard &&
            (loadingPayment ? (
              <ActivityIndicator size="small" color="#F5620F" />
            ) : (
              <View>
                <FlatList
                  data={withdrawalInfo}
                  keyExtractor={card => card.id}
                  renderItem={({ item: card }) => {
                    return (
                      <TouchableOpacity
                        className={`p-5 flex-row rounded-lg mt-2 ${
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
                <View className="border border-gray-500 p-4 mt-8 ">
                  <View className="flex-row justify-between">
                    <View className="flex-1">
                      <Text className="text-base text-[#FF6112] mb-3">
                        Chave PIX
                      </Text>
                      <View>
                        <Controller
                          name="pixKey"
                          control={controlPixKey}
                          rules={{
                            required: true,
                          }}
                          render={({ field: { onChange } }) => (
                            <TextInput
                              onChangeText={onChange}
                              className={`p-4 border ${
                                pixKeyErrors.pixKey
                                  ? "border-red-400"
                                  : "border-gray-500"
                              }  rounded-lg h-45`}
                              placeholder="Coloque sua chave PIX"
                              placeholderTextColor="#B8B8B8"
                            />
                          )}
                        />
                        {pixKeyErrors.pixKey && (
                          <Text className="text-red-400 text-sm -pt-[10px]">
                            {pixKeyErrors.pixKey.message}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View className="p-5 justify-center items-center">
                    <TouchableOpacity
                      onPress={handleSubmitPixKey(handleNewPixKey)}
                      className="w-80 h-10 rounded-md bg-[#FF6112] flex items-center justify-center"
                    >
                      <Text className="text-white font-medium text-[14px]">
                        {newPixKeyIsLoading ? (
                          <ActivityIndicator size="small" color="#F5620F" />
                        ) : (
                          "Salvar"
                        )}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          <View>
            <View>
              <Text className="text-base mb-1">Dados Estabelecimento</Text>
              <SelectList
                setSelected={(val: string) => setSelected(val)}
                onSelect={() => handleOptionChange(selected)}
                data={dataEstablishment}
                save="value"
                placeholder="Selecione um dado"
                searchPlaceholder="Pesquisar..."
                dropdownTextStyles={{ color: "#FF6112" }}
                inputStyles={{
                  alignSelf: "center",
                  height: 32,
                  color: "#B8B8B8",
                }}
                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                searchicon={
                  <Ionicons
                    name="search"
                    size={18}
                    color="#FF6112"
                    style={{ marginEnd: 10 }}
                  />
                }
                search={false}
                arrowicon={
                  <AntDesign
                    name="down"
                    size={20}
                    color="#FF6112"
                    style={{ alignSelf: "center" }}
                  />
                }
              />
            </View>
          </View>
          <View className="">
            <Text className="text-base mb-1">Amenidades do Local</Text>
            <SelectList
              setSelected={(val: string) => setAmeniniteSelected(val)}
              data={amenities}
              save="value"
              notFoundText="Nenhuma amenidade cadastrada"
              placeholder="Selecione um dado"
              searchPlaceholder="Pesquisar..."
              dropdownTextStyles={{ color: "#FF6112" }}
              inputStyles={{
                alignSelf: "center",
                height: 32,
                color: "#B8B8B8",
              }}
              closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
              searchicon={
                <Ionicons
                  name="search"
                  size={18}
                  color="#FF6112"
                  style={{ marginEnd: 10 }}
                />
              }
              arrowicon={
                <AntDesign
                  name="down"
                  size={20}
                  color="#FF6112"
                  style={{ alignSelf: "center" }}
                />
              }
            />
          </View>

          <View className="">
            <Text className="text-base mb-1">Editar Quadra/Campo</Text>
            <SelectList
              setSelected={(val: string) => setCourtSelected(val)}
              onSelect={() => {
                handleEditCourt(courtSelected);
              }}
              data={courts}
              save="value"
              notFoundText="Nenhuma quadra cadastrada"
              placeholder="Selecione um dado"
              searchPlaceholder="Pesquisar..."
              dropdownTextStyles={{ color: "#FF6112" }}
              inputStyles={{
                alignSelf: "center",
                height: 32,
                color: "#B8B8B8",
              }}
              closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
              searchicon={
                <Ionicons
                  name="search"
                  size={18}
                  color="#FF6112"
                  style={{ marginEnd: 10 }}
                />
              }
              arrowicon={
                <AntDesign
                  name="down"
                  size={20}
                  color="#FF6112"
                  style={{ alignSelf: "center" }}
                />
              }
            />
          </View>

          <View>
            <View className="p-2">
              <TouchableOpacity
                onPress={handleSubmit(handleUpdateUser)}
                className="h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center"
              >
                <Text className="text-gray-50">
                  {updateUserIsLoading ? (
                    <ActivityIndicator size="small" color="#F5620F" />
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
                className="h-14 w-81 rounded-md flex items-center justify-center"
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
                onPressIn={() =>
                  navigation.navigate("DeleteAccountEstablishment", {
                    establishmentName:
                      userByEstablishmentData?.usersPermissionsUser.data
                        ?.attributes.establishment.data?.attributes
                        .corporateName,
                  })
                }
              >
                <Text className="text-white">Confirmar</Text>
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
                onPressIn={() => {
                  setUserData({
                    id: undefined,
                    jwt: undefined,
                    geolocation: userData?.geolocation,
                  }).then(() => {
                    navigation.navigate("Home", {
                      userGeolocation: userData?.geolocation ?? undefined,
                    });
                  });
                }}
              >
                <Text className="text-white">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={editFantasyNameModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeEditFantasyNameModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6">
              <View className="w-full">
                <Text className="text-[14px] font-bold">
                  Insira um novo nome fantasia:
                </Text>
                <Controller
                  name="fantasyName"
                  control={controlFantasyName}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange } }) => (
                    <TextInput
                      defaultValue={fantasyName}
                      onChangeText={onChange}
                      className={`p-4 border ${
                        fantasyNameErrors.fantasyName
                          ? "border-red-400"
                          : "border-gray-500"
                      }  rounded-lg h-45`}
                      placeholder="Nome Fantasia"
                      placeholderTextColor="#B8B8B8"
                    />
                  )}
                />
                {fantasyNameErrors.fantasyName && (
                  <Text className="text-red-400 text-sm -pt-[10px]">
                    {fantasyNameErrors.fantasyName.message}
                  </Text>
                )}
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditFantasyNameModal();
                  }}
                  className="h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]"
                >
                  <Text className="font-medium text-[14px] text-[#8D8D8D]">
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitFantasyName(
                    handleUpdateEstablishmentFantasyName,
                  )}
                  className="h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]"
                >
                  <Text className="text-white font-medium text-[14px]">
                    {updateFantasyNameIsLoading ? (
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

        <Modal
          visible={editAddressModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeEditAddressModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6">
              <View className="w-full">
                <Text className="text-[14px] font-bold">
                  Insira o número do seu CEP:
                </Text>
                <Controller
                  name="cep"
                  control={controlAddress}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange } }) => (
                    <MaskInput
                      className={`p-4 border ${
                        addressErrors.cep ? "border-red-400" : "border-gray-500"
                      }  rounded-lg h-45`}
                      value={cep}
                      onChangeText={(masked, unmasked) => {
                        onChange(masked);
                        setCep(masked);
                      }}
                      mask={Masks.ZIP_CODE}
                      keyboardType="numeric"
                    />
                  )}
                />
                {addressErrors.cep && (
                  <Text className="text-red-400 text-sm -pt-[10px]">
                    {addressErrors.cep.message}
                  </Text>
                )}
              </View>

              <View className="w-full">
                <Text className="text-[14px] font-bold">
                  Insira o nome da sua rua:
                </Text>
                <Controller
                  name="streetName"
                  control={controlAddress}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange } }) => (
                    <TextInput
                      defaultValue={streetName}
                      onChangeText={onChange}
                      className={`p-4 border ${
                        addressErrors.streetName
                          ? "border-red-400"
                          : "border-gray-500"
                      }  rounded-lg h-45`}
                      placeholder="Nome da rua"
                      placeholderTextColor="#B8B8B8"
                    />
                  )}
                />
                {addressErrors.streetName && (
                  <Text className="text-red-400 text-sm -pt-[10px]">
                    {addressErrors.streetName.message}
                  </Text>
                )}
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditAddressModal();
                  }}
                  className="h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]"
                >
                  <Text className="font-medium text-[14px] text-[#8D8D8D]">
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmitAddress(
                    handleUpdateEstablishmentAddress,
                  )}
                  className="h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]"
                >
                  <Text className="text-white font-medium text-[14px]">
                    {updateAddressIsLoading ? (
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

        <Modal
          visible={editCNPJModal}
          animationType="fade"
          transparent={true}
          onRequestClose={closeEditCNPJModal}
        >
          <View className="h-full w-full justify-center items-center">
            <View className="h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6">
              <View className="w-full">
                <Text className="text-[14px] font-bold">Seu CNPJ:</Text>
                <TextInput
                  className="p-[5px] border border-neutral-400 rounded bg-white"
                  value={
                    userByEstablishmentData?.usersPermissionsUser.data
                      ?.attributes.establishment.data?.attributes.cnpj || ""
                  }
                  editable={false}
                />
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditCNPJModal();
                  }}
                  className="h-fit w-full rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]"
                >
                  <Text className="font-medium text-[14px] text-white">
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
                          ? require("../../../assets/eye.png")
                          : require("../../../assets/eye-slash.png")
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
                          ? require("../../../assets/eye.png")
                          : require("../../../assets/eye-slash.png")
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
                          ? require("../../../assets/eye.png")
                          : require("../../../assets/eye-slash.png")
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
        <View className="h-16"></View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
        <BottomBlackMenuEstablishment
          screen="Any"
          establishmentLogo={
            dataUserEstablishment?.establishment?.data?.attributes?.logo?.data
              ?.attributes?.url !== undefined
              ? HOST_API +
                dataUserEstablishment?.establishment?.data?.attributes?.logo
                  ?.data?.attributes?.url
              : null
          }
          establishmentID={
            userByEstablishmentData?.usersPermissionsUser.data?.attributes
              .establishment.data?.id!
          }
          key={1}
          paddingTop={10}
        />
      </View>
    </View>
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
