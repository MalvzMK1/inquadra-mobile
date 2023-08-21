import {ScrollView} from "react-native";
import {InfosCourt} from "../../components/InfosCourt";
import { useGetFavoriteById } from "../../hooks/useFavoriteById"
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {HOST_API} from '@env'
import {NativeStackScreenProps} from "@react-navigation/native-stack";

export default function FavoriteCourts({navigation, route}: NativeStackScreenProps<RootStackParamList, 'FavoriteCourts'>) {
	const USER_ID = route.params.userID; //LEGÍVEL
	const {data, error, loading} = useGetFavoriteById(USER_ID, USER_ID) 
	const [color, setColor] = useState("red")

	return(
		<ScrollView className='flex-1 py-4 bg-zinc-600'>
			{
				!loading &&
					data?.usersPermissionsUser.data.attributes.favorite_courts.data.map(courtType => (
						<InfosCourt.Root category={courtType.attributes.court_types.data[0].attributes.name}>
							{/*
								TODO: INTEGRATE CORRECTLY WITH THE NEW ATTRIBUTE TYPE (ARRAY)
							*/}
							{
								courtType.attributes.court_types.data[0].attributes.courts.data.map(courtInfo => (
									<InfosCourt.Court imageUrl={{uri: HOST_API + courtInfo.attributes.photo.data[0]?.attributes.url, height: 90, width: 138}}>
										<InfosCourt.Content 
											lastScheduling={
												courtInfo.attributes.court_availabilities.data[0]?.attributes.schedulings.data[0]?.attributes.date 
													?
												new Date(courtInfo?.attributes?.court_availabilities?.data[0]?.attributes?.schedulings?.data[courtInfo.attributes.court_availabilities.data[0].attributes.schedulings.data.length - 1]?.attributes?.date)
													:
												undefined
											}>
												<InfosCourt.ContentHeader courtName = {courtInfo.attributes.fantasy_name}>
													<AntDesign name="heart" size={20} color={color} onPress={() => color == "white" ? setColor("red") : setColor("white")} />
												</InfosCourt.ContentHeader>
												<InfosCourt.ContentCourtType courtType={courtInfo.attributes.name} />
												<InfosCourt.ContentDistance distance={'666Km'}/>
										</InfosCourt.Content>
									</InfosCourt.Court>
								))
							}
						</InfosCourt.Root>
					))
			}

		</ScrollView>
	)
}