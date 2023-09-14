import { View, Text, Image } from 'react-native';
import { StyleSheet } from 'react-native';

export default function CourtBalloon(props: CourtCardInfos) {

	return (
		<View className='relative'>
			<View style={styles.calloutContainer}>
				<Text className='h-[90px] -mt-4'>
					<Image source={{ uri: props.image }} className="h-[80px] w-28 rounded-xl" resizeMode='cover' />
				</Text>
				<View className='self-start pl-[16px] mb-4' >
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
		marginBottom: 16,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	triangle: {
		width: 0,
		height: 0,
		borderLeftWidth: 15,
		borderRightWidth: 15,
		borderBottomWidth: 20,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: 'white',
		position: 'absolute',
		bottom: -20,
		left: '50%',
		marginLeft: -15,
	},
});
