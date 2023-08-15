import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
	FadeOut,
	FadeIn
} from 'react-native-reanimated';
import CourtCardHome from '../CourtCardHome';

import { useGetNextToCourts } from '../../hooks/useNextToCourts';
import { calculateDistance } from '../../utils/calculateDistance';
import storage from '../../utils/storage';

let userLatitude: number
let userLongitude: number

storage.load<{ latitude: number, longitude: number }>({
	key: 'userGeolocation'
}).then(data => {
	userLatitude = data.latitude
	userLongitude = data.longitude
})

interface HomeBarProps {
	userName: string | undefined
	// photoUser: string | undefined
}

export default function HomeBar({ userName, photoUser }: HomeBarProps) {
	const [expanded, setExpanded] = useState(false);
	const height = useSharedValue('40%');

	useAnimatedReaction(
		() => expanded,
		(value) => {
			height.value = withTiming(value ? '100%' : '40%', { duration: 500 });
		},
		[expanded]
	);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	const { data, error, loading } = useGetNextToCourts()

	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
			<View
				className='flex items-center'>
				<TouchableOpacity className='w-full items-center' onPress={() => { setExpanded((prevState) => !prevState) }}>
					<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
				</TouchableOpacity>
				<Text className='text-white text-lg font-black mt-3'>Olá{userName ? `, ${userName}` : null}!</Text>
			</View>
			<ScrollView className='p-5'>
				{data?.courts.data !== undefined ? data?.courts.data.map((item) => (
					<CourtCardHome
						key={item.id}
						id={item.id}
						// photoUser={photoUser}
						image={item.attributes.photo.data[0].attributes.url}
						name={item.attributes.name}
						distance={calculateDistance(userLatitude, userLongitude, parseFloat(item.attributes.establishment.data.attributes.address.latitude), parseFloat(item.attributes.establishment.data.attributes.address.longitude)).toFixed(0)}
						type={item.attributes.court_type.data.attributes.name}
					/>
				)) : <ActivityIndicator size='small' color='#fff' />}
			</ScrollView>
		</Animated.View>
	)
}