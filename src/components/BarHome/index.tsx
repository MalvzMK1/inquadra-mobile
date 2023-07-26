import {useEffect, useRef, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
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
import {NativeStackScreenProps} from "@react-navigation/native-stack";

interface HomeBarProps {
	courts: Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>,
	userName: string | undefined
}

const userNameExample = "Artur"

export default function HomeBar({courts, userName}: HomeBarProps) {
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

	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
			<View
				className='flex items-center'>
				<TouchableOpacity className='w-full items-center' onPress={() => { setExpanded((prevState) => !prevState) }}>
					<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
				</TouchableOpacity>
				<Text className='text-white text-lg font-black mt-3'>Olá{userName ? `, ${userName}` : null}!</Text>
			</View>
			<ScrollView>
				{courts !== undefined ? courts.map((item) => (
					<View className='p-5' key={item.id}>
						<CourtCardHome
							image={item.image}
							name={item.name}
							distance={item.distance}
							type={item.type}
						/>
					</View>
				)) : <ActivityIndicator size='small' color='#fff' />}
			</ScrollView>
		</Animated.View>
	)
}