import { View, Text, Image, ImageBackground } from 'react-native';
import { StyleSheet } from 'react-native';

export default function CourtBalloon(props: CourtCardInfos) {

	return (
		<View className='flex flex-col mb-[3px] justify-center items-center'>
			<View style={styles.calloutContainer}>
				<Text className='h-[90px] -mt-4'>
					<Image source={{ uri: props.image }} className="h-[80px] w-28" resizeMode='cover' />
				</Text>
				<View className='self-start pl-[16px] mb-4 ' >
					<Text className='font-black text-[#FF6112] text-[10px]'>{props.name}</Text>
					<Text className='text-[8px]'>{props.type}</Text>
					<Text className='font-bold text-[8px]'>{props.distance.toFixed(2)}km</Text>
				</View>
			</View>
			<View style={styles.triangle}></View>
		</View>
	)
}

const styles = StyleSheet.create({
	calloutContainer: {
		width: 144,
		height: 118,
		backgroundColor: 'white',
		borderRadius: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	triangle: {
		width: 20,
		height: 3,
		borderLeftWidth: 9,
		borderRightWidth: 9,
		borderTopWidth: 14,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: 'white',
		borderTopColor: 'white',
	},
	image: {
		borderRadius: 500
	}
});
