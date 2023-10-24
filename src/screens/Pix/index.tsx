import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { HOST_API } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateCharge, usePixInfosByTxid } from "../../services/inter";
import { useGetUserById } from "../../hooks/useUserById";
import { useGetSchedulingsDetails } from "../../hooks/useSchedulingDetails";
import getAddress, { APICepResponse } from "../../utils/getAddressByCep";
import { useCreateStrapiPixCharge } from "../../hooks/useCreateStrapiPixCharge";
import { verifyPixStatus } from '../../services/pixCielo';
import { ceil } from 'react-native-reanimated';
import useUpdateUserPaymentPix from '../../hooks/useUpdateUserPaymentPix';
import { useInfoSchedule } from '../../hooks/useInfoSchedule';
import useUpdateScheduleValue from '../../hooks/useUpdateScheduleValue';
import { generateRandomKey } from '../../utils/activationKeyGenerate';
import { useRegisterSchedule } from '../../hooks/useRegisterSchedule';
import useUpdateScheduleDay from '../../hooks/useUpdateScheduleDay';
import { useFocusEffect } from '@react-navigation/native';

interface RouteParams extends NativeStackScreenProps<RootStackParamList, 'PixScreen'> { }

interface IPixInfos {
    txid: string;
    pixCode: string;
}

export default function PixScreen({ navigation, route }: RouteParams) {
    const { courtName, value, userID, scheduleID, QRcodeURL, paymentID } = route.params
    const formattedValue = Number(value).toFixed(2)

    const { data: scheduleData, loading: isScheduleLoaging, error: scheduleError, refetch: scheduleRefetch } = useGetSchedulingsDetails(route.params.scheduleID?.toString() ?? "");
    const { data: userData, loading: isUserDataLoading, error: userDataError, refetch: userRefetch } = useGetUserById(route.params.userID);
    const [createCharge, { data: chargeData, loading: chargeLoading, error: chargeError }] = useCreateCharge();
    const [createStrapiCharge, { data: strapiChargeData, loading: isStrapiChargeLoading, error: strapiChargeError }] = useCreateStrapiPixCharge();
    const [updateScheduleValue, { data: dataScheduleValue, error: errorScheduleValue, loading: loadingScheduleValue }] = useUpdateScheduleValue()
    const [updateUserPaymentPix, { data: dataUpdateUserPaymentPix, loading: loadingUpdateUserPaymentPix, error: errorUpdateUserPaymentPix }] = useUpdateUserPaymentPix()
    const [createSchedule, { data: dataCreateSchedule, error: errorCreateSchedule, loading: loadingCreateSchedule }] = useRegisterSchedule()
    const [updateSchedule, { data: dataUpdateSchedule, error: errorUpdateSchedule, loading: loadingUpdateSchedule }] = useUpdateScheduleDay()
    const schedulePrice = route.params.schedulePrice!
    const scheduleValuePayed = route.params.scheduleValuePayed!

    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<APICepResponse>();
    const [pixInfos, setPixInfos] = useState<IPixInfos | null>(null);
    const [statusPix, setStatusPix] = useState("waiting")
    const valueToPay = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
    const [hasExecuted, setHasExecuted] = useState(false);

    useFocusEffect(() => {
        setHasExecuted(false)
    })


    const handleCopiarTexto = async () => {
        await Clipboard.setStringAsync(QRcodeURL);
        Toast.show({
            type: 'success',
            text1: 'Texto copiado',
            text2: 'O texto foi copiado para a área de transferência.',
            position: 'bottom',
            visibilityTime: 2000,
        });
    };

    useEffect(() => {
        let isMounted = true;

        function checkStatus() {
            verifyPixStatus(paymentID).then((response) => {
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
            if (statusPix === "waiting") {
                setStatusPix("cancelled");
                clearInterval(intervalId);

                if (route.params.screen === "signal") {
                    navigation.navigate('ReservationPaymentSign', {
                        amountToPay: valueToPay,
                        courtAvailabilities: route.params.court_availabilityID!,
                        courtAvailabilityDate: route.params.date!,
                        courtName: courtName,
                        userId: userID,
                        userPhoto: route.params.userPhoto,
                        courtId: route.params.courtId!,
                        courtImage: route.params.courtImage!
                    })
                }else if(route.params.screen === "historic"){
                    navigation.navigate('DescriptionReserve', {
                        scheduleId: route.params.scheduleID!.toString(),
                        userId: courtName
                    })
                }else{
                    navigation.navigate('PaymentScheduleUpdate', {
                        amountToPay: valueToPay,
                        activationKey: null,
                        courtAvailabilities: route.params.court_availabilityID!,
                        courtAvailabilityDate: route.params.newDate!,
                        courtId: route.params.courtId!,
                        courtImage: route.params.courtImage!,
                        courtName:courtName,
                        pricePayed: route.params.pricePayed!,
                        userId:userID,
                        userPhoto: route.params.userPhoto!,
                        scheduleUpdateID: scheduleID?.toString()!
                    })
                }


            }
        }

        const intervalId = setInterval(checkStatus, 2500);
        const timeOutPayment = setInterval(checkTimeOut, 300000);

        return () => {
            isMounted = false;
            clearInterval(timeOutPayment)
        };
    }, []);

    const scheduleValueUpdate = async (value: number) => {
        let validatePayment = value + scheduleValuePayed! >= schedulePrice! ? "payed" : "waiting"
        let valuePayedUpdate = value + scheduleValuePayed!
        let activation_key = value + scheduleValuePayed! >= schedulePrice! ? generateRandomKey(4) : null

        try {
            await updateScheduleValue({
                variables: {
                    payed_status: validatePayment,
                    scheduling_id: scheduleID!,
                    value_payed: valuePayedUpdate,
                    activated: false,
                    activation_key: activation_key
                }
            })
        } catch (error) {
            console.log("Erro na mutação updateValueSchedule", error)
        }
    }


    const createNewSchedule = async () => {
        let isPayed = route.params.isPayed!
        try {
            const create = await createSchedule({
                variables: {
                    title: 'r',
                    court_availability: route.params.court_availabilityID!,
                    date: route.params.date!,
                    pay_day: route.params.pay_day!,
                    value_payed: route.params.value_payed!,
                    owner: userID,
                    users: [userID],
                    activation_key: isPayed ? generateRandomKey(4) : null,
                    service_value: route.params.service_value!,
                    publishedAt: new Date().toISOString()
                }

            });

            return create.data?.createScheduling?.data?.id

        } catch (error) {
            console.error("Erro na mutação createSchedule:", error);
        }
    }

    const updateScheduleDay = async (isPayed: boolean, activationKey: string | null) => {
        const paymentStatus: string = isPayed ? "payed" : "waiting"
        try {
            updateSchedule({
                variables: {
                    availabilityID: route.params.court_availabilityID?.toString()!,
                    newDate: route.params.newDate!,
                    scheduleID: route.params.scheduleID?.toString()!,
                    payedStatus: paymentStatus,
                    newValue: route.params.userMoney!,
                    activationKey: activationKey
                }
            })

        } catch (error) {
            console.log(error)
        }
    }


    useFocusEffect(
        React.useCallback(() => {
            if (route.params.screen === "historic") {
                if (statusPix === "payed") {
                    Toast.show({
                        type: 'success',
                        text1: 'Pagamento',
                        text2: 'Efetuado com sucesso',
                        position: 'bottom',
                        visibilityTime: 2000,
                    });
                    updateUserPaymentPix({
                        variables: { userPaymentPixID: route.params.userPaymentPixID, scheduleID: scheduleID?.toString()! }
                    });

                    scheduleValueUpdate(valueToPay).then(() => {
                        navigation.navigate('InfoReserva', { userId: userID });
                        setStatusPix("waiting");
                    });
                }
            } else if (route.params.screen === "signal") {
                if (!hasExecuted) {
                    if (statusPix === "payed") {
                        createNewSchedule().then((scheduleID) => {
                            setHasExecuted(true);
                            updateUserPaymentPix({
                                variables: {
                                    userPaymentPixID: route.params.userPaymentPixID,
                                    scheduleID: scheduleID?.toString()!
                                }
                            }).then(() => {
                                scheduleValueUpdate(valueToPay).then(() => {
                                    navigation.navigate('InfoReserva', { userId: userID });
                                    setStatusPix("waiting");
                                });
                            });
                        });
                    }
                }
            } else {
                if (statusPix === "payed") {
                    updateScheduleDay(route.params.isPayed!, route.params.randomKey!).then(() => {
                        updateUserPaymentPix({
                            variables: {
                                userPaymentPixID: route.params.userPaymentPixID,
                                scheduleID: route.params.scheduleID!.toString()!
                            }
                        }).then(() => {
                            navigation.navigate('InfoReserva', { userId: userID });
                            setStatusPix("waiting");
                        });
                    });
                }
            }
        }, [statusPix])
    );


    useEffect(() => {
        if (
            userData &&
            userData.usersPermissionsUser.data &&
            userData.usersPermissionsUser.data.attributes.address
        )
            getAddress(userData.usersPermissionsUser.data.attributes.address.cep)
                .then(response => {
                    console.log({ __API_CEP_RESPONSE: response })
                    setUserAddress(response)
                });
    }, [userData])

    useEffect(() => {
        if
            (
            userData &&
            userData.usersPermissionsUser.data &&
            userData.usersPermissionsUser.data.attributes.photo.data
        )
            setUserPhotoUri(HOST_API + userData.usersPermissionsUser.data.attributes.photo.data.attributes.url)
        else
            setUserPhotoUri(null)

        if
            (
            userData &&
            userData.usersPermissionsUser.data &&
            userData.usersPermissionsUser.data.attributes.address &&
            userAddress &&
            scheduleData &&
            scheduleData.scheduling.data &&
            scheduleData.scheduling.data.attributes.court_availability.data &&
            scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data &&
            scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.establishment.data &&
            scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.court_types.data &&
            scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.establishment.data &&
            !pixInfos
        ) {
            const dueDate: string = new Date(scheduleData?.scheduling.data?.attributes.date).toISOString().split('T')[0];
            const courtName: string = scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.court_types.data.map(courtType => courtType.attributes.name).join(', ');
            const establishmentName: string = scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.establishment.data.attributes.corporateName;

            createCharge({
                variables: {
                    value: formattedValue,
                    message: `Aluguel da quadra de ${courtName} do estabelecimento ${establishmentName}`,
                    dueDate,
                    debtorName: userData.usersPermissionsUser.data.attributes.username ?? "",
                    debtorStreet: userAddress.address,
                    debtorUf: userAddress.state,
                    debtorCity: userAddress.city,
                    debtorCpf: userData.usersPermissionsUser.data.attributes.cpf,
                    debtorCep: userAddress.code.split('-').join(''),
                    discountDate: new Date().toISOString().split('T')[0]
                }
            }).then(response => {
                if (response.data) {
                    setPixInfos({
                        txid: response.data.CreateCharge.txid,
                        pixCode: response.data.CreateCharge.pixCopiaECola,
                    })
                    createStrapiCharge({
                        variables: {
                            code: response.data.CreateCharge.pixCopiaECola,
                            txid: response.data.CreateCharge.txid,
                            userID,
                            establishmentID: scheduleData.scheduling.data!.attributes.court_availability.data!.attributes.court.data!.attributes.establishment.data!.id,
                            publishedAt: new Date().toISOString()
                        }
                    }).then(response => {
                        console.log({ STRAPI_RESPONSE_DATA: response.data })
                    })
                }
                if (response.errors)
                    Toast.show({
                        text1: 'Não foi possível gerar o código pix',
                        text2: response.errors.join('\n'),
                        position: 'bottom',
                    })
            })
        }
    }, [userData, userAddress, scheduleData])

    return (
        <View className='h-full w-max bg-white'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.goBack()}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='w-max flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>PIX</Text>
                </View>
                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-max w-max'>
                        <Image
                            source={
                                userPhotoUri ? { uri: userPhotoUri } : require('../../assets/default-user-image.png')
                            }
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='h-max w-max flex items-center justify-start pt-16'>
                <Text className='font-black font text-xl pb-5'>{courtName}</Text>
                {
                    statusPix === "waiting" || statusPix === "payed"
                        ? <View><QRCode value={QRcodeURL} size={200} /></View>
                        : <Image
                            source={
                                require('../../assets/blocked.png')
                            }
                            style={{ width: 200, height: 200 }}
                            borderRadius={100}
                        />
                }
                <Text className='font-black font text-xl pt-2 pb-3'>Pagamento do Sinal</Text>
                <View className='h-14 w-screen bg-gray-300 justify-center items-center '>
                    <Text className='font-black font text-3xl text-gray-600'>R${parseFloat(value).toFixed(2)}</Text>
                </View>
                {
                    statusPix !== "cancelled"
                        ?
                        <TouchableOpacity className='pt-5' onPress={handleCopiarTexto}>
                            <View className='h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center'>
                                <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>
                            </View>
                        </TouchableOpacity>
                        : <TouchableOpacity className='pt-5'>
                            <View className='h-14 w-80 rounded-md bg-gray-500 flex items-center justify-center'>
                                <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>
                            </View>
                        </TouchableOpacity>
                }

                {
                    statusPix === "waiting"
                        ? <Text>Aguardando pagamento...</Text>
                        : statusPix === "payed"
                            ? <Text>Pagamento efetuado com sucesso</Text>
                            : <Text>Pagamento Cancelado</Text>
                }
            </View>
        </View>
    )
}