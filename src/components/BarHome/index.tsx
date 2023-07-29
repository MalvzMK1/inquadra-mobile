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
import useGetNextToCourts from "../../hooks/useNextToCourts";
import { useNavigation } from '@react-navigation/native';

interface HomeBarProps {
	courts: Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>
}

const userNameExample = "Artur"

export default function HomeBar({ courts }: HomeBarProps) {

	const [expanded, setExpanded] = useState(false);
	const height = useSharedValue('40%');

	const navigation = useNavigation()

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

	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
			<View
				className='flex items-center'>
				<TouchableOpacity className='w-full items-center' onPress={() => { setExpanded((prevState) => !prevState) }}>
					<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
				</TouchableOpacity>
				<Text className='text-white text-lg font-black mt-3'>Olá, {userNameExample.toLocaleUpperCase()} !</Text>
			</View>
			<ScrollView>
				{courts !== undefined ? courts.map((item) => (
					<TouchableOpacity key={item.id} onPress={(event) => {
						event.persist()
						navigation.navigate("EstablishmentInfo", {establishmentInfo: item.id})
					}}>
						<View className='p-5'>
							<CourtCardHome
								image={item.image}
								name={item.name}
								distance={item.distance}
								type={item.type}
							/>
						</View>
					</TouchableOpacity>
				)) : <ActivityIndicator size='small' color='#fff' />}
			</ScrollView>
		</Animated.View>
	)
}