import { View, Text, Image, StyleSheet } from 'react-native';

export default function CourtBalloon(props: CourtCardInfos) {

	return (
		<View className='flex flex-col mb-[1.5px] justify-center items-center'>
			<View style={styles.calloutContainer}>
				<Text className='h-[70px] pl-[6px] self-center w-full rounded-xl overflow-hidden'>
					<Image source={{ uri: props.image }} className="h-[60px] w-28 rounded-xl" resizeMode='cover' />
				</Text>
				<View className='flex flex-col gap-y-[-4px] self-start pl-[6px] mb-2 mt-1' >
					<Text className='font-black text-[#FF6112] text-[10px]'>{props.name}</Text>
					<Text className='text-[8px]'>{props.type}</Text>
					<Text className='font-bold text-[8px]'>{props.distance.toFixed(2)}km</Text>
				</View>
			</View>
			<View style={styles.triangle}></View>
		</View>
	);

}

const styles = StyleSheet.create({
	calloutContainer: {
		display: "flex",
		width: 125,
		height: 90,
		backgroundColor: 'white',
		borderRadius: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 10
	},
	triangle: {
		width: 10,
		height: 2,
		borderLeftWidth: 4,
		borderRightWidth: 4,
		borderTopWidth: 8,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: 'white',
		borderTopColor: 'white',
	}

});
