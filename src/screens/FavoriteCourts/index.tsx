import {ScrollView, Text, View} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import { useGetFavoriteById } from "../../hooks/useFavoriteById"
import {RootStackParamList} from "../../types/RootStack";

/*  */
export default function FavoriteCourts() {
	const {data, error, loading} = useGetFavoriteById("1") 

	const USER_ID = '2'; //LEGÍVEL
	const {data, error, loading} = useGetFavoriteById(USER_ID, USER_ID) 
	const navigation = useNavigation<NavigationProp<RootStackParamList>>()
	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			{
				!error && !loading ? data?.usersPermissionsUser?.data?.attributes?.favorite_courts?.data?.map((courtType) => 
				<InfosCourt.Root category={courtType.attributes.court_type.data.attributes.name}>?
					{courtType?.attributes?.court_type?.data?.attributes?.courts?.data?.map((courtInfo) => 
						<InfosCourt.Court imageUrl={{uri:`http://192.168.0.229:1337${courtInfo.attributes.photo.data[0].attributes.url}`,  height: 90,
						width: 138}} key={5}>
							{

							courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data[0]?.attributes?.date === undefined?
							<>
								<InfosCourt.Content>
									<InfosCourt.ContentHeader courtName = {courtInfo.attributes.fantasy_name}/>
									<InfosCourt.ContentCourtType courtType={courtInfo.attributes.name} />
								</InfosCourt.Content>
							</>
							: <>
								<InfosCourt.Content lastScheduling={new Date(courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data[courtInfo.attributes.court_availabilities.data[0].attributes.schedulings.data.length - 1]?.attributes?.date)}>
									<InfosCourt.ContentHeader courtName = {courtInfo.attributes.fantasy_name}/>
									<InfosCourt.ContentCourtType courtType={courtInfo.attributes.name} />
								</InfosCourt.Content> 
							</>
							}
						</InfosCourt.Court>
					)}
					</InfosCourt.Root>
				)
				:null
			}			

		</ScrollView>
	)
}