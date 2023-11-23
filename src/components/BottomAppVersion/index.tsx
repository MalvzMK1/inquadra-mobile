import {Platform, Text, View} from "react-native";
import {
	APP_VERSION_ANDROID,
	APP_VERSION_IPHONE,
} from '@env';

export default function BottomAppVersion() {
	return (
		<View className='bottom-0 w-screen h-fit py-2 bg-orange-400 flex items-center'>
			<Text>{Platform.OS === 'ios' ? APP_VERSION_IPHONE : APP_VERSION_ANDROID}</Text>
		</View>
	)
}