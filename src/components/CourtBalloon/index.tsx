import { View, Text, Image } from 'react-native';
import { Callout } from 'react-native-maps';
import {NavigationProp, useNavigation} from "@react-navigation/native";

export default function CourtBalloon(props:CourtCardInfos) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();

	return (
		<Callout className='w-36 h-28 flex flex-col items-center justify-center' onPress={() => navigation.navigate('EstablishmentInfo', {
			establishmentID: props.id,
			userPhoto: undefined
		})}>
			<Text className={'h-fit'}>
				<Image source={{ uri: props.image }} style={{height: 69, width: 121, borderRadius: 4}} resizeMode='cover'/>
			</Text>
			<View className='flex-1' >
				<Text className='font-black text-[#FF6112] text-[10px]'>{props.name}</Text>
				<Text className='text-[8px]'>{props.type}</Text>
				<Text className='font-bold text-[8px]'>{props.distance.toFixed(2)}km</Text>
			</View>
		</Callout>
	)
}