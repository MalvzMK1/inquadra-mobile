import React from 'react'
import { View, Text, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { payload } from '../../components/pix/payLoadGenerator';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';



interface RouteParams {
    courtName: string;
    value: number
  }



export default function PixScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { courtName, value } = route.params as RouteParams
    const formatedValue = value.toFixed(2)

    const payLoad = payload('+5511990216755', courtName, 'Enzo Diogenes do Prado', 'OSASCO', formatedValue.toString())
    
    const handleCopiarTexto = () => {
        Clipboard.setStringAsync(payLoad);
        Toast.show({
            type: 'success',
            text1: 'Texto copiado',
            text2: 'O texto foi copiado para a área de transferência.',
            position: 'bottom',
            visibilityTime: 2000, // tempo em milissegundos que a mensagem ficará visível
          });
      };

    return (
        <View className='h-full w-max bg-white'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('Login')}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='w-max flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>PIX</Text>
                </View>
                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-max w-max'>
                        <Image
                            source={{ uri: 'https://i1.sndcdn.com/artworks-z2IyrLsaAE9AmeIg-3bUswQ-t500x500.jpg' }}
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
                    <Text className='font-black font text-3xl text-gray-600'>R${value}</Text>
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