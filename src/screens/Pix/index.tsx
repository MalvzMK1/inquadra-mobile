import React, {useEffect, useState} from 'react'
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { payload } from '../../components/pix/payLoadGenerator';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useGetMenuUser } from '../../hooks/useMenuUser';
import { HOST_API } from '@env';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {useCreateCharge} from "../../services/inter";

interface RouteParams extends NativeStackScreenProps<RootStackParamList, 'PixScreen'> { }

export default function PixScreen({ navigation, route }: RouteParams) {
    const { courtName, value, userID } = route.params
    const formattedValue = Number(value).toFixed(2)

    console.log({courtName, value, userID});

    const { data: dataUser, error: errorUser, loading: loadingUser } = useGetMenuUser(route.params.userID)
    const [createCharge, {data: chargeData, loading: chargeLoading, error: chargeError}] = useCreateCharge();
    const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);

    // const payLoad = payload('+5511990216755', courtName, 'Enzo Diogenes do Prado', 'OSASCO', formatedValue.toString())

    const handleCopiarTexto = () => {
        Clipboard.setStringAsync(payLoad);
        Toast.show({
            type: 'success',
            text1: 'Texto copiado',
            text2: 'O texto foi copiado para a área de transferência.',
            position: 'bottom',
            visibilityTime: 2000,
        });
    };

    useEffect(() => {
        if
        (
            dataUser &&
            dataUser.usersPermissionsUser.data &&
            dataUser.usersPermissionsUser.data.attributes.photo.data
        )
            setUserPhotoUri(HOST_API + dataUser.usersPermissionsUser.data.attributes.photo.data.attributes.url)
        else
            setUserPhotoUri(null)

        // --------------

        // createCharge({
        //     variables: {
        //         value: formattedValue,
        //         message: '',
        //         dueDate: '',
        //         debtorName: '',
        //         debtorStreet: '',
        //         debtorUf: '',
        //         debtorCity: '',
        //         debtorCpf: '',
        //         debtorCep: '',
        //         discountDate: ''
        //     }
        // }).then(response => )
    }, [dataUser])

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
                                userPhotoUri ? {uri: userPhotoUri} : require('../../assets/default-user-image.png')
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
                    <QRCode value={payLoad} size={200} />
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