import { View, Text, Image } from 'react-native';
import { Callout } from 'react-native-maps';

export default function CourtBallon(props:CourtCardInfos) {
    
    return (
        <Callout className='w-36 h-28 flex flex-col items-center justify-center'>
            <Image className=' h-9 w-9' source={{ uri: props.image }}/>
            <View className=''>
                <Text className='font-black text-[#FF6112] text-[10px]'>{props.name}</Text>
                <Text className='text-[8px]'>{props.type}</Text>
                <Text className='font-bold text-[8px]'>{props.distance.toFixed(2)}Km de Distancia</Text>
            </View>
        </Callout>
    )
}