import {ScrollView} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";

export default function FavoriteCourts() {
	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			<InfosCourt.Root category='Quadras'>
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Fenix Soccer'}
					courtType={'Quadra de Futsal'}
					distance={'2,5Km'}
					lastScheduling={new Date()}
				/>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Quadra Futsal'}
					courtType={'Quadra de Futsal'}
					distance={'1,5Km'}
					lastScheduling={new Date()}
				/>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Quadra Futsal'}
					courtType={'Quadra de Futsal'}
					distance={'666Km'}
					lastScheduling={new Date()}
				/>
			</InfosCourt.Root>
			<InfosCourt.Root category='Campo de Futebol'>
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Campo de futebol Salles'}
					courtType={'Quadra de Futsal'}
					distance={'2,5Km'}
					lastScheduling={new Date()}
				/>
				<InfosCourt.Spacer />
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Campo sintético'}
					courtType={'Quadra de Futsal'}
					distance={'1,5Km'}
					lastScheduling={new Date()}
				/>
			</InfosCourt.Root>
			<InfosCourt.Root category='Vôlei'>
				<InfosCourt.Court
					imageUrl={require('../../assets/quadra.png')}
					courtName={'Quadra de vôlei do chico'}
					courtType={'Quadra de Futsal'}
					distance={'2,5Km'}
					lastScheduling={new Date()}
				/>
			</InfosCourt.Root>
		</ScrollView>
	)
}