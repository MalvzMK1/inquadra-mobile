import React from 'react'
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { payload } from '../../components/pix/payLoadGenerator';
import { QrC } from 'qrcode-pix';

const payLoad = payload('+5511990216755', 'e o pix?', 'Enzo Diogenes do Prado', 'OSASCO', '1832', '150.00')

export default function PixScreen() {
    const navigation = useNavigation()

    console.log(payLoad)
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

            <View>
                <QRCode value={payLoad} size={200} />
            </View>

           
            
        </View>
    )
}