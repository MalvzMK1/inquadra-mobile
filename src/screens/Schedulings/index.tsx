import { View, Text, Image, ScrollView } from "react-native"
import CourtSchedulingContainer from "../../components/CourtSchedulingContainer"
import { BottomNavigationBar } from "../../components/BottomNavigationBar"
import CourtScheduling from "../../components/CourtScheduling"
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import storage from "../../utils/storage";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";

interface ScheduleCardInfos {
	id: string,
	name: string,
	startsAt: string,
	endsAt: string,
	status: string,
}


export default function Schedulings({navigation}: NativeStackScreenProps<RootStackParamList, 'Schedulings'>) {
	const [userId, setUserId] = useState<string>();
	const [schedules, setSchedules] = useState<Array<ScheduleCardInfos>>([])
	const {data, loading, error} = useAllEstablishmentSchedules('5') // TODO: INTEGRATE WITH REAL ESTALBISHMENT ID
	const currentDate = new Date().toISOString().split("T")[0];

	useEffect(() => {
		storage.load<UserInfos>({
			key: 'userInfos'
		}).then(data => setUserId(data.userId))
	}, [])

	useEffect(() => {
		if (!loading) console.log(data?.establishment.data)
	}, [data])

	return (
		<View className=" h-full w-full pt-[20px] pl-[30px] pr-[30px]">
			<View className="w-full h-fit items-center justify-between flex flex-row">
				<Text className="font-black text-[16px]">Registro de reservas</Text>
				<Image source={require('../../assets/calendar_orange_icon.png')}></Image>
			</View>

			<ScrollView className="mt-[15px]">

				<CourtSchedulingContainer
					date={currentDate}
				>
					<View>
						<CourtScheduling
							id={'1'}
							name="Quadra Fênix"
							startsAt="17:00h"
							endsAt="18:00h"
							status="Active"
						/>

						<CourtScheduling
							id={'2'}
							name="Quadra Fênix"
							startsAt="17:00h"
							endsAt="18:00h"
							status="Canceled"
						/>
					</View>
				</CourtSchedulingContainer>

			</ScrollView>

			<BottomNavigationBar
				establishmentScreen
				userID={'1'}
				userPhoto={'https'}
			/>
		</View>
	)
}