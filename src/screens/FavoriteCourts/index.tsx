import {ScrollView, Text, View} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";
import {NavigationProp, useNavigation} from "@react-navigation/native";

export default function FavoriteCourts() {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			<InfosCourt.Root category='Quadras'>
				{/*
					TODO: FAZER UM ONCLICK NO COMPONENTE DO CARD DA QUADRA QUE LEVA
								À PÁGINA DE RESERVA DA QUADRA
				*/}
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={1} onPress={_ => navigation.navigate('InfoReserva')}>
					<InfosCourt.Content>
						<InfosCourt.ContentHeader courtName='Fenix Soccer' />
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
						<InfosCourt.ContentPaymentProgress progress={80} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={2}>
					<InfosCourt.Content hasDisponibility>
						<InfosCourt.ContentHeader courtName='Fenix Soccer' />
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
						<InfosCourt.ContentRating rating={4.4} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={3}>
					<InfosCourt.Content lastScheduling={new Date()}>
						<InfosCourt.ContentHeader courtName='Fenix Soccer'>
							{/* <SvgUri
								height={18}
								width={18}
								source={require('../../assets/filled-heart.svg')}
							/> */}
						</InfosCourt.ContentHeader>
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
						<InfosCourt.ContentDistance distance={'2,5Km'} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={4}>
					<InfosCourt.Content lastScheduling={new Date()}>
						<InfosCourt.ContentHeader courtName='Fenix Soccer'>
							<View className='flex flex-row items-center gap-1'>
								<Text className='text-xs text-orange-600'>Editar</Text>
								{/* <SvgUri
									height={10}
									width={10}
									source={require('../../assets/edit_pencil.svg')}
								/> */}
							</View>
						</InfosCourt.ContentHeader>
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
					</InfosCourt.Content>
				</InfosCourt.Court>
			</InfosCourt.Root>
			<InfosCourt.Root category='Vôlei'>
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={5}>
					<InfosCourt.Content>
						<InfosCourt.ContentHeader courtName='Fenix Soccer'>
							{/* <SvgUri
								height={18}
								width={18}
								source={require('../../assets/filled-heart.svg')}
							/> */}
						</InfosCourt.ContentHeader>
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
						<InfosCourt.ContentDistance distance='2,5Km' />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={6}>
					<InfosCourt.Content>
						<InfosCourt.ContentHeader courtName='Fenix Soccer' />
						<InfosCourt.ContentCourtType courtType='Quadra de Futsal' />
						<InfosCourt.ContentDistance distance='2,5Km' />
					</InfosCourt.Content>
				</InfosCourt.Court>
			</InfosCourt.Root>
		</ScrollView>
	)
}