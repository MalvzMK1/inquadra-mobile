import { View, Image, Text } from 'react-native';

export default function CourtCardHome(props: CourtCardInfos) {
    return (
        <View className='flex flex-row w-full gap-x-[14px]'>
            <Image className='w-[40%] h-[85px] rounded-[10px]' source={{ uri: props.image }} />
            <View className='w-full'>
                <Text className='text-[#ff6112] font-black text-[15px]'>{props.name}</Text>
                <Text className='text-white font-bold text-xs'>{props.type}</Text>
                <Text className='text-white font-bold text-xs'>{props.distance}Km de distacia</Text>
            </View>
        </View>
    )
}