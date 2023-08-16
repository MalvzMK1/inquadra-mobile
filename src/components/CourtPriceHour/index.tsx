import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaskInput, { Masks } from 'react-native-mask-input';
import React, { useState } from "react"

export default function PriceHour() {
    const [startsAt, setStartsAt] = useState("")
    const [endsAt, setEndsAt] = useState("")
    const [price, setPrice] = useState("")
    return (
        <View className='flex-row w-full justify-between items-center mt-[10px]'>
            <View className='flex-row items-center'>
                <View className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center'>
                    <MaskInput
                        className='h-full items-center justify-center'
                        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                        value={startsAt}
                        onChangeText={(masked) => {
                            setStartsAt(masked)
                        }}
                        placeholder='Ex.: 06:00'
                    />
                </View>
                <Text className='text-white text-[14px]'> às </Text>
                <View className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center'>
                    <MaskInput
                        className='h-full items-center justify-center'
                        mask={[/\d/, /\d/, ':', /\d/, /\d/]}
                        value={endsAt}
                        onChangeText={(masked) => {
                            setEndsAt(masked)
                        }}
                        placeholder='Ex.: 07:00'
                    />
                </View>
            </View>

            <View className='flex-row items-center gap-x-[10px]'>
                <View className='h-[32px] w-[86px] bg-white border border-[#FF6112] rounded-[5px] flex items-center justify-center'>
                    <MaskInput
                        className='h-full items-center justify-center'
                        mask={Masks.BRL_CURRENCY}
                        value={price}
                        onChangeText={setPrice}
                        placeholder='Ex.: 250 R$'
                    />
                </View>
                <TouchableOpacity>
                    <Image source={require('../../assets/edit_icon.png')}></Image>
                </TouchableOpacity>
            </View>
        </View>
    )
}