import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SelectList } from 'react-native-dropdown-select-list';
import { useGetUserEstablishmentInfos } from '../../../hooks/useGetUserEstablishmentInfos';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from "react-hook-form";
import useUpdateUser from '../../../hooks/useUpdateUser';
import useUpdateEstablishmentAddress from '../../../hooks/useUpdateEstablishmentAddress';
import storage from '../../../utils/storage';
import useUpdateEstablishmentFantasyName from '../../../hooks/useUpdateEstablishmentFantasyName';
import useUpdateUserPassword from '../../../hooks/useUpdateUserPassword';
import useRegisterPixKey from '../../../hooks/useRegisterPixKey';
import useDeleteUser from '../../../hooks/useDeleteUser';
type DateTime = Date;
import BottomBlackMenuEstablishment from "../../../components/BottomBlackMenuEstablishment";
import { useGetUserIDByEstablishment } from "../../../hooks/useUserByEstablishmentID";
import { HOST_API } from "@env";

interface IFormData {
    userName: string
    email: string
    phoneNumber: string
}

const formSchema = z.object({
    userName: z.string()
        .nonempty('O campo não pode estar vazio'),
    email: z.string()
        .nonempty('O campo não pode estar vazio'),
    phoneNumber: z.string()
        .nonempty('O campo não pode estar vazio')
})

interface IFantasyNameFormData {
    fantasyName: string
}

const fantasyNameFormSchema = z.object({
    fantasyName: z.string()
        .nonempty('O campo não pode estar vazio')
})

interface IAddressFormData {
    cep: string
    streetName: string
}

const addressFormSchema = z.object({
    cep: z.string()
        .nonempty('O campo não pode estar vazio'),
    streetName: z.string()
        .nonempty('O campo não pode estar vazio')
})

interface IPasswordFormData {
    currentPassword: string
    password: string
    confirmPassword: string
}

const passwordFormSchema = z.object({
    currentPassword: z.string()
        .nonempty('O campo não pode estar vazio'),
    password: z.string()
        .nonempty('O campo não pode estar vazio'),
    confirmPassword: z.string()
        .nonempty('O campo não pode estar vazio')
})

interface IPixKeyFormData {
    pixKey: string
}

const pixKeyFormSchema = z.object({
    pixKey: z.string()
        .nonempty('O campo não pode estar vazio')
})


export default function InfoProfileEstablishment({ navigation, route }: NativeStackScreenProps<RootStackParamList, "InfoProfileEstablishment">) {
    const [userId, setUserId] = useState("")
    const { control, handleSubmit, formState: { errors } } = useForm<IFormData>({
        resolver: zodResolver(formSchema)
    })
    const { control: controlAddress, handleSubmit: handleSubmitAddress, formState: { errors: addressErrors } } = useForm<IAddressFormData>({
        resolver: zodResolver(addressFormSchema)
    })
    const { control: controlFantasyName, handleSubmit: handleSubmitFantasyName, formState: { errors: fantasyNameErrors } } = useForm<IFantasyNameFormData>({
        resolver: zodResolver(fantasyNameFormSchema)
    })
    const { control: controlPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<IPasswordFormData>({
        resolver: zodResolver(passwordFormSchema)
    })
    const { control: controlPixKey, handleSubmit: handleSubmitPixKey, formState: { errors: pixKeyErrors } } = useForm<IPixKeyFormData>({
        resolver: zodResolver(pixKeyFormSchema)
    })
    const [updateUserHook, { data: updateUserData, error: updateUserError, loading: updateUserLoading }] = useUpdateUser()
    const [updateEstablishmentAddressHook, { data, error, loading }] = useUpdateEstablishmentAddress()
    const [updateEstablishmentFantasyNameHook, { data: updateFantasyNameData, error: updateFantasyNameError, loading: updateFantasyNameLoading }] = useUpdateEstablishmentFantasyName()
    const { data: userByEstablishmentData, error: userByEstablishmentError, loading: userByEstablishmentLoading } = useGetUserEstablishmentInfos(userId)
    const [updateUserPassword, { data: updateUserPasswordData, error: updateUserPasswordError, loading: updateUserPasswordLoading }] = useUpdateUserPassword()
    const [newPixKey, { data: newPixKeyData, error: newPixKeyError, loading: newPixKeyLoading }] = useRegisterPixKey()
    const [userDelete] = useDeleteUser()

    let amenities: string[] = []

    let courts: string[] = []
    interface ICourts {
        id: string
        courtName: string
    }
    let courtsJson: ICourts[] = []

    let establishmentPhotos: string[] = []

    let pixKeys: string[] = []

    const userName = userByEstablishmentData?.usersPermissionsUser.data?.attributes.username
    const userEmail = userByEstablishmentData?.usersPermissionsUser.data?.attributes.email

    const [phoneNumber, setPhoneNumber] = useState<string | undefined>()

    const cpf = userByEstablishmentData?.usersPermissionsUser.data?.attributes.cpf

    const [editFantasyNameModal, setEditFantasyNameModal] = useState(false);
    const closeEditFantasyNameModal = () => setEditFantasyNameModal(false)
    const [editAddressModal, setEditAddressModal] = useState(false)
    const closeEditAddressModal = () => setEditAddressModal(false)
    const [editCNPJModal, setEditCNPJModal] = useState(false)
    const closeEditCNPJModal = () => setEditCNPJModal(false)
    const [editPasswordModal, setEditPasswordModal] = useState(false)
    const closeEditPasswordModal = () => setEditPasswordModal(false)
    const [selected, setSelected] = useState("")
    const [pixKeySelected, setPixKeySelected] = useState("")
    const [amenitieSelected, setAmeniniteSelected] = useState("")
    const [courtSelected, setCourtSelected] = useState("")

    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    const setAllFalse = () => {
        setEditFantasyNameModal(false)
        setEditAddressModal(false)
        setEditCNPJModal(false)
        setEditPasswordModal(false)
    }
    const handleOptionChange = (option: string) => {
        setSelected(option)

        if (selected == "Nome Fantasia") {
            setAllFalse()
            setEditFantasyNameModal(true)
        }
        else if (selected == "Endereço") {
            setAllFalse()
            setEditAddressModal(true)
        }
        else if (selected == "CNPJ") {
            setAllFalse()
            setEditCNPJModal(true)
        }
        else if (selected == "Alterar Senha") {
            setAllFalse()
            setEditPasswordModal(true)
        } else {
            setAllFalse()
        }
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateUser = (data: IFormData): void => {
        setIsLoading(true)

        const userDatas = {
            ...data,
        }

        updateUserHook({
            variables: {
                user_id: userId,
                username: userDatas.userName,
                email: userDatas.email,
                phone_number: userDatas.phoneNumber,
                cpf: cpf!
            }
        }).then(value => {
            alert(value.data?.updateUsersPermissionsUser.data?.attributes.username)
        })
            .catch((reason) => alert(reason))
            .finally(() => setIsLoading(false))
    }

    const [cep, setCep] = useState<string | undefined>()

    const streetName = userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.address.streetName

    const handleUpdateEstablishmentAddress = (data: IAddressFormData): void => {
        setIsLoading(true)

        const addressData = {
            ...data
        }

        updateEstablishmentAddressHook({
            variables: {
                establishment_id: userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data.id ?? "",
                cep: addressData.cep,
                street_name: addressData.streetName,
                latitude: userGeolocation?.latitude.toString() ?? "",
                longitude: userGeolocation?.longitude.toString() ?? ""
            }
        }).then(value => {
            alert(value.data?.updateEstablishment.data?.attributes.address.streetName)
        })
            .catch((reason) => alert(reason))
            .finally(() => setIsLoading(false))
    }

    const [fantasyName, setFantasyName] = useState<string | undefined>("")

    useEffect(() => {
        setCep(userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.address.cep)

        setPhoneNumber(userByEstablishmentData?.usersPermissionsUser.data?.attributes.phoneNumber)

        userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.amenities.data.map(amenitieItem => {
            amenities.push(amenitieItem?.attributes.name)
        })
        userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.courts.data.map(item => {
            courtsJson = [...courtsJson, { id: item.id, courtName: item?.attributes.name }]
            courts.push(item?.attributes.name)
        })
        userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.photos.data.map(photoItem => {
            establishmentPhotos.push(photoItem.id)
        })
        userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.pix_keys.data.map(pixKeyItem => {
            pixKeys.push(pixKeyItem?.attributes.key)
        })

        storage.load<UserInfos>({
            key: 'userInfos',
        }).then((data) => {
            setUserId(data.userId)
        }).catch(error => {
            if (error instanceof Error) {
                if (error.name === 'NotFoundError') {
                    console.log('The item wasn\'t found.');
                } else if (error.name === 'ExpiredError') {
                    console.log('The item has expired.');
                    storage.remove({
                        key: 'userInfos'
                    }).then(() => {
                        console.log('The item has been removed.');
                    })
                } else {
                    console.log('Unknown error:', error);
                }
            }
        });
    }, [userByEstablishmentData])

    const handleUpdateEstablishmentFantasyName = (data: IFantasyNameFormData): void => {
        setIsLoading(true)

        const fantasyNameData = {
            ...data
        }

        updateEstablishmentFantasyNameHook({
            variables: {
                establishment_id: userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data.id ?? "",
                fantasy_name: fantasyNameData.fantasyName
            }
        }).then(value => {
            alert(value.data?.updateEstablishment.data?.attributes.fantasyName)
        })
            .catch((reason) => alert(reason))
            .finally(() => setIsLoading(false))
    }

    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleUpdateUserPassword = (data: IPasswordFormData): void => {
        setIsLoading(true)

        if (data.password === data.confirmPassword) {
            const passwordData = {
                ...data
            }

            updateUserPassword({
                variables: {
                    current_password: passwordData.currentPassword,
                    password: passwordData.password,
                    password_confirmation: passwordData.confirmPassword
                }
            }).then(value => {
                alert("Senha alterada com sucesso")
            })
                .catch((reason) => alert(reason))
                .finally(() => setIsLoading(false))
        }
    }

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)

    const handleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword)
    }
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleConfirmShowPassword = () => {
        setShowConfirmedPassword(!showConfirmedPassword)
    }

    const handleNewPixKey = (data: IPixKeyFormData): void => {
        setIsLoading(true)

        const pixKeyData = {
            ...data
        }

        const currentDate: DateTime = new Date();

        newPixKey({
            variables: {
                establishment_id: userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data.id ?? "",
                pix_key: pixKeyData.pixKey,
                published_at: currentDate
            }
        }).then(() => alert("Chave pix cadastrada com sucesso"))
            .catch((reason) => alert(reason))
            .finally(() => setIsLoading(false))
    }

    const [expiryDate, setExpiryDate] = useState('');

    const handleExpiryDateChange = (formatted: string) => {
        setExpiryDate(formatted);
    };

    const [cvv, setCVV] = useState('');

    const dataEstablishment = [
        { key: '1', value: 'Razão Social' },
        { key: '2', value: 'Nome Fantasia' },
        { key: '3', value: 'Endereço' },
        { key: '4', value: 'CNPJ' },
        { key: '5', value: 'Alterar Senha' },
    ]

    const [profilePicture, setProfilePicture] = useState(route.params.userPhoto);


    const handleProfilePictureUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Desculpe, precisamos da permissão para acessar a galeria!');
                return;
            }

            // const result = await ImagePicker.launchImageLibraryAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //     allowsEditing: true,
            //     aspect: [1, 1],
            //     quality: 1,
            // });

            // if (!result.canceled) {
            //     setProfilePicture(result.uri);
            //     await uploadImage(result.uri);
            // }
        } catch (error) {
            console.log('Erro ao carregar a imagem: ', error);
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


    const [selectedValue, setSelectedValue] = useState('');

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
        // sair do app
        setShowExitConfirmation(false);
    };

    const handleCancelExit = () => {
        setShowExitConfirmation(false);

    };

    const handleCVVChange = (input: any) => {
        const numericInput = input.replace(/\D/g, '');

        const truncatedCVV = numericInput.slice(0, 3);

        setCVV(truncatedCVV);
    };

    const handleEditCourt = (selectedCourt: string) => {
        const findCourt = courtsJson.find(courtItem => courtItem.courtName === selectedCourt)

        navigation.navigate('EditCourt', {
            courtId: findCourt?.id,
            userPhoto: userByEstablishmentData?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url
        })
    }


    const { data: dataUserEstablishment, error: errorUserEstablishment, loading: loadingUserEstablishment } = useGetUserIDByEstablishment(route.params.establishmentId ?? "")

    useEffect(() => {
        setProfilePicture(route.params.userPhoto)

        navigation.setParams({
            userPhoto: route.params.userPhoto,
        })
        console.log('ive setted this, wtf')
    }, [])

    return (
        <View className="flex-1 bg-white h-full">

            <ScrollView className="flex-grow p-1">
                <TouchableOpacity className="items-center mt-8">
                    <View style={styles.container}>
                        {profilePicture ? (
                            <Image source={{ uri: HOST_API + profilePicture }} style={styles.profilePicture} />
                        ) : (
                            <Image source={{ uri: "http://192.168.15.19:1337" + userByEstablishmentData?.usersPermissionsUser.data?.attributes.photo.data?.attributes.url }} style={styles.profilePicture} />
                        )}
                        <TouchableOpacity onPress={handleProfilePictureUpload} style={styles.uploadButton}>
                            {profilePicture ? (
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
                            name='userName'
                            control={control}
                            rules={{
                                required: true,
                                minLength: 6
                            }}
                            render={({ field: { onChange } }) => (
                                <TextInput
                                    textContentType='username'
                                    defaultValue={userName}
                                    onChangeText={onChange}
                                    className={`p-4 border ${errors.userName ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                    placeholder='Jhon'
                                    placeholderTextColor="#B8B8B8"
                                />
                            )}
                        />
                        {errors.userName && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.userName.message}</Text>}
                    </View>

                    <View>
                        <Text className="text-base">E-mail</Text>
                        <Controller
                            name='email'
                            control={control}
                            rules={{
                                required: true,
                                minLength: 6
                            }}
                            render={({ field: { onChange } }) => (
                                <TextInput
                                    textContentType='emailAddress'
                                    defaultValue={userEmail}
                                    onChangeText={onChange}
                                    keyboardType='email-address'
                                    className={`p-4 border ${errors.email ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                    placeholder='Jhon@mail.com.br'
                                    placeholderTextColor="#B8B8B8"
                                />
                            )}
                        />
                        {errors.email && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.email.message}</Text>}
                    </View>

                    <View>
                        <Text className="text-base">Telefone</Text>
                        <Controller
                            name='phoneNumber'
                            control={control}
                            rules={{
                                required: true,
                                minLength: 6
                            }}
                            render={({ field: { onChange } }) => (
                                <MaskInput
                                    className={`p-4 border ${errors.phoneNumber ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                    placeholder='Ex: (00) 0000-0000'
                                    value={phoneNumber}
                                    onChangeText={(masked, unmasked) => {
                                        onChange(masked)
                                        setPhoneNumber(masked)
                                    }}
                                    mask={Masks.BRL_PHONE}>
                                </MaskInput>
                            )}
                        />
                        {errors.phoneNumber && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.phoneNumber.message}</Text>}
                    </View>

                    <View>
                        <Text className="text-base">CPF</Text>
                        <MaskInput
                            className='p-4 border border-gray-500 rounded-lg h-45'
                            placeholder='Ex: 000.000.000-00'
                            value={cpf}
                            mask={Masks.BRL_CPF}
                            editable={false}>
                        </MaskInput>
                    </View>

                    <TouchableOpacity onPress={handleCardClick}>
                        <Text className="text-base">Chave PIX</Text>
                        <View className="h-12 border border-gray-500 rounded-lg">
                            <View className="flex-row justify-center items-center m-2">
                                <Text className="flex-1 text-base text-[#B8B8B8]"> Chaves Cadastradas
                                </Text>

                                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" style={{ marginRight: 8 }} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {showCard && (
                        <View>
                            <SelectList
                                setSelected={(val: string) => setPixKeySelected(val)}
                                data={pixKeys}
                                save="value"
                                notFoundText='Nenhuma chave pix cadastrada'
                                placeholder='Selecione um dado'
                                searchPlaceholder="Pesquisar..."
                                dropdownTextStyles={{ color: "#FF6112" }}
                                inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                                searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                                arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}
                            />
                        </View>
                    )}

                    {showCard && (
                        <View className="border border-gray-500 p-4 ">
                            <View className="flex-row justify-between">
                                <View className="flex-1">
                                    <Text className="text-base text-[#FF6112] mb-3">Chave PIX</Text>
                                    <View>
                                        <Controller
                                            name='pixKey'
                                            control={controlPixKey}
                                            rules={{
                                                required: true
                                            }}
                                            render={({ field: { onChange } }) => (
                                                <TextInput
                                                    onChangeText={onChange}
                                                    className={`p-4 border ${pixKeyErrors.pixKey ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                                    placeholder='Coloque sua chave PIX'
                                                    placeholderTextColor="#B8B8B8"
                                                />
                                            )}
                                        />
                                        {pixKeyErrors.pixKey && <Text className='text-red-400 text-sm -pt-[10px]'>{pixKeyErrors.pixKey.message}</Text>}
                                    </View>
                                </View>
                            </View>

                            <View className="p-5 justify-center items-center">
                                <TouchableOpacity onPress={handleSubmitPixKey(handleNewPixKey)} className="w-80 h-10 rounded-md bg-[#FF6112] flex items-center justify-center">
                                    <Text className='text-white font-medium text-[14px]'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Salvar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <View>
                        <View className="">
                            <Text className='text-base mb-1'>Dados Estabelecimento</Text>
                            <SelectList
                                setSelected={(val: string) => setSelected(val)}
                                onSelect={() => handleOptionChange(selected)}
                                data={dataEstablishment}
                                save="value"
                                placeholder='Selecione um dado'
                                searchPlaceholder="Pesquisar..."
                                dropdownTextStyles={{ color: "#FF6112" }}
                                inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                                searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                                arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

                            />
                        </View>

                    </View>
                    <View className="">
                        <Text className='text-base mb-1'>Amenidades do Local</Text>
                        <SelectList
                            setSelected={(val: string) => setAmeniniteSelected(val)}
                            data={amenities}
                            save="value"
                            notFoundText='Nenhuma amenidade cadastrada'
                            placeholder='Selecione um dado'
                            searchPlaceholder="Pesquisar..."
                            dropdownTextStyles={{ color: "#FF6112" }}
                            inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                            closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                            searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                            arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

                        />
                    </View>

                    <View className="">
                        <Text className='text-base mb-1'>Editar Quadra/Campo</Text>
                        <SelectList
                            setSelected={(val: string) => setCourtSelected(val)}
                            onSelect={() => {
                                handleEditCourt(courtSelected)
                            }}
                            data={courts}
                            save="value"
                            notFoundText='Nenhuma quadra cadastrada'
                            placeholder='Selecione um dado'
                            searchPlaceholder="Pesquisar..."
                            dropdownTextStyles={{ color: "#FF6112" }}
                            inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                            closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                            searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                            arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

                        />
                    </View>

                    <View>
                        <View className='p-2'>
                            <TouchableOpacity onPress={handleSubmit(handleUpdateUser)} className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center'>
                                <Text className='text-gray-50'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Salvar'}</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='p-2'>
                            <TouchableOpacity onPress={handleExitApp} className='h-14 w-81 rounded-md bg-red-500 flex items-center justify-center' >
                                <Text className='text-gray-50'>Sair do App</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='p-2'>
                            <TouchableOpacity onPress={handleDeleteAccount} className='h-14 w-81 rounded-md flex items-center justify-center'>
                                <Text className='text-base text-gray-400'>Excluir essa conta</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Modal visible={showDeleteConfirmation} animationType="fade" transparent={true}>
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
                        <View className="bg-white rounded-md p-20 items-center">
                            <Text className=" font-bold text-lg mb-8">Confirmar exclusão da conta?</Text>
                            <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelDelete}>
                                <Text className="text-white">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete} onPressIn={() => navigation.navigate('DeleteAccountEstablishment', {
                                establishmentName: userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.corporateName
                            })}>
                                <Text className="text-white">Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
                        <View className="bg-white rounded-md p-20 items-center">
                            <Text className=" font-bold text-lg mb-8">Sair do App?</Text>
                            <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                                <Text className="text-white">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmExit} onPressIn={() => navigation.navigate('Login')}>
                                <Text className="text-white">Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={editFantasyNameModal} animationType="fade" transparent={true} onRequestClose={closeEditFantasyNameModal}>
                    <View className='h-full w-full justify-center items-center'>
                        <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Insira um novo nome fantasia:</Text>
                                <Controller
                                    name='fantasyName'
                                    control={controlFantasyName}
                                    rules={{
                                        required: true
                                    }}
                                    render={({ field: { onChange } }) => (
                                        <TextInput
                                            defaultValue={fantasyName}
                                            onChangeText={onChange}
                                            className={`p-4 border ${fantasyNameErrors.fantasyName ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                            placeholder='Nome fantasia'
                                            placeholderTextColor="#B8B8B8"
                                        />
                                    )}
                                />
                                {fantasyNameErrors.fantasyName && <Text className='text-red-400 text-sm -pt-[10px]'>{fantasyNameErrors.fantasyName.message}</Text>}
                            </View>

                            <View className="flex flex-row items-center mt-[10px]">
                                <TouchableOpacity
                                    onPress={() => {
                                        closeEditFantasyNameModal()
                                    }}
                                    className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                                    <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSubmitFantasyName(handleUpdateEstablishmentFantasyName)} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                                    <Text className='text-white font-medium text-[14px]'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Confirmar'}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <Modal visible={editAddressModal} animationType='fade' transparent={true} onRequestClose={closeEditAddressModal}>
                    <View className='h-full w-full justify-center items-center'>
                        <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Insira o número do seu CEP:</Text>
                                <Controller
                                    name='cep'
                                    control={controlAddress}
                                    rules={{
                                        required: true
                                    }}
                                    render={({ field: { onChange } }) => (
                                        <MaskInput
                                            className={`p-4 border ${addressErrors.cep ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                            value={cep}
                                            onChangeText={(masked, unmasked) => {
                                                onChange(masked)
                                                setCep(masked)
                                            }}
                                            mask={Masks.ZIP_CODE}
                                            keyboardType='numeric'
                                        />
                                    )}
                                />
                                {addressErrors.cep && <Text className='text-red-400 text-sm -pt-[10px]'>{addressErrors.cep.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Insira o nome da sua rua:</Text>
                                <Controller
                                    name='streetName'
                                    control={controlAddress}
                                    rules={{
                                        required: true
                                    }}
                                    render={({ field: { onChange } }) => (
                                        <TextInput
                                            defaultValue={streetName}
                                            onChangeText={onChange}
                                            className={`p-4 border ${addressErrors.streetName ? "border-red-400" : "border-gray-500"}  rounded-lg h-45`}
                                            placeholder='Nome da rua'
                                            placeholderTextColor="#B8B8B8"
                                        />
                                    )}
                                />
                                {addressErrors.streetName && <Text className='text-red-400 text-sm -pt-[10px]'>{addressErrors.streetName.message}</Text>}
                            </View>

                            <View className="flex flex-row items-center mt-[10px]">
                                <TouchableOpacity
                                    onPress={() => {
                                        closeEditAddressModal()
                                    }}
                                    className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                                    <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSubmitAddress(handleUpdateEstablishmentAddress)} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                                    <Text className='text-white font-medium text-[14px]'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Confirmar'}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <Modal visible={editCNPJModal} animationType='fade' transparent={true} onRequestClose={closeEditCNPJModal}>
                    <View className='h-full w-full justify-center items-center'>
                        <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Seu CNPJ:</Text>
                                <TextInput
                                    className='p-[5px] border border-neutral-400 rounded bg-white'
                                    value={userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data?.attributes.cnpj}
                                    editable={false}
                                />
                            </View>

                            <View className="flex flex-row items-center mt-[10px]">
                                <TouchableOpacity onPress={() => {
                                    closeEditCNPJModal()
                                }} className='h-fit w-full rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                                    <Text className="font-medium text-[14px] text-white">Confirmar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                <Modal visible={editPasswordModal} animationType='fade' transparent={true} onRequestClose={closeEditPasswordModal}>
                    <View className='h-full w-full justify-center items-center'>
                        <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Insira a sua senha atual:</Text>
                                <View className={passwordErrors.currentPassword ? 'flex flex-row items-center justify-between border border-red-400 rounded' : 'flex flex-row items-center justify-between border border-neutral-400 rounded'}>
                                    <Controller
                                        name='currentPassword'
                                        control={controlPassword}
                                        rules={{
                                            required: true,
                                            minLength: 6
                                        }}
                                        render={({ field: { onChange } }) => (
                                            <TextInput
                                                textContentType='password'
                                                secureTextEntry={!showCurrentPassword}
                                                onChangeText={onChange}
                                                className="p-4 flex-1"
                                                placeholder='Senha atual'
                                                placeholderTextColor="#B8B8B8"
                                            />
                                        )}
                                    />
                                    <TouchableOpacity onPress={handleShowCurrentPassword}>
                                        <Image className="h-4 w-4 m-4" source={!showCurrentPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                {passwordErrors.currentPassword && <Text className='text-red-400 text-sm -pt-[10px]'>{passwordErrors.currentPassword.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Insira sua nova senha:</Text>
                                <View className={passwordErrors.password ? 'flex flex-row items-center justify-between border border-red-400 rounded' : 'flex flex-row items-center justify-between border border-neutral-400 rounded'}>
                                    <Controller
                                        name='password'
                                        control={controlPassword}
                                        rules={{
                                            required: true,
                                            minLength: 6
                                        }}
                                        render={({ field: { onChange } }) => (
                                            <TextInput
                                                textContentType='password'
                                                secureTextEntry={!showPassword}
                                                onChangeText={onChange}
                                                className="p-4 flex-1"
                                                placeholder='Nova senha'
                                                placeholderTextColor="#B8B8B8"
                                            />
                                        )}
                                    />
                                    <TouchableOpacity onPress={handleShowPassword}>
                                        <Image className="h-4 w-4 m-4" source={!showPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                {passwordErrors.password && <Text className='text-red-400 text-sm -pt-[10px]'>{passwordErrors.password.message}</Text>}
                            </View>

                            <View className='w-full'>
                                <Text className='text-[14px] font-bold'>Confirme sua nova senha:</Text>
                                <View className={passwordErrors.confirmPassword ? 'flex flex-row items-center justify-between border border-red-400 rounded' : 'flex flex-row items-center justify-between border border-neutral-400 rounded'}>
                                    <Controller
                                        name='confirmPassword'
                                        control={controlPassword}
                                        rules={{
                                            required: true,
                                            minLength: 6
                                        }}
                                        render={({ field: { onChange } }) => (
                                            <TextInput
                                                textContentType='password'
                                                secureTextEntry={!showConfirmedPassword}
                                                onChangeText={onChange}
                                                className="p-4 flex-1"
                                                placeholder='Confirme a nova senha'
                                                placeholderTextColor="#B8B8B8"
                                            />
                                        )}
                                    />
                                    <TouchableOpacity onPress={handleConfirmShowPassword}>
                                        <Image className="h-4 w-4 m-4" source={!showConfirmedPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                {passwordErrors.confirmPassword && <Text className='text-red-400 text-sm -pt-[10px]'>{passwordErrors.confirmPassword.message}</Text>}
                            </View>

                            <View className="flex flex-row items-center mt-[10px]">
                                <TouchableOpacity
                                    onPress={() => {
                                        closeEditPasswordModal()
                                    }}
                                    className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                                    <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleSubmitPassword(handleUpdateUserPassword)} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                                    <Text className='text-white font-medium text-[14px]'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Confirmar'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View className='h-16'></View>
            </ScrollView>
            <View className={`absolute bottom-0 left-0 right-0`}>
                <BottomBlackMenuEstablishment
                    screen="Any"
                    userID={dataUserEstablishment?.establishment.data?.attributes.owner.data.id!}
                    establishmentLogo={dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== undefined || dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url !== null ? HOST_API + dataUserEstablishment?.establishment?.data?.attributes?.logo?.data?.attributes?.url : null}
                    establishmentID={userByEstablishmentData?.usersPermissionsUser.data?.attributes.establishment.data.id!}
                    key={1}
                    paddingTop={10}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    uploadButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#FF6112',
        borderRadius: 15,
        padding: 8,
    },
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    label: {
        color: 'black',
        paddingBottom: 20,
        fontSize: 20
    },
    maskedInput: {
        borderWidth: 2,
        borderRadius: 6,
        width: '80%',
        padding: 12,
        color: 'black',
        fontSize: 20
    }
});
