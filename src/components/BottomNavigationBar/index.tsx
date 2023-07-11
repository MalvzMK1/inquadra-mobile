import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function BottomNavigationBar() {
	return (
		<View className="h-24 bg-[#292929] w-full flex items-center justify-center">
			<TouchableOpacity className="w-16 h-16 rounded-full overflow-hidden bg-slate-100">
				<Image
					source={require('../../assets/inquadra_unnamed_logo.png')}
					className="h-full w-full"
				/>
			</TouchableOpacity>
		</View>
	);
}