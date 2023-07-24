import {useEffect, useState} from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import {View, TouchableOpacity} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import HomeBar from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import pointerMap from '../../assets/pointerMap.png';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import useGetNextToCourts from "../../hooks/useNextToCourts";

interface Props extends NativeStackScreenProps<RootStackParamList, 'Home'> {
	menuBurguer: boolean;
}

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

export default function Home({ menuBurguer, route, navigation }: Props) {
	const {data, loading, error} = useGetNextToCourts()
	const [courts, setCourts] = useState<Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>>([])

	useEffect(() => {
		if (!error && !loading) {
			const newCourts = data?.courts.data.map((court) => {
				return {
					id: court.id,
					latitude: Number(court.attributes.establishment.data.attributes.address.latitude),
					longitude: Number(court.attributes.establishment.data.attributes.address.longitude),
					name: court.attributes.name,
					type: court.attributes.court_type.data.attributes.name,
					image: 'http://192.168.0.10:1337' + court.attributes.photo.data[0].attributes.url,
					distance: 666, // Substitua pelos valores reais
				}
			});

			if (newCourts) {
				setCourts((prevCourts) => [...prevCourts, ...newCourts]);
			}
		}
	}, [data, loading]);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);

	const userGeolocation = route.params.userGeolocation

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
						latitude: userGeolocation.latitude,
						longitude: userGeolocation.longitude,
						latitudeDelta: 0.004,
						longitudeDelta: 0.004,
					}}
				>
					{
						courts.map((item) => (
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
									key={item.id}
									name={item.name}
									distance={item.distance}
									image={item.image}
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
			{isDisabled && <HomeBar courts={courts}/>}
			<BottomNavigationBar
				isDisabled={isDisabled}
				buttonOneNavigation='ProfileSettings'
				buttonTwoNavigation='FavoriteCourts'
				buttonThreeNavigation='Home'
				buttonFourNavigation='InfoReserva'
			/>
		</View >
	);
}