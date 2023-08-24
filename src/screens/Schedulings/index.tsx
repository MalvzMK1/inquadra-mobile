import {View, Text, Image, ScrollView, TouchableOpacity} from "react-native"
import CourtSchedulingContainer from "../../components/CourtSchedulingContainer"
import { BottomNavigationBar } from "../../components/BottomNavigationBar"
import CourtScheduling from "../../components/CourtScheduling"
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import storage from "../../utils/storage";
import useAllEstablishmentSchedules from "../../hooks/useAllEstablishmentSchedules";
import {addDays} from "date-fns";

interface ScheduleCardInfos {
	id: string,
	name: string,
	startsAt: string,
	endsAt: string,
	status: string,
	date: Date,
}

interface ScheduleArray {
	date: Date,
	schedules: Array<ScheduleCardInfos>
}

export default function Schedulings({navigation}: NativeStackScreenProps<RootStackParamList, 'Schedulings'>) {
	const [userId, setUserId] = useState<string>();
	const [schedules, setSchedules] = useState<Array<ScheduleArray>>([])
	const {data, loading, error} = useAllEstablishmentSchedules('5') // TODO: INTEGRATE WITH REAL ESTALBISHMENT ID
	const currentDate = new Date().toISOString().split("T")[0];

	useEffect(() => {
		storage.load<UserInfos>({
			key: 'userInfos'
		}).then(data => setUserId(data.userId))
	}, [])

	useEffect(() => {
		if (!loading && data) {
			let newSchedulesArray: Array<{
				date: Date,
				schedules: Array<ScheduleCardInfos>
			}> = [];
			let newSchedules: Array<ScheduleCardInfos> = [];

			data.establishment.data?.attributes.courts.data.forEach(court => {
				court.attributes.court_availabilities.data.forEach(availability => {
					availability.attributes.schedulings.data.forEach(schedule => {
						console.log({
							starts: availability.attributes.startsAt,
							ends: availability.attributes.endsAt.slice(0, 5)
						})
						newSchedules.push({
							id: court.id,
							name: court.attributes.court_types.data.map(courtType => courtType.attributes.name).join(', '),
							status: availability.attributes.status,
							endsAt: availability.attributes.endsAt.slice(0, 5),
							startsAt: availability.attributes.startsAt.slice(0, 5),
							date: addDays(new Date(schedule.attributes.date), 1),
						})
					})
				})
			})

			newSchedules.forEach((scheduleCard) => {
				const existingDateIndex = newSchedulesArray.findIndex(
					(item) => item.date.getTime() === scheduleCard.date.getTime()
				);

				if (existingDateIndex !== -1) {
					newSchedulesArray[existingDateIndex].schedules.push(scheduleCard);
				} else {
					newSchedulesArray.push({
						date: scheduleCard.date,
						schedules: [scheduleCard],
					});
				}
			});

			console.log({newSchedulesArray: newSchedulesArray[0].schedules[0].name})
			setSchedules(newSchedulesArray)
		}
	}, [data])

	return (
		<View className=" h-full w-full pt-[20px] pl-[30px] pr-[30px]">
			<View className="w-full h-fit items-center justify-between flex flex-row">
				<Text className="font-black text-[16px]">Registro de reservas</Text>
				<Image source={require('../../assets/calendar_orange_icon.png')}></Image>
			</View>

			<ScrollView className="mt-[15px]">

				<TouchableOpacity onPress={() => console.log(schedules)} >
					<Text>OIE</Text>
				</TouchableOpacity>

				{
					schedules.map(schedule => (
						<CourtSchedulingContainer date={schedule.date.toISOString()}>
							<View>
								{
									schedule.schedules.map(courtSchedule => (
										<CourtScheduling
											id={courtSchedule.id}
											name={courtSchedule.name}
											startsAt={courtSchedule.startsAt}
											endsAt={courtSchedule.endsAt}
											status={'Active'}
										/>
									))
								}
							</View>
						</CourtSchedulingContainer>
					))
				}

				{/*<CourtSchedulingContainer*/}
				{/*	date={currentDate}*/}
				{/*>*/}
				{/*	<View>*/}


				{/*		<CourtScheduling*/}
				{/*			id={'2'}*/}
				{/*			name="Quadra Fênix"*/}
				{/*			startsAt="17:00h"*/}
				{/*			endsAt="18:00h"*/}
				{/*			status="Canceled"*/}
				{/*		/>*/}
				{/*	</View>*/}
				{/*</CourtSchedulingContainer>*/}

			</ScrollView>

			<BottomNavigationBar
				establishmentScreen
				userID={'1'}
				userPhoto={'https'}
			/>
		</View>
	)
}