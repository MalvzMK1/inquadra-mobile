import {useEffect, useState} from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import HomeBar from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import pointerMap from '../../assets/pointerMap.png';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useGetNextToCourts} from "../../hooks/useNextToCourts";
import {useGetUserById} from "../../hooks/useUserById";
import useAvailableSportTypes from "../../hooks/useAvailableSportTypes";
import {HOST_API} from '@env';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Home'> {
	menuBurguer: boolean;
}

export default function Home({ menuBurguer, route, navigation }: Props) {
	const {data, loading, error} = useGetNextToCourts()
	const {data: userHookData, loading: userHookLoading, error: userHookError} = useGetUserById(route.params.userID)
	const [courts, setCourts] = useState<Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>>([])
	const {data: availableSportTypes, loading: availableSportTypesLoading, error: availableSportTypesError} = useAvailableSportTypes()

	useEffect(() => {
		if (!error && !loading) {
			const newCourts = data?.courts.data.map((court) => {
				return {
					id: court.id,
					latitude: Number(court.attributes.establishment.data.attributes.address.latitude),
					longitude: Number(court.attributes.establishment.data.attributes.address.longitude),
					name: court.attributes.name,
					type: court.attributes.court_type.data.attributes.name,
					image: HOST_API + (court.attributes.photo.data.length == 0 ? '' : court.attributes.photo.data[0].attributes.url),
					distance: 666, // Substitua pelos valores reais
				}
			});

			if (newCourts) {
				setCourts((prevCourts) => [...prevCourts, ...newCourts]);
			}
		}
	}, [data, loading, userHookLoading]);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);

	const userGeolocation = route.params.userGeolocation

	if (!userHookLoading && !userHookError) {
		// TODO: IMPLEMENTAR A FOTO DO USUÁRIO A PARTIR DO ID
		//  FIX: MAXIMUM UPDATE DEPTH EXCEEDED. THIS CAN HAPPEN WHEN A COMPONENT REPATEDLY CALLS SETSTATE INSIDE COMPONENT WILL UPDATE OR COMPONENT DID UPDATE
		// if (!!userHookData?.usersPermissionsUser.data.attributes.photo.data)
		// 	navigation.setParams({
		// 		userPhoto: userHookData?.usersPermissionsUser.data.attributes.photo.data?.attributes.url
		// 	})
	}

	return (
		<View className="flex-1 flex flex-col">
			{
				availableSportTypesLoading ? <ActivityIndicator size='small' color='#FF6112' /> :
				isDisabled && !menuBurguer && <SportsMenu sports={availableSportTypes?.courts.data.map(sportType => ({
						id: sportType.attributes.court_type.data.id,
						name: sportType.attributes.court_type.data.attributes.name
					})) ?? []} />
			}
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
									id={item.id}
									key={item.id}
									name={item.name}
									distance={item.distance}
									image={item.image}
									type={item.type}
									// pageNavigation='EstablishmentInfo'
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
			{isDisabled && <HomeBar courts={courts} userName={userHookData?.usersPermissionsUser.data.attributes.username} />}
			<BottomNavigationBar 
				isDisabled={isDisabled} 
				playerScreen={true}
				establishmentScreen={false}
			/>
		</View >
	);
}