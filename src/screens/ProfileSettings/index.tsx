import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import { TextInputMask } from 'react-native-masked-text';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetUserById } from "../../hooks/useUserById";
import useUpdateUser from "../../hooks/useUpdateUser";
import useUpdatePaymentCardInformations from "../../hooks/useUpdatePaymentCardInformations";
import { transformCardDueDateToParsedString } from "../../utils/transformCardDueDateToParsedString";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useCountries from "../../hooks/useCountries";
import { HOST_API } from "@env";
import useDeleteUser from "../../hooks/useDeleteUser";
import axios from 'axios';
import { RootStackParamList } from "../../types/RootStack";

interface IFormData {
    name: string
    email: string
    phoneNumber: string
    cpf: string
}

interface IPaymentCardFormData {
    dueDate: string
    cvv: string
    country: string
}

const formSchema = z.object({
    name: z.string()
        .nonempty('Esse campo não pode estar vazio'),
    email: z.string()
        .nonempty('Esse campo não pode estar vazio')
        .max(256, 'Insira um E-mail válido')
        .includes('@', {
            message: 'Insira um E-mail válido'
        }),
    phoneNumber: z.string()
        .nonempty('Esse campo não pode estar vazio'),
    cpf: z.string()
        .nonempty('Esse campo não pode estar vazio'),
})

const paymentCardFormSchema = z.object({
    dueDate: z.string()
        .nonempty('Esse campo não pode estar vazio'),
    cvv: z.string()
        .nonempty('Esse campo não pode estar vazio')
        .min(3, 'Insira um CVV válido')
        .max(3, 'Insira um CVV válido'),
    country: z.string()
        .nonempty('Esse campo não pode estar vazio'),
})

type UserConfigurationProps = Omit<User, 'cep' | 'latitude' | 'longitude' | 'streetName'> & { paymentCardInfos: { dueDate: string, cvv: string, country: { id: string, name: string } } }

export default function ProfileSettings({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ProfileSettings'>) {
    const [userInfos, setUserInfos] = useState<UserConfigurationProps>()
    const [showCard, setShowCard] = useState(false);
    const [showCameraIcon, setShowCameraIcon] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [countriesArray, setCountriesArray] = useState<Array<{ key: string, value: string }>>([])
    const [deleteAccountLoading, setDeleteAccountLoading] = useState<boolean>(false);
    const [uploadedImageID, setUploadedImageId] = useState('');

    const { loading, error, data } = useGetUserById(route.params.userID);
    const { data: countriesData, loading: countriesLoading, error: countriesError } = useCountries();
    const [updateUser, { data: updatedUserData, loading: isUpdateLoading, error: updateUserError }] = useUpdateUser();
    const [updatePaymentCardInformations, { data: updatedPaymentCardInformations, loading: isUpdatePaymentCardLoading }] = useUpdatePaymentCardInformations()
    const [deleteUser] = useDeleteUser();

    useEffect(() => {
        let newCountriesArray: Array<{ key: string, value: string, img: string }> = [];
        if (!countriesLoading && countriesData) {
            newCountriesArray = countriesData.countries.data.map(country => {
                return {
                    key: country.id,
                    value: country.attributes.name,
                    img: HOST_API + country.attributes.flag
                }
            })
        }

        setCountriesArray(prevState => [...prevState, ...newCountriesArray])
    }, [countriesData, countriesLoading])

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm<IFormData>({
        resolver: zodResolver(formSchema),
    })

    const {
        control: paymentCardControl,
        handleSubmit: handlePaymentCardSubmit,
        formState: { errors: paymentCardErrors },
        getValues: getPaymentCardValues,
        setValue: setPaymentCardValue
    } = useForm<IPaymentCardFormData>({
        resolver: zodResolver(paymentCardFormSchema)
    })

    const handleCardClick = () => {
        setShowCard(!showCard);
        setShowCameraIcon(false);
    };

    const updateCardInfos = (data: IPaymentCardFormData) => {
        const paymentCardInfos = data

        if (userInfos && paymentCardInfos) {
            updatePaymentCardInformations({
                variables: {
                    user_id: userInfos.id,
                    card_cvv: Number(paymentCardInfos.cvv),
                    card_due_date: transformCardDueDateToParsedString(paymentCardInfos.dueDate),
                    country_flag_id: data.country.toString()
                }
            }).then(data => {
                console.log(data.data)
                setShowCard(false)
            }).catch(error => console.error(error))
        }
        // setShowCard(false);
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirmation(true);
    };
    console.log("dataaaaaaa" + data?.usersPermissionsUser.data.attributes.username)


    const handleConfirmDelete = () => {
        if (userInfos) {
            // TODO: IMPLEMENT ACCOUNT DELETE
            setDeleteAccountLoading(true);

            deleteUser({
                variables: {
                    user_id: userInfos.id
                }
            }).then(() => navigation.navigate('DeleteAccountSuccess'))
                .catch((err) => alert(JSON.stringify(err)))
                .finally(() => setDeleteAccountLoading(false))
        }
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

    const [profilePicture, setProfilePicture] = useState<string | undefined>(route.params.userPhoto);
    const [isLoading, setIsLoading] = useState(false)

    const handleProfilePictureUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Desculpe, precisamos da permissão para acessar a galeria!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setProfilePicture(result.uri);
                await uploadImage(result.uri);
            }
        } catch (error) {
            console.log('Erro ao carregar a imagem: ', error);
        }
    };

    const uploadImage = async (selectedImageUri: string) => {
        setIsLoading(true);
        const apiUrl = 'https://inquadra-api-uat.qodeless.io';

        const formData = new FormData();
        formData.append('files', {
            uri: selectedImageUri,
            name: 'image.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(`${apiUrl}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadedImageId(response.data[0].id);

            console.log('Imagem enviada com sucesso!', response.data);

            setIsLoading(false);

            return uploadedImageID;
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            setIsLoading(false);
            return "Deu erro";
        }
    };



    function updateUserInfos(data: IFormData): void {
        console.log(userInfos)
        if (userInfos)
            updateUser({
                variables: {
                    user_id: userInfos.id,
                    email: data.email,
                    photo: uploadedImageID,
                    cpf: data.cpf,
                    phone_number: data.phoneNumber,
                    username: data.name,
                }
            }).then(console.log)
                .catch(console.error)
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
                paymentCardInfos: {
                    dueDate: data.usersPermissionsUser.data.attributes.paymentCardInformations ? data.usersPermissionsUser.data.attributes.paymentCardInformations.dueDate : '',
                    cvv: data.usersPermissionsUser.data.attributes.paymentCardInformations ? data.usersPermissionsUser.data.attributes.paymentCardInformations.cvv.toString() : '',
                    country: {
                        id: data.usersPermissionsUser.data.attributes.paymentCardInformations.country.data ? data.usersPermissionsUser.data.attributes.paymentCardInformations.country.data.id : '',
                        value: data.usersPermissionsUser.data.attributes.paymentCardInformations.country.data ? data.usersPermissionsUser.data.attributes.paymentCardInformations.country.data.attributes.name : ''
                    }
                },
            };
        }

        return newUserInfos;
    }

    // function defineDefaultFieldValues(userData: Omit<User, 'id' | 'cep' | 'latitude' | 'longitude' | 'streetName'> & { paymentCardInfos: { dueDate: string, cvv: string } } | undefined): void {
    //     if (userData) {

    //         console.log("name: xxxxxx" + userData?.username)

    //         setValue('name', userData.username)
    //         setValue('email', userData.email)
    //         setValue('phoneNumber', userData.phoneNumber)
    //         setValue('cpf', userData.cpf)
    //         setPaymentCardValue('cvv', userData.paymentCardInfos.cvv)
    //         setPaymentCardValue('dueDate', userData.paymentCardInfos.dueDate)
    //     }
    //     console.log("name: xxxxxx 2" + userData?.username)

    // }

    useEffect(() => {

        loadInformations().then((data) => {
            // console.log({ data })
            setUserInfos(data)

        });
        if (data) {
            setValue('name', data.usersPermissionsUser.data.attributes.username);
            setValue('email', data.usersPermissionsUser.data.attributes.email);
            setValue('phoneNumber', data.usersPermissionsUser.data.attributes.phoneNumber);
            setValue('cpf', data.usersPermissionsUser.data.attributes.cpf);
            setPaymentCardValue('cvv', data.usersPermissionsUser?.data?.attributes?.paymentCardInformations?.cvv?.toString() ?? "");
            setPaymentCardValue('dueDate', data.usersPermissionsUser?.data.attributes?.paymentCardInformations?.dueDate ?? "");
        }
    }, [loading])

    return (
        <View className="flex-1 bg-white h-full">
            {
                loading ?
                    <View className='flex-1'>
                        <ActivityIndicator size='large' color='#F5620F' />
                    </View> :
                    <ScrollView className="flex-grow p-1">
                        {/*{(console.log({data}))}*/}
                        <TouchableOpacity className="items-center mt-8">
                            <View style={styles.container}>
                                {profilePicture ? (
                                    <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
                                ) : (
                                    <Ionicons name="person-circle-outline" size={100} color="#bbb" />
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
                                    name='name'
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <TextInput
                                            value={getValues('name') ?? ""}
                                            onChangeText={onChange}
                                            className={errors.name ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
                                            placeholder='Ex.: João'
                                        />
                                    )}
                                />
                                {errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}
                            </View>
                            <View>
                                <Text className="text-base">E-mail</Text>
                                <Controller
                                    name='email'
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <TextInput
                                            value={getValues('email') ?? ""}
                                            onChangeText={onChange}
                                            className={errors.email ? 'p-4 border border-red-400 rounded' : 'p-4 border border-neutral-400 rounded'}
                                            placeholder='email@email.com'
                                            maxLength={256}
                                        />
                                    )}
                                />
                                {errors.email && <Text className='text-red-400 text-sm'>{errors.email.message}</Text>}
                            </View>
                            <View>
                                <Text className="text-base">Telefone</Text>
                                <Controller
                                    name='phoneNumber'
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <MaskInput
                                            className='p-4 border border-gray-500 rounded-md h-45'
                                            placeholder='Ex: (00) 00000-0000'
                                            value={getValues('phoneNumber')}
                                            onChangeText={onChange}
                                            mask={Masks.BRL_PHONE}
                                            maxLength={15}
                                        />
                                    )}
                                />
                                {errors.phoneNumber && <Text className='text-red-400 text-sm'>{errors.phoneNumber.message}</Text>}
                            </View>
                            <View>
                                <Text className="text-base">CPF</Text>
                                <Controller
                                    name='cpf'
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <MaskInput
                                            className='p-4 border border-gray-500 rounded-md h-45'
                                            placeholder='Ex: 000.000.000-00'
                                            value={getValues('cpf') ?? ""}
                                            onChangeText={onChange}
                                            mask={Masks.BRL_CPF}
                                            maxLength={14}
                                        />
                                    )}
                                />
                                {errors.cpf && <Text className='text-red-400 text-sm'>{errors.cpf.message}</Text>}
                            </View>
                            <TouchableOpacity onPress={handleCardClick}>
                                <Text className="text-base">Dados Cartão</Text>
                                <View className="h-30 border border-gray-500 rounded-md">
                                    <View className="flex-row justify-center items-center m-2">
                                        <FontAwesome name="credit-card-alt" size={24} color="#FF6112" />
                                        <Text className="flex-1 text-base text-right mb-0">
                                            {showCard ? <FontAwesome name="camera" size={24} color="#FF6112" /> : 'Adicionar Cartão'}
                                        </Text>
                                        <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            {showCard && (
                                <View className="border border-gray-500 p-4 mt-10">
                                    <View className="flex-row justify-between">
                                        <View className="flex-1 mr-5">
                                            <Text className="text-base text-[#FF6112]">Data venc.</Text>
                                            <Controller
                                                name='dueDate'
                                                control={paymentCardControl}
                                                render={({ field: { onChange } }) => (
                                                    <TextInputMask
                                                        value={getPaymentCardValues('dueDate') ?? ""}
                                                        className={`p-3 border ${paymentCardErrors.dueDate ? "border-red-400" : "border-gray-500"} rounded-md h-18`}
                                                        type={'datetime'}
                                                        options={{
                                                            format: 'MM/YY',
                                                        }}
                                                        onChangeText={onChange}
                                                        placeholder="MM/YY"
                                                        keyboardType="numeric"
                                                    />
                                                )}
                                            />
                                            {paymentCardErrors.dueDate && <Text className='text-red-400 text-sm'>{paymentCardErrors.dueDate.message}</Text>}
                                        </View>
                                        <View className="flex-1 ml-5">
                                            <Text className="text-base text-[#FF6112]">CVV</Text>
                                            <Controller
                                                name='cvv'
                                                control={paymentCardControl}
                                                render={({ field: { onChange } }) => (
                                                    <TextInput
                                                        value={getPaymentCardValues('cvv') ?? ""}
                                                        className={`p-3 border ${paymentCardErrors.cvv ? "border-red-400" : "border-gray-500"} rounded-md h-18`}
                                                        onChangeText={onChange}
                                                        placeholder="CVV"
                                                        keyboardType="numeric"
                                                        maxLength={4}
                                                        secureTextEntry
                                                    />
                                                )}
                                            />
                                            {paymentCardErrors.cvv && <Text className='text-red-400 text-sm'>{paymentCardErrors.cvv.message}</Text>}
                                        </View>
                                    </View>
                                    <View>
                                        <Text className='text-base text-[#FF6112]'>País</Text>
                                        <View className='flex flex-row items-center' >

                                            <View style={{ width: '100%' }}>
                                                <Controller
                                                    name='country'
                                                    control={paymentCardControl}
                                                    render={({ field: { onChange } }) => (
                                                        <SelectList
                                                            setSelected={(val: string) => {
                                                                onChange(val)
                                                            }}
                                                            defaultOption={{ key: userInfos?.paymentCardInfos.country.id, value: userInfos?.paymentCardInfos.country.name }}
                                                            data={countriesArray}
                                                            save='key'
                                                            placeholder='Selecione um país...'
                                                            searchPlaceholder='Pesquisar...'
                                                        />
                                                    )}
                                                />
                                                {paymentCardErrors.country && <Text className='text-red-400 text-sm'>{paymentCardErrors.country.message}</Text>}
                                            </View>
                                        </View>
                                    </View>

                                    <View className="p-2 justify-center items-center">
                                        <TouchableOpacity onPress={handlePaymentCardSubmit(updateCardInfos)} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
                                            <Text className="text-white">Salvar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View>
                                <View className='p-2'>
                                    <TouchableOpacity onPress={handleSubmit(updateUserInfos)} className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' >
                                        <Text className='text-gray-50'>Salvar</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className='p-2'>
                                    <TouchableOpacity onPress={handleExitApp} className='h-14 w-81 rounded-md bg-red-500 flex flex-row items-center justify-between px-1'>
                                        <Text className='text-gray-50 text-center flex-grow ml-6'>Sair do App</Text>
                                        <Ionicons name="exit-outline" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <View className='p-2'>
                                    <TouchableOpacity onPress={handleDeleteAccount} className=' flex items-center justify-center'>
                                        <Text className='text-gray-400 underline'>Excluir essa conta</Text>
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
                                    <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete}>
                                        <Text className="text-white">{deleteAccountLoading ? <ActivityIndicator size={'small'} color={'#F5620F'} /> : 'Confirmar'}</Text>
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
                    </ScrollView>
            }
        </View>
    );
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
