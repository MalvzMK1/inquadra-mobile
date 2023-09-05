import { ScrollView } from "react-native";
import { InfosCourt } from "../../components/InfosCourt";
import { useGetFavoriteById } from "../../hooks/useFavoriteById"
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { HOST_API } from '@env'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetUserById } from '../../hooks/useUserById';
import useUpdateFavoriteCourts from "../../hooks/useUpdateFavoriteCourtsMutation";
import useGetFavoritesCourtsById from "../../hooks/useGetFavoritesCourtsById";
import storage from '../../utils/storage'
import { calculateDistance } from "../../utils/calculateDistance";

export default function FavoriteCourts({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'FavoriteCourts'>) {
	const USER_ID = '9'; //LEGÍVEL
	const { data, error, loading } = useGetFavoritesCourtsById(USER_ID)
	const [color, setColor] = useState({});
	const { data: userByIdData, error: userByIdError, loading: userByIdLoading } = useGetUserById(USER_ID)
	const [userFavoriteCourts, setUserFavoriteCourts] = useState<Array<string>>([])

	useEffect(() => {
		userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_courts?.data?.forEach(item => {
			setColor(prevColor => ({
				...prevColor,
				[item.id]: "red",
			}));
			setUserFavoriteCourts(prevCourts => [...prevCourts, item.id]);
		})
	}, [userByIdData])

	const [userLocation, setUserLocation] = useState({
		latitude: 0,
		longitude: 0
	})
	useEffect(() => {
		storage.load<{ latitude: string, longitude: string }>({
			key: 'userGeolocation'
		}).then(response => setUserLocation({ latitude: Number(response.latitude), longitude: Number(response.longitude) }))
	}, [])

	const [updateLikedCourts, { data: dataLike, error: errorLike, loading: loadingLike }] = useUpdateFavoriteCourts()
	const [isLoading, setIsLoading] = useState(false)
	const handleUpdateCourtLike = (courtId: string): void => {

		const courtsData = [
			...userFavoriteCourts
		]

		if (userFavoriteCourts?.includes(courtId)) {
			setIsLoading(true)
			const arrayWithoutDeletedItem = courtsData.filter(item => item !== courtId)

			updateLikedCourts({
				variables: {
					userId: USER_ID,
					favorite_courts: arrayWithoutDeletedItem
				}
			}).then(() => {
				setColor(prevColor => ({
					...prevColor,
					[courtId]: "white",
				}));
			})
				
				.finally(() => {
					setIsLoading(false)
					setUserFavoriteCourts(arrayWithoutDeletedItem)
				})
		} else {
			setIsLoading(true)
			courtsData.push(courtId)

			updateLikedCourts({
				variables: {
					userId: USER_ID,
					favorite_courts: courtsData
				}
			}).then(() => {
				setColor(prevColor => ({
					...prevColor,
					[courtId]: "red",
				}));
			})
				
				.finally(() => {
					setIsLoading(false)
					setUserFavoriteCourts(courtsData)
				})
		}
	}


	return (
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			{
				!loading &&
				data?.courtTypes?.data?.map(courtType => (
					<InfosCourt.Root category={courtType.attributes.name}>
						{
							courtType.attributes.courts.data.map(courtInfo => (
								<InfosCourt.Court imageUrl={{ uri: HOST_API + courtInfo?.attributes?.photo?.data[0]?.attributes?.url, height: 90, width: 138 }}>
									<InfosCourt.Content
										lastScheduling={

											courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data[0]?.attributes?.date
												?
												new Date(courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data[courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data?.length - 1]?.attributes?.date)
												:
												undefined
										}>
										<InfosCourt.ContentHeader courtName={courtInfo?.attributes?.fantasy_name}>
											<AntDesign
												name="heart"
												size={20}
												color={color[courtInfo.id] || "red"}
												onPress={() => handleUpdateCourtLike(courtInfo.id)}
											/>
										</InfosCourt.ContentHeader>
										<InfosCourt.ContentCourtType courtType={courtInfo?.attributes?.name} />
										{

										}
										<InfosCourt.ContentDistance distance={
											(() => {
												const distanceInMeters = calculateDistance(
													userLocation.latitude,
													userLocation.longitude,
													Number(courtInfo.attributes.establishment.data.attributes.address.latitude),
													Number(courtInfo.attributes.establishment.data.attributes.address.longitude)
												);
												return distanceInMeters >= 1000
													? `${(distanceInMeters / 1000).toFixed(1)} Km`
													: `${distanceInMeters.toFixed(0)} metros`;
											})()
										} />
									</InfosCourt.Content>
								</InfosCourt.Court>
							))
						}
					</InfosCourt.Root>

				))
			}
		</ScrollView>
	)
}
