import { View, Text, Button } from 'react-native';

// interface ILoginProps {
// 	navigation: Navigation
// }

export default function Login() {
	return (
		<View className="flex-1 flex items-center justify-center h-screen w-screen bg-white">
			<Button
				title="Go to next page"
				onPress={() => alert('Testando')}
			>
				<Text>Hello World!</Text>
			</Button>
		</View>
	);
}
