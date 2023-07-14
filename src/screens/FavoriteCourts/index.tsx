import {ScrollView, Text, TouchableOpacity} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";
import SvgUri from "react-native-svg-uri";

export default function FavoriteCourts() {
	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			<InfosCourt.Root category='Quadras'>
				{/*
					TODO: FAZER UM ONCLICK NO COMPONENTE DO CARD DA QUADRA QUE LEVA
								À PÁGINA DE RESERVA DA QUADRA
				*/}
				<InfosCourt.Court
					key={1}
					imageUrl={require('../../assets/quadra.png')}
				>
					<InfosCourt.Content lastScheduling={new Date()}>
							<InfosCourt.ContentHeader courtName={'Fenix Soccer'}>
								<TouchableOpacity className='flex flex-row items-center' onPress={(_) => alert('Editar')}>
									<Text className='text-orange-600 mr-1'>Editar</Text>
									<SvgUri
										height={10}
										width={10}
										source={require('../../assets/edit_pencil.svg')}
									/>
								</TouchableOpacity>
							</InfosCourt.ContentHeader>
							<InfosCourt.ContentCourtType courtType={'Quadra de Futsal'} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					key={1}
					imageUrl={require('../../assets/quadra.png')}
				>
					<InfosCourt.Content lastScheduling={new Date()}>
						<InfosCourt.ContentHeader courtName={'Fenix Soccer'}>
							<TouchableOpacity className='flex flex-row items-center' onPress={(_) => alert('Editar')}>
								<SvgUri
									height={18}
									width={18}
									source={require('../../assets/filled-heart.svg')}
								/>
							</TouchableOpacity>
						</InfosCourt.ContentHeader>
						<InfosCourt.ContentCourtType courtType={'Quadra de Futsal'} />
						<InfosCourt.ContentDistance distance={'2,5Km'} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					key={1}
					imageUrl={require('../../assets/quadra.png')}
				>
					<InfosCourt.Content>
						<InfosCourt.ContentHeader courtName={'Fenix Soccer'}>
							<TouchableOpacity className='flex flex-row items-center' onPress={(_) => alert('Editar')}>
								<SvgUri
									height={18}
									width={18}
									source={require('../../assets/filled-heart.svg')}
								/>
							</TouchableOpacity>
						</InfosCourt.ContentHeader>
						<InfosCourt.ContentCourtType courtType={'Quadra de Futsal'} />
						<InfosCourt.ContentDistance distance={'2,5Km'} />
					</InfosCourt.Content>
				</InfosCourt.Court>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					key={1}
					imageUrl={require('../../assets/quadra.png')}
				>
					<InfosCourt.Content>
						<InfosCourt.ContentHeader courtName={'Quadra Municipal Itaquera'} />
						<InfosCourt.ContentCourtType courtType={'Futebol Society e quadra taqueada'} />
						<InfosCourt.ContentDistance distance={'3,5Km'} />
					</InfosCourt.Content>
				</InfosCourt.Court>
			</InfosCourt.Root>
		</ScrollView>
	)
}