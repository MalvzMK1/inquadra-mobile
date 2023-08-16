import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SetCourtAvailibility from '../../components/SetCourtAvailibility';

export default function CourtAvailibilityDay(props: CourtAvailibilityDay) {
    return (
        <View>
        <View className='w-full flex-row justify-between items-center border-b border-white p-[10px]'>
            <View className='w-[16px] h-[10px]'></View>
            <Text className='text-white text-[12px] font-black leading-[18px]'>{props.day}</Text>
            <TouchableOpacity onPress={() => {
                props.setAllFalse()
                props.setter(!props.buttonBoolean)
            }}>
                <Image source={props.buttonBoolean ? require('../../assets/open_arrow.png') : require('../../assets/close_arrow.png')} />
            </TouchableOpacity>

        </View>

            {props.buttonBoolean && (
                <SetCourtAvailibility></SetCourtAvailibility>
            )}

        </View>

    )
}