import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useEffect, useState} from "react";

export default function CourtAvailibilityDay({day, children, setAllFalse, clicked, onClick}: CourtAvailibilityDay) {
    const [isClicked, setIsClicked] = useState<boolean>(false)

    function handleClick() {
        setAllFalse();
        setIsClicked(!isClicked);
        onClick(!isClicked);
    }

    useEffect(() => {
        setIsClicked(clicked);
    }, [clicked])

    return (
        <View>
            <View className='w-full flex-row justify-between items-center border-b border-white p-[10px]'>
                <View className='w-[16px] h-[10px]'></View>
                <Text className='text-white text-[12px] font-black leading-[18px]'>{day}</Text>
                <TouchableOpacity onPress={handleClick}>
                    <Image source={clicked ? require('../../assets/open_arrow.png') : require('../../assets/close_arrow.png')} />
                </TouchableOpacity>

            </View>

            {clicked && (
                children
            )}

        </View>

    )
}