import { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import { View, TouchableOpacity, Image, Text, ImageBackground } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import BarHome from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import pointerMap from '../../assets/pointerMap.png';


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

export default function Home({ menuBurguer }: Props) {

	const [isDisabled, setIsDisabled] = useState(true);

	return (
		<View className="flex-1 flex flex-col">
			{isDisabled && !menuBurguer && <SportsMenu />}
			<View className='flex-1'>
				<MapView
					provider={PROVIDER_GOOGLE}
					loadingEnabled
					className='w-screen h-screen flex'
					onPress={() => setIsDisabled(false)}
					showsCompass={false}
					initialRegion={{
						latitude: 37.78825,
						longitude: -122.4324,
						latitudeDelta: 0.004,
						longitudeDelta: 0.004,
					}}
				>
					{
						ArrayLocations.map((item) => (
							<Marker
								coordinate={{
									latitude: item.latitude,
									longitude: item.longitude,
								}}
								icon={pointerMap}
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
				{!isDisabled && (
					<TouchableOpacity className={`absolute left-3 top-3`} onPress={() => setIsDisabled((prevState) => !prevState)}>
						<AntDesign name="left" size={30} color="black" />
					</TouchableOpacity>
				)}
				{menuBurguer && <FilterComponent />}
			</View>
			{isDisabled && <BarHome />}
			<BottomNavigationBar isDisabled={isDisabled} />
		</View >
	);
}
