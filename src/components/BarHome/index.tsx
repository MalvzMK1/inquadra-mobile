import { View, Text, ScrollView, ActivityIndicator, Alert, Dimensions } from 'react-native'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
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

const screenHeight = Dimensions.get('window').height
const minHeightPercentage = 45
const maxHeightPercentage = 85
const minHeight = (minHeightPercentage / 100) * screenHeight
const maxHeight = (maxHeightPercentage / 100) * screenHeight
const expandThreshold = 0.015 * maxHeight

export default function HomeBar({ courts, userName, chosenType, HandleSportSelected }: HomeBarProps) {
	const translateY = useSharedValue(0)
	const height = useSharedValue(minHeight)


	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
			height: height.value,
			backgroundColor: "#292929",
			borderTopEndRadius: 20,
			borderTopStartRadius: 20
		}
	})


	const { data: userByIdData, error: userByIdError, loading: userByIdLoading } = useGetUserById(userId ?? "")

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
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className="w-full" style={[animatedStyle, { backgroundColor: "#292929" }]}>
			<PanGestureHandler
				onGestureEvent={(event) => {
					const translateYDelta = event.nativeEvent.translationY;

					if (translateYDelta < 0 && translateYDelta > -170) {
						translateY.value = translateYDelta + 100;
						height.value = minHeight - translateYDelta + 100;
					}
				}}
				onHandlerStateChange={(event) => {
					if (event.nativeEvent.state === GestureState.END) {
						const targetY = translateY.value;
						if (targetY * -1 >= expandThreshold) {
							height.value = withTiming(maxHeight, { duration: 500 });
							translateY.value = withSpring(-maxHeight - 125 + screenHeight );
						} else {
							height.value = withTiming(minHeight, { duration: 500 });
							translateY.value = withSpring(0);
						}
					}
				}}
			>


				<View className='flex items-center'>
					<View className='w-1/3 h-[5px] rounded-full mt-[10px] bg-[#ff6112]'></View>
					<Text className='text-white text-lg font-black mt-3'>Olá{userName ? `, ${userName}` : null}!</Text>
				</View>
			</PanGestureHandler>
			<ScrollView className='p-5'>
				{
					courts !== undefined ? (
						courts.filter(item => {
							return item.distance <= 5 && item.distance > 0
						}).length > 0 ? (
							chosenType ? (
								result.length > 0 ? (courts.filter(item => {
									return item.distance <= 5 && item.distance > 0
								}).filter(item => { return item.type.split(" & ").join(",").split(",").includes(chosenType) }).map(item => {
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
							<></>
						)
					) : (
						<ActivityIndicator size="small" color="#fff" />
					)
				}

					<View className='h-10'></View>
			</ScrollView>
		</Animated.View>
	)
}