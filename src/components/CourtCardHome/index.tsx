import { useState } from 'react';
import { View, Image, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {NavigationProp, useNavigation} from '@react-navigation/native';

export default function CourtCardHome(props: CourtCardInfos) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const [color, setColor] = useState("white")

	return (
		<TouchableOpacity onPress={() => navigation.navigate('EstablishmentInfo', {
			courtID: props.id,
			userPhoto: props.image
		})}>
			<View className='flex flex-row flex-1 gap-x-[14px] mb-5'>
				{/*<TouchableOpacity className='w-12 h-22 rounded-[10px] bg-red-500' onPress={() => navigation.navigate('CourtAvailibilityInfo', {*/}
				{/*	courtId: props.id*/}
				{/*})}>*/}
				{/*	<Image className='w-inherit h-inherit rounded-[10px]' source={{ uri: props.image }} />*/}
				<Image className='w-[40%] h-[85px] rounded-[10px]' source={{ uri: props.image }} />
				{/*</TouchableOpacity>*/}
				<View className='flex flex-row flex-1'>
					<View className='flex-1'>
						<Text className='text-[#ff6112] font-black text-[15px]'>{props.name}</Text>
						<Text className='text-white font-bold text-xs'>{props.type}</Text>
						<Text className='text-white font-bold text-xs'>{props.distance}Km de distacia</Text>
					</View>
					<AntDesign name="heart" size={20} color={color} onPress={() => color == "white" ? setColor("red") : setColor("white")} />
				</View>
			</View>
		</TouchableOpacity>
	)
}