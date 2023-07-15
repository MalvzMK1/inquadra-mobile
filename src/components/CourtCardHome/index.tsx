import { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function CourtCardHome(props: CourtCardInfos) {

    const [color, setColor] = useState("white")


    return (
        <View className='flex flex-row w-full gap-x-[14px]'>
            <Image className='w-[40%] h-[85px] rounded-[10px]' source={{ uri: props.image }} />
            <View className='flex flex-row w-full'>
                <View className='w-[50%]'>
                    <Text className='text-[#ff6112] font-black text-[15px]'>{props.name}</Text>
                    <Text className='text-white font-bold text-xs'>{props.type}</Text>
                    <Text className='text-white font-bold text-xs'>{props.distance}Km de distacia</Text>
                </View>
                <AntDesign name="heart" size={20}  color={color} onPress={() => color == "white" ? setColor("red") : setColor("white") } />
            </View>
        </View>
    )
}