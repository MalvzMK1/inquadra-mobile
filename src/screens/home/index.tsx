import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import CourtCardHome from '../../components/CourtCardHome';
import NavigationSports from '../../components/NavigationSports';
import Animated, { FadeInDown } from 'react-native-reanimated';


const arrayTesteIcons = [
	{
		name: "teste",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
		name: "teste2",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
	{
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

	// const enteringKeyFrame = new Keyframe({
	// 	0:{
	// 		height: "40%"
	// 	},
	// 	100:{
	// 		height: 100%
	// 	}
	// })

	const [bar, setBar] = useState(false)
	const AnimatedView = Animated.createAnimatedComponent(View);

	return (
		<View className="flex-1 flex flex-col">
			<View className='w-full h-[8%] bg-[#EBEBEB]'>
				<ScrollView horizontal={true} className='flex'>
					{
						arrayTesteIcons.map((item) => (
							<NavigationSports name={item.name} image={item.image} />
						))
					}
				</ScrollView>
			</View>
			<View className="flex-1"></View>
			<AnimatedView
				className={`w-full h-${bar ? "full" : "2/5"} bg-[#292929] rounded-t-3xl flex flex-col`}
				entering={FadeInDown.duration(600)}
			>
				<View className='flex items-center'>
					<TouchableOpacity className='w-full items-center' onPress={() => setBar((prevState) => !prevState)}>
						<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
					</TouchableOpacity>
					<Text className='text-white text-lg font-black mt-3'>Olá, {userNameExample.toLocaleUpperCase()} !</Text>
				</View>
				<ScrollView className='px-5'>
					{
						arrayTeste.map((item) => (
							<View className='flex p-5' key={item.id}>
								<CourtCardHome
									image={item.image}
									name={item.name}
									distance={item.distance}
									type={item.type}
								/>
							</View>
						))
					}
				</ScrollView>
			</AnimatedView>

			<BottomNavigationBar />
		</View>
	);
}
