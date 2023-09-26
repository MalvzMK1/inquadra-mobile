import { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import storage from '../../utils/storage';
import useUpdateFavoriteCourt from '../../hooks/useUpdateFavoriteCourt';
import { useGetUserById } from '../../hooks/useUserById';

export default function CourtCardHome(props: CourtCardInfos) {
	const [userId, setUserId] = useState("")

	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const [color, setColor] = useState(props.liked ? "red" : "white")

	const { data: userByIdData, error: userByIdError, loading: userByIdLoading } = useGetUserById(userId ?? "")

	const [userFavoriteCourts, setUserFavoriteCourts] = useState<Array<string>>([])

	useEffect(() => {
		userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(item => {
			setUserFavoriteCourts([item.id])
		})

		storage.load<UserInfos>({
			key: 'userInfos'
		}).then(data => {
			setUserId(data.userId)
		})
	}, [userByIdData])

	const [updateLikedCourts, { data, error, loading }] = useUpdateFavoriteCourt()

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
					user_id: userId,
					favorite_establishment: arrayWithoutDeletedItem
				}
			}).then(() => alert("Dislike"))
				.catch((reason) => alert(reason))
				.finally(() => {
					setIsLoading(false)
					setUserFavoriteCourts(arrayWithoutDeletedItem)
				})
		} else {
			setIsLoading(true)
			courtsData.push(courtId)

			updateLikedCourts({
				variables: {
					user_id: userId,
					favorite_establishment: courtsData
				}
			}).then(() => alert("Like"))
				.catch((reason) => alert(reason))
				.finally(() => {
					setIsLoading(false)
					setUserFavoriteCourts(courtsData)
				})
		}
	}
	return (
		<TouchableOpacity onPress={() => navigation.navigate('EstablishmentInfo', {
			establishmentID: props.id,
			userPhoto: userByIdData?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url,
		})}>
			<View className='flex flex-row flex-1 gap-x-[14px] mb-5'>
				<Image className='w-[40%] h-[85px] rounded-[10px]' source={{ uri: props.image }} />
				<View className='flex flex-row flex-1 '>
					<View className='flex-1'>
						<Text className='text-[#ff6112] font-black text-[15px]'>{props.name}</Text>
						<Text className='text-white font-bold text-xs'>
							{
								Array.isArray(props.type) ? props.type.join(" & ") : props.type
							}
						</Text>
						<Text className='text-white font-bold text-xs'>{props.distance.toFixed(2).replace('.', ',')}km</Text>
					</View>
					<TouchableOpacity>
						<AntDesign name="heart" size={20} color={color}
							onPress={
								() => {
									if(userId == "")
										navigation.navigate("Login")
									else {
										color == "white" ? setColor("red") : setColor("white")
										handleUpdateCourtLike(props.id)
									}
								}
							}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	)
}