import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
} from 'react-native-reanimated';
import MapView from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import CourtCardHome from '../../components/CourtCardHome';
import NavigationSports from '../../components/NavigationSports';
// import React, { useState } from 'react';
// import { TouchableOpacity, View, Text } from 'react-native';
// } from 'react-native-reanimated';

const arrayTesteIcons = [
	{
		id: 1,
		name: "teste",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 2,
		name: "teste2",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 3,
		name: "teste3",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 4,
		name: "teste",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 5,
		name: "teste2",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		id: 6,
		name: "teste3",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
]
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

export default function Home() {

	const [isDisabled, setIsDisabled] = useState(false);
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
		<View className="flex-1 flex flex-col">
			<View className={`flex w-full justify-center items-center h-[8%] ${isDisabled ? "hidden" : ""}`}>
				<ScrollView horizontal={true}>
					{
						expanded ?
							<Text className='mt-4 font-black text-lg'>
								{`PRÓXIMO A VOCÊ: ${arrayTesteIcons[0].name.toLocaleUpperCase()}`}
							</Text>
							:
							arrayTesteIcons.map((item) => (
								<NavigationSports key={item.id} name={item.name} image={item.image} />
							))

					}
				</ScrollView>
			</View>
			<View className='flex-1'>
				<MapView
					className='w-screen h-screen flex'
					onPress={() => setIsDisabled(true)}
					showsCompass={false}
					initialRegion={{
						latitude: -23.550520,
						longitude: -46.633308,
						latitudeDelta: 0.004,
						longitudeDelta: 0.004,
					}}
				/>
				<TouchableOpacity className={`absolute left-3 top-3 ${!isDisabled ? "hidden" : ""}`} onPress={() => setIsDisabled((prevState) => !prevState)}>
					<AntDesign name="left" size={30} color="black" />
				</TouchableOpacity>
			</View>
			<Animated.View className={`${isDisabled ? "hidden" : ""}`} style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
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
			<BottomNavigationBar isDisabled={isDisabled} />
		</View>
	);
}
