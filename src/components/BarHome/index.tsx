import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	useAnimatedReaction,
	withTiming,
	FadeOut,
	FadeIn,
	withSpring
} from 'react-native-reanimated'
import { PanGestureHandler, State as GestureState } from 'react-native-gesture-handler'
import CourtCardHome from '../CourtCardHome'
import storage from '../../utils/storage'
import { useGetUserById } from '../../hooks/useUserById'

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

const screenHeight = Dimensions.get('window').height;
const minHeightPercentage = 40;
const maxHeightPercentage = 100;
const minHeight = (minHeightPercentage / 100) * screenHeight;
const maxHeight = (maxHeightPercentage / 100) * screenHeight;
const expandThreshold = 0.2 * maxHeight;

export default function HomeBar({ courts, userName, chosenType, HandleSportSelected }: HomeBarProps) {
	const translateY = useSharedValue(0);
	const height = useSharedValue(minHeight);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
			height: height.value,
		};
	});


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
		<View className='flex-1 w-full'>
			<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className="w-full" style={[animatedStyle, { backgroundColor: "#292929", borderTopEndRadius: 20, borderTopStartRadius: 20 }]}>
				<PanGestureHandler
					onGestureEvent={(event) => {
						const translateYDelta = event.nativeEvent.translationY;

						translateY.value = translateYDelta;

						height.value = Math.min(Math.max(height.value - translateYDelta, minHeight), maxHeight);
					}}
					onHandlerStateChange={(event) => {
						if (event.nativeEvent.state === GestureState.END) {

							const targetY = translateY.value * -1 >= expandThreshold ? maxHeight : 0;
							
							if (targetY === 0) {
								height.value = withTiming(minHeight);
								translateY.value = withSpring(targetY * -1);
							} else {
								console.log(expandThreshold)
								height.value = maxHeight;
								translateY.value = withSpring((targetY - (screenHeight/1.9)) * -1);
							}
						}
					}}
				>
					<View
						className='flex items-center'>
						<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
						<Text className='text-white text-lg font-black mt-3'>Olá{userName ? `, ${userName}` : null}!</Text>
					</View>
				</PanGestureHandler>

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

					<View className='h-10'></View>
				</ScrollView>
			</Animated.View>

		</View>
	)
}