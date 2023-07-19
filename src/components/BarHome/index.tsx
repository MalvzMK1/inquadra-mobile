import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
	FadeOut,
	FadeIn
} from 'react-native-reanimated';
import CourtCardHome from '../CourtCardHome';

const arrayTeste = [
	{
		id: 1,
		image: "https://www.elasta.com.br/wp-content/uploads/2020/11/Quadras-Poliesportivas-1024x526.jpg",
		type: "Quadra de Basquete Profissional",
		name: "Quadra daora",
		distance: 5.3
	},
	{
		id: 2,
		image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		type: "Quadra amadora de Basquete",
		name: "Quadra legal",
		distance: 3.3
	},
	{
		id: 3,
		image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		type: "Quadra amadora de Basquete",
		name: "Quadra legal",
		distance: 3.3
	}
]

const userNameExample = "Artur"

export default function BarHome() {

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
				<Text className='text-white text-lg font-black mt-3'>Olá, {userNameExample.toLocaleUpperCase()} !</Text>
			</View>
			<ScrollView>
				{arrayTeste.map((item) => (
					<View className='p-5' key={item.id}>
						<CourtCardHome
							image={item.image}
							name={item.name}
							distance={item.distance}
							type={item.type}
						/>
					</View>
				))}
			</ScrollView>
		</Animated.View>
	)
}