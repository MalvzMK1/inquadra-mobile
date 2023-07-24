import {ScrollView, Text, View} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";
import {useNavigation} from "@react-navigation/native";
import { useGetFavoriteById } from "../../hooks/useFavoriteById"

/*  */
export default function FavoriteCourts() {
	const {data, error, loading} = useGetFavoriteById("1") 
	const navigation = useNavigation()
	console.log(data?.usersPermissionsUser.data.attributes.favorite_courts.data[0].attributes.court_type.data.attributes.courts.data[0].attributes.court_availabilities.data[0].attributes.schedulings.data[0].attributes.date);
	
	

	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			{
				!error && !loading ? data?.usersPermissionsUser.data.attributes.favorite_courts.data.map((courtType) => 
				<InfosCourt.Root category={courtType.attributes.court_type.data.attributes.name}>
					{courtType.attributes.court_type.data.attributes.courts.data.map((courtInfo) => 
						<InfosCourt.Court imageUrl={{uri:`http://192.168.0.229:1337${courtInfo.attributes.photo.data[0].attributes.url}`,  height: 90,
						width: 138}} key={5}>
								<InfosCourt.Content lastScheduling={new Date()}>
									<InfosCourt.ContentHeader courtName = {courtInfo.attributes.fantasy_name}/>
									<InfosCourt.ContentCourtType courtType={courtInfo.attributes.name} />
								</InfosCourt.Content> 		
						</InfosCourt.Court>
					)}
				</InfosCourt.Root>
				)
				
				:null
			}
			
			<InfosCourt.Root category='Quadras'>
				<InfosCourt.Court imageUrl={require('../../assets/quadra.png')} key={1} onPress={_ => navigation.navigate('Login')}>
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