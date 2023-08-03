import { useNavigation, NavigationProp } from "@react-navigation/native"
import { useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export function BottomNavigationBar(props: BottomNavigationType) {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()

	const [showButtons, setShowButtons] = useState(false)
	const opacityValue = useSharedValue(0)

	const toogleButton = () => {
		setShowButtons(!showButtons)
		opacityValue.value = showButtons ? 0 : 1
	}

	const buttonsContainerStyle = useAnimatedStyle(() => {
		return {
			opacity: withTiming(opacityValue.value, { duration: 300 }), // Duração da animação (300ms)
		};
	});

	let viewContent = null

	if (props.playerScreen) {
		viewContent = <View className='className={`h-24 bg-${props.isDisabled ? "transparent" : "[#292929]"} w-full flex flex-row items-center justify-center gap-y-[5px]`}'>
			{
				showButtons && (
					<Animated.View style={[styles.buttonsContainer, buttonsContainerStyle]}>
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('ProfileSettings', {
								userPhoto: undefined
							})}>
							<Image
								source={require('../../assets/settings_black_icon.png')}
							/>
						</TouchableOpacity >
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('FavoriteCourts', {
								userPhoto: undefined
							})}>
							<Image
								source={require('../../assets/black_heart.png')}
							/>
						</TouchableOpacity>
					</Animated.View>
				)
			}

			<TouchableOpacity
				className="flex flex-row items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-slate-100 ml-[5px] mr-[5px]"
				onPress={toogleButton}
			>
				<Image source={require('../../assets/inquadra_unnamed_logo.png')} />
			</TouchableOpacity>

			{
				showButtons && (
					<Animated.View style={[styles.buttonsContainer, buttonsContainerStyle]}>
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							>
							<Image
								source={require('../../assets/house_black_icon.png')}
							/>
						</TouchableOpacity >
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('InfoReserva')}>
							<Image
								source={require('../../assets/calendar_black_icon.png')}
							/>
						</TouchableOpacity>
					</Animated.View>
				)
			}
		</View>
	} else {
		viewContent = <View className='className={`h-24 bg-${props.isDisabled ? "transparent" : "[#292929]"} w-full flex flex-row items-center justify-center gap-y-[5px]`}'>
			{
				showButtons && (
					<Animated.View style={[styles.buttonsContainer, buttonsContainerStyle]}>
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('ChooseUserType')}>
							<Image
								source={require('../../assets/settings_black_icon.png')}
							/>
						</TouchableOpacity >
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('ChooseUserType')}>
							<Image
								source={require('../../assets/money_safe_icon.png')}
							/>
						</TouchableOpacity>
					</Animated.View>
				)
			}

			<TouchableOpacity
				className="flex flex-row items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-slate-100 ml-[5px] mr-[5px]"
				onPress={toogleButton}
			>
				<Image source={require('../../assets/inquadra_unnamed_logo.png')} />
			</TouchableOpacity>

			{
				showButtons && (
					<Animated.View style={[styles.buttonsContainer, buttonsContainerStyle]}>
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('ChooseUserType')}>
							<Image
								source={require('../../assets/house_black_icon.png')}
							/>
						</TouchableOpacity >
						<TouchableOpacity
							className="flex flex-row items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden bg-slate-100"
							onPress={() => navigation.navigate('ChooseUserType')}>
							<Image
								source={require('../../assets/calendar_black_icon.png')}
							/>
						</TouchableOpacity>
					</Animated.View>
				)
			}
		</View>
	}

	return (
		viewContent
	)
}

const styles = StyleSheet.create({
	buttonsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 5
	}
})