import { View, ImageBackground, Button } from 'react-native';
import { UserTypeCard } from '../../components/UserTypeCard';

export default function ChooseUserType() {
	return (
		<ImageBackground
			source={require('../../assets/football_field.jpg')}
			className="flex-1 bg-football-field flex flex-col items-center justify-center"
		>
			<View className='h-full w-full flex flex-col items-center justify-around'>

				<UserTypeCard
					title='Jogador InQuadra'
					subtitle='Jogue seus esportes favoritos em quadras por todo o Brasil'
					pageNavigation='Register'
					image={require('../../assets/player_inquadra.png')}
				/>

				<UserTypeCard
					title='Parceiro InQuadra'
					subtitle='Anuncie seu estabelecimento e facilite a gestão do seu negócio'
					pageNavigation='RegisterEstablishmentProfile'
					image={require('../../assets/partner_inquadra.png')}
				/>

			</View>

		</ImageBackground>
	);
}
