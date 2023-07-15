import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import CourtCardHome from '../../components/CourtCardHome';
import NavigationSports from '../../components/NavigationSports';


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

	const [bar, setBar] = useState(false)


	return (
		<View className="flex-1 flex flex-col bg-[#e7e5e0]">
			<View className='w-full h-[8%] bg-[#EBEBEB] shadow-lg'>
				<ScrollView horizontal={true} className='flex shadow-lg'>
					{
						arrayTesteIcons.map((item) => (
							<NavigationSports key={item.id} name={item.name} image={item.image} />
						))
					}
				</ScrollView>
			</View>
			<View className="flex-1 w-full h-full ">
				<MapView className='flex-1 w-full h-full absolute'
					initialRegion={{
						latitude: 37.78825,
						longitude: -122.4324,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}} />
			</View>
			<View
			>
				<View className='flex items-center'>
					<TouchableOpacity className='w-full items-center' onPress={() => setBar((prevState) => !prevState)}>
						<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
					</TouchableOpacity>
					<Text className='text-white text-lg font-black mt-3'>Olá, {userNameExample.toLocaleUpperCase()} !</Text>
				</View>
				<ScrollView className='overflow-hidden'>
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
			</View>
			<BottomNavigationBar />
		</View>
	);

	
}
