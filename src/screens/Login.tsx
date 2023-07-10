import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
	return (
		<View>
			<Button
				title="Go to register page"
				// onPress={(_) => navigate()}
			/>
		</View>
	);
}
