import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
	FadeOut,
	FadeIn
} from 'react-native-reanimated';
import CourtCardHome from '../CourtCardHome';
import storage from '../../utils/storage';
import { useGetUserById } from '../../hooks/useUserById';

let userId: string

storage.load({
	key: 'userInfos'
}).then(data => {
	userId = data.userId
})

interface HomeBarProps {
	courts: Array<{
		id: string,
		latitude: number,
		longitude: number,
		name: string,
		type: string,
		image: string,
		distance: number,
	}>,
	userName: string | undefined,
	chosenType: string | undefined,
	HandleSportSelected: Function
}

export default function HomeBar({ courts, userName, chosenType, HandleSportSelected }: HomeBarProps) {
	const [expanded, setExpanded] = useState(false);
	const height = useSharedValue('40%');

	useAnimatedReaction(
		() => expanded,
		(value) => {
			height.value = withTiming(value ? '100%' : '40%', { duration: 500 })
		},
		[expanded]
	)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		}
	})

	const { data: userByIdData, error: userByIdError, loading: userByIdLoading } = useGetUserById(userId)

	let userFavoriteCourts: string[] = []

	userByIdData?.usersPermissionsUser?.data?.attributes?.favorite_establishments?.data?.map(item => {
		userFavoriteCourts?.push(item.id)
	})

	const verifyCourtLike = (courtId: string) => {
		return userFavoriteCourts?.includes(courtId)
	}

	const result = courts.filter(item => {
		if (chosenType) {
			const ampersandSeparated = item.type.split(" & ").join(",").split(",")
			return ampersandSeparated.includes(chosenType)
		}
	})



	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className="w-full" style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
			<View
				className='flex items-center'>
				<TouchableOpacity className='w-full items-center' onPress={() => { setExpanded((prevState) => !prevState) }}>
					<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
				</TouchableOpacity>
				<Text className='text-white text-lg font-black mt-3'>Olá{userName ? `, ${userName}` : null}!</Text>
			</View>
			<ScrollView className='p-5'>
				{
					courts !== undefined ? (
						chosenType ? (
							result.length > 0 ? (courts.filter(item => { return item.type.split(" & ").join(",").split(",").includes(chosenType) }).map(item => {
								return (
									<CourtCardHome
										userId={userId}
										key={item.id}
										id={item.id}
										image={item.image}
										name={item.name}
										distance={item.distance}
										type={item.type}
										liked={verifyCourtLike(item.id)}
									/>
								)
							})) : (
								Alert.alert("Aviso", "Ainda não possuímos nenhum estabelecimento cadastrado para esse esporte na sua área. Contamos com sua ajuda para indicar nossa plataforma a quadras próximas a você!", [{
									onPress: () => HandleSportSelected(undefined)
								}]),
								<></>
							)
						)
							: (
								courts.map(item => (
									<CourtCardHome
										userId={userId}
										key={item.id}
										id={item.id}
										image={item.image}
										name={item.name}
										distance={item.distance}
										type={item.type}
										liked={verifyCourtLike(item.id)}
									/>
								))
							)
					) : (
						<ActivityIndicator size="small" color="#fff" />
					)
				}
			</ScrollView>
		</Animated.View>
	)
}