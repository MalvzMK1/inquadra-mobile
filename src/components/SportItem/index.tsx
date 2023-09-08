import { View, Image, Text } from 'react-native';

export default function SportItem(props: SportsCard) {

    return (
        <View className='flex flex-col items-center gap-y-1 w-[85px]'>
            <Image className='w-[30px] h-[30px] ' source={props.image}></Image>
            <Text className='text-xs font-medium'>{props.name}</Text>
        </View>
    )
}