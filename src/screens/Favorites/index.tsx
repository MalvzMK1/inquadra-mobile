import {ScrollView} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";

export default function Favorites() {
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
					courtName={'Fenix Soccer'}
					courtType={'Quadra de Futsal'}
					distance={'2,5Km'}
					lastScheduling={new Date()}
				/>
			</InfosCourt.Root>
		</ScrollView>
	)
}