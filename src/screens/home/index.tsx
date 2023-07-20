import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
} from 'react-native-reanimated';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import CourtCardHome from '../../components/CourtCardHome';
import NavigationSports from '../../components/NavigationSports';
import BarHome from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import PointerMap from '../../assets/pointerMap.png';
// import React, { useState } from 'react';
// import { TouchableOpacity, View, Text } from 'react-native';
// } from 'react-native-reanimated';

const arrayTesteIcons = [
	{
		id: 1,
		name: "teste",
		image: "https://images.vexels.com/media/users/3/309754/isolated/preview/2e7b26647fefc85ca7dcd042d9592f2a-cone-de-esporte-de-bola-de-futebol.png"
	},
]

type Props = {
	menuBurguer: boolean;
};

const ArrayLocations = [
	{
		latitude: 37.78825,
		longitude: -122.4324,
		nome: "quadra Legal",
		Image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		type: "quadra amadora",
		distance: 4.5
	},
	{
		latitude: -29.1354,
		longitude: 69.0102,
		nome: "quadra daora",
		type: "quadra amadora",
		Image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		distance: 4.5
	},
	{
		latitude: 66.2539,
		longitude:  -167.8774,
		nome: "quadra Legal",
		type: "quadra amadora",
		Image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		distance: 4.5
	},
	{
		latitude: -44.9763,
		longitude: -102.6039,
		nome: "quadra daora",
		type: "quadra amadora",
		Image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		distance: 4.5

	},
	{
		latitude: -76.5344,
		longitude: -46.7475,
		nome: "quadra Legal",
		type: "quadra amadora",
		Image: "https://static.sportit.com.br/public/sportit/imagens/produtos/quadra-poliesportiva-piso-modular-externo-m2-2921.jpg",
		distance: 4.5
	}
]

const arrayTeste = [
	{
		id: 1,
		name: 'Name',
		image: '',
		distance: 2.5,
		type: ''
	},
	{
		id: 2,
		name: 'Name',
		image: '',
		distance: 2.5,
		type: ''
	},
	{
		id: 3,
		name: 'Name',
		image: '',
		distance: 5,
		type: ''
	},
]

export default function Home({ menuBurguer }: Props) {

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
			{isDisabled && !menuBurguer && <SportsMenu />}
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
					provider={PROVIDER_GOOGLE}
					loadingEnabled
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
					<Text className='text-white text-lg font-black mt-3'>Olá, !</Text>
				</View>
			</Animated.View>
				{/* FECHAR O SCROLLVIEW */}
				<ScrollView>
					{
						arrayTeste.map((item) => (
							<View className='p-5' key={item.id}>
								<CourtCardHome
									image={item.image}
									name={item.name}
									distance={item.distance}
									type={item.type}
					      />
									{/*pageNavigation='EstablishmentInfo'*/}
							</View>)
						)
					}
					<MapView>
					{
						ArrayLocations.map((item) => (
							<Marker
								coordinate={{
									latitude: item.latitude,
									longitude: item.longitude,
								}}
								icon={PointerMap}
								title='test'
								description='test'
							>
								<CourtBallon
									name={item.nome}
									distance={item.distance}
									image={item.Image}
									type={item.type}
								/>
							</Marker>
						))
					}
					</MapView>
				</ScrollView>
				{!isDisabled && (
					<TouchableOpacity className={`absolute left-3 top-3`} onPress={() => setIsDisabled((prevState) => !prevState)}>
						<AntDesign name="left" size={30} color="black" />
					</TouchableOpacity>
				)}
				{menuBurguer && <FilterComponent />}
			</View>
			// {isDisabled && <BarHome />}
			// <BottomNavigationBar
			// isDisabled={isDisabled}
			// buttonOneNavigation='ProfileSettings'
			// buttonTwoNavigation='FavoriteCourts'
			// buttonThreeNavigation=''
			// buttonFourNavigation=''
			// />
		// </View>
	);
}
