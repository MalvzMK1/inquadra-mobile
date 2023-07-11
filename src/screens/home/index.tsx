import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';

export default function Home() {
	return (
		<View className="flex-1 flex flex-col">
			<View className="flex-1"></View>
			<BottomNavigationBar />
		</View>
	);
}
