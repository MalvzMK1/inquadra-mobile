import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import HomeBar from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import pointerMap from '../../assets/pointerMap.jpeg';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetUserById } from "../../hooks/useUserById";
import useAvailableSportTypes from "../../hooks/useAvailableSportTypes";
import { HOST_API } from '@env';
import useEstablishmentCardInformations from "../../hooks/useEstablishmentCardInformations";
import { calculateDistance } from '../../utils/calculateDistance';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Home'> {
	menuBurguer: boolean;
}

interface EstablishmentObject {
	id: string,
	latitude: number,
	longitude: number,
	name: string,
	type: string,
	image: string,
	distance: number,
}

export default function Home({ menuBurguer, route, navigation }: Props) {
	const userGeolocation = route.params.userGeolocation;

	const { data, loading, error } = useEstablishmentCardInformations()
	const { data: userHookData, loading: userHookLoading, error: userHookError } = useGetUserById(route.params.userID)

	const [establishments, setEstablishments] = useState<Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>>([]);
	const [sportTypes, setSportTypes] = useState<Array<SportType>>([]);
	const [sportSelected, setSportSelected] = useState<string>()
	const { data: availableSportTypes, loading: availableSportTypesLoading, error: availableSportTypesError } = useAvailableSportTypes()

	const HandleSportSelected = (nameSport: string) => {
		setSportSelected(nameSport)
	}

	useEffect(() => {
		// console.log({error})
		if (!error && !loading) {
			const newCourts = data?.establishments.data
				.filter(establishment => (
					establishment.attributes.photos.data &&
					establishment.attributes.photos.data.length > 0 &&
					establishment.attributes.courts.data
				))
				.map((establishment => {
					let establishmentObject: EstablishmentObject;

					let courtTypes = establishment.attributes.courts.data!
						.filter(court => court.attributes.court_types.data.length > 0)
						.map(court => court.attributes.court_types.data)
						.map(courtType => courtType.map(type => type.attributes.name))

					if (!courtTypes) courtTypes = []
					// console.log({establishment})

					establishmentObject = {
						id: establishment.id,
						name: establishment.attributes.corporateName,
						latitude: Number(establishment.attributes.address.latitude),
						longitude: Number(establishment.attributes.address.latitude),
						distance: calculateDistance(
							userGeolocation.latitude,
							userGeolocation.longitude,
							Number(establishment.attributes.address.latitude),
							Number(establishment.attributes.address.latitude)
						) / 1000, // Change to real values,
						image: HOST_API + establishment.attributes.photos.data!.find((photo, index) => index === 0)?.attributes.url ?? '',
						type: courtTypes.length > 0 ? courtTypes.length > 1 ? `${courtTypes[0]} & ${courtTypes[1]}` : courtTypes[0] : '',
					}

					return establishmentObject
				}))
				

			if (newCourts) {
				setEstablishments((prevCourts) => [...prevCourts, ...newCourts]);
			}

			navigation.setParams({
				userPhoto: userHookData?.usersPermissionsUser.data.attributes.photo.data?.attributes.url
			})
		}

	}, [data, loading, userHookLoading, userHookData]);
	const [isDisabled, setIsDisabled] = useState<boolean>(true);

	useEffect(() => {
		const newAvailableSportTypes: SportType[] = [];
	
		availableSportTypes?.courts.data.forEach(court => {
			court.attributes.court_types.data.forEach(courtType => {
				const sportAlreadyAdded = newAvailableSportTypes.some(sport => sport.id === courtType.id);
				
				if (!sportAlreadyAdded) {
					newAvailableSportTypes.push({ id: courtType.id, name: courtType.attributes.name });
				}
			});
		});
	
		setSportTypes(newAvailableSportTypes);
	}, [availableSportTypes, availableSportTypesError]);
	

	return (
		<View className="flex-1 flex flex-col">
			{
				availableSportTypesLoading ? <ActivityIndicator size='small' color='#FF6112' /> :
					isDisabled && !menuBurguer && <SportsMenu sports={sportTypes} />
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

						establishments.map((item) => (
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
			{
				isDisabled && <HomeBar
					courts={establishments}
					userName={userHookData?.usersPermissionsUser.data.attributes.username}
				/>
			}
			{
				userHookData && <BottomNavigationBar
					isDisabled={isDisabled}
					playerScreen={true}
					establishmentScreen={false}
					userID={userHookData.usersPermissionsUser.data.id}
					userPhoto={userHookData.usersPermissionsUser.data.attributes.photo.data?.attributes.url ? HOST_API + userHookData.usersPermissionsUser.data.attributes.photo.data?.attributes.url : ''}
				/>
			}
		</View >
	);
}