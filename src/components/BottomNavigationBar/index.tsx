import { useNavigation } from '@react-navigation/native';
import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export function BottomNavigationBar(props: {isDisabled: boolean}) {
	const navigation = useNavigation();
	return (
		<View className={`h-24 bg-${props.isDisabled ? "transparent" : "[#292929]"} w-full flex items-center justify-center`}>
			<TouchableOpacity
				className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden bg-slate-100"
				onPress={() => navigation.navigate('FavoriteCourts')}
			>
				<Image source={require('../../assets/inquadra_unnamed_logo.png')}/>
			</TouchableOpacity>
		</View>
	);
}
