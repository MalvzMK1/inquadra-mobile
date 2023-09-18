import React, { useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { payload } from '../../components/pix/payLoadGenerator';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { HOST_API } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCreateCharge } from "../../services/inter";
import { useGetUserById } from "../../hooks/useUserById";
import { useGetSchedulingsDetails } from "../../hooks/useSchedulingDetails";
import getAddress, { APICepResponse } from "../../utils/getAddressByCep";
import { useCreateStrapiPixCharge } from "../../hooks/useCreateStrapiPixCharge";

interface RouteParams extends NativeStackScreenProps<RootStackParamList, 'PixScreen'> { }

interface IPixInfos {
    txid: string;
    pixCode: string;
}

export default function PixScreen({ navigation, route }: RouteParams) {
    const { courtName, value, userID, scheduleID } = route.params
    const formattedValue = Number(value).toFixed(2)

    const { data: scheduleData, loading: isScheduleLoaging, error: scheduleError } = useGetSchedulingsDetails(route.params.scheduleID?.toString() ?? "");
    const { data: userData, loading: isUserDataLoading, error: userDataError } = useGetUserById(route.params.userID);
    const [createCharge, { data: chargeData, loading: chargeLoading, error: chargeError }] = useCreateCharge();
    const [createStrapiCharge, { data: strapiChargeData, loading: isStrapiChargeLoading, error: strapiChargeError }] = useCreateStrapiPixCharge();

    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);
    const [userAddress, setUserAddress] = useState<APICepResponse>();
    const [pixInfos, setPixInfos] = useState<IPixInfos | null>(null);

    const handleCopiarTexto = () => {
        if (pixInfos) {
            Clipboard.setStringAsync(pixInfos.pixCode)
                .finally(() => Toast.show({
                    type: 'success',
                    text1: 'Texto copiado',
                    text2: 'O texto foi copiado para a área de transferência.',
                    position: 'bottom',
                    visibilityTime: 2000,
                })
                );

        }
    };

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

            console.log(scheduleData.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.court_types.data)
            console.log({ dueDate, courtName, establishmentName })
            console.log(userAddress.code.split('-').join(''))
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
                        txid: response.data.txid,
                        pixCode: response.data.pixCopiaECola,
                    })
                    createStrapiCharge({
                        variables: {
                            code: response.data.pixCopiaECola,
                            txid: response.data.txid,
                            userID,
                            establishmentID:
                                scheduleData.scheduling.data?.attributes.court_availability.data?.attributes.court.data?.attributes.establishment.data?.id ?? ""
                        }
                    }).then(response => {
                        console.log(response.data)
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

    useEffect(() => {
        if (pixInfos) {

        }
    }, [pixInfos])

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
                <View>
                    {/*<QRCode value={payLoad} size={200} />*/}
                </View>
                <Text className='font-black font text-xl pt-2 pb-3'>Pagamento do Sinal</Text>
                <View className='h-14 w-screen bg-gray-300 justify-center items-center '>
                    <Text className='font-black font text-3xl text-gray-600'>R${parseFloat(value).toFixed(2)}</Text>
                </View>
                <TouchableOpacity className='pt-5' onPress={handleCopiarTexto}>
                    <View className='h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center'>
                        <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}