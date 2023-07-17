import React from 'react'
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';


export default function InfoReserva() {
    const navigation = useNavigation()
    return(
        <View className='h-max w-max'>
            <View className=' h-11 w-max  bg-slate-400'></View>

            <View className=' h-16 w-max  bg-slate-400 flex-row item-center justify-between px-5'>


                <View className='h-max w-max flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('Login')}>
                        <TextInput.Icon icon={'chevron-left'} size={25} />
                    </TouchableOpacity>	
                </View>
                	


                <View className='h-max w-max  flex item-center justify-center'>
                    <Text className='text-lg font-bold'>HISTÓRICO DE RESERVAS</Text>
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
        </View>
    )

}