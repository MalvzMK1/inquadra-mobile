import { View, ImageBackground } from 'react-native';
import { UserTypeCard } from '../../components/UserTypeCard';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ChooseUserType() {

	const navigation = useNavigation()

	return (
		<ImageBackground
			source={require('../../assets/football_field.jpg')}
			className="flex-1 bg-football-field flex flex-col pt-12 px-3"
		>
			<AntDesign name="arrowleft" size={24} color="white" className='pl-2 pt-2' onPress={() => navigation.goBack()}/>
			<View className='h-[90%] w-full flex flex-col items-center justify-around'>
				<UserTypeCard
					title='Jogador InQuadra'
					subtitle='Jogue seus esportes favoritos em quadras por todo o Brasil'
					pageNavigation='Register'
					image={require('../../assets/player_inquadra.png')}
				/>

				<UserTypeCard
					title='Parceiro InQuadra'
					subtitle='Anuncie suas quadras e facilite a gestão do seu negócio'
					pageNavigation='RegisterEstablishmentProfile'
					image={require('../../assets/partner_inquadra.png')}
				/>
			</View>
		</ImageBackground>
	);
}
