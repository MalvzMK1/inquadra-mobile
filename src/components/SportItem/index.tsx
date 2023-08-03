import { View, Image, Text } from 'react-native';

export default function SportItem(props: SportsCard) {



    return (
        <View className='flex flex-col items-center justify-around px-7 '>
            <Image className='w-[30px] h-[30px]' source={props.image}></Image>
            <Text className='text-xs font-medium'>{props.name}</Text>
        </View>
    )
}