import {View, Text, ImageBackground, SafeAreaView, Image, ScrollView, ActivityIndicator} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useState } from 'react'
import WeekDayButton from "../../components/WeekDays"
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import {Calendar, DateData} from 'react-native-calendars'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {addDays, format} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import useCourtAvailability from "../../hooks/useCourtAvailability";
import {CourtAvailabilityEntity} from "../../__generated__/graphql";
import {ICourtAvailabilityResponse} from "../../graphql/queries/courtAvailability";

type FormatedWeekDates = {
	dayName: string,
	localeDayInitial: string,
	day: string,
	date: Date
}

function getWeekDays(date: Date, weeksOffset: number = 0): Array<FormatedWeekDates> {
	const daysOfWeek: Array<FormatedWeekDates> = []

	const sundayIndex = date.getDay()

	for (let i = 0; i < 7; i++) {
		const weekDate = addDays(date, i);
		const localeDayInitial = format(
			weekDate,
			'eee',
			{
				locale: ptBR,
			}).toUpperCase()[0];
		const dayName = format(
			weekDate,
			'eeee'
		)

		const currentIndex = (sundayIndex + i) % 7

		daysOfWeek[currentIndex] = {
			dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
			localeDayInitial,
			day: format(weekDate, 'dd'),
			date: weekDate
		};
	}

	return daysOfWeek
}

interface ICourtAvailibilityInfoProps extends NativeStackScreenProps<RootStackParamList, 'CourtAvailibilityInfo'> {}

export default function CourtAvailibilityInfo({navigation, route}: ICourtAvailibilityInfoProps) {
	const {
		data: courtAvailability,
		loading: isCourtAvailabilityLoading,
		error: isCourtAvailabilityError
	} = useCourtAvailability(route.params.courtId)

	const [activeStates, setActiveStates] = useState(Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false))
	const [showCalendar, setShowCalendar] = useState(false)
	const [dateSelected, setDateSelected] = useState(new Date())
	const [selectedWeekDate, setSelectedWeekDate] = useState<WeekDays>()
	const [shownAvailabilities, setShownAvailabilities] = useState<GraphQLCourtAvailability[]>([])

	const weekDates: FormatedWeekDates[] = getWeekDays(dateSelected)

	function handleWeekDayClick(index: number) {
		const availabilities = courtAvailability?.court.data.attributes.court_availabilities.data

		const newActiveStates = Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false);
		newActiveStates[index] = true;
		setActiveStates(newActiveStates);

		console.log(availabilities[0].attributes.weekDay, weekDates[index].dayName)

		setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays)
		if (availabilities)
			setShownAvailabilities(availabilities.filter(availabilitie =>
				availabilitie.attributes.weekDay === weekDates[index].dayName as unknown as WeekDays
			))
			// console.log(availabilities.find(availabilitie => availabilitie.attributes.weekDay === weekDates[index].dayName as unknown as WeekDays))
			// availabilities.forEach(availability => {
			// 	console.log(availability.attributes.weekDay, weekDates[index].dayName.toLowerCase() as unknown as WeekDays)
			// })
	}

	return (
		<SafeAreaView className="flex flex-col justify-between h-full">
			{isCourtAvailabilityLoading ? <ActivityIndicator size='large' color='#F5620F' /> :
				<ScrollView>
					<View className="h-[215px] w-full">
						<ImageBackground className="flex-1 flex flex-col" source={{
							uri: route.params.courtImage
						}} />
					</View>

					<View className="h-fit mt-[10px]">
						<View className="h-fit items-center">
							<Text className="text-[20px] font-black">{route.params.courtName}</Text>
							{!showCalendar && (
								<View className="h-fit w-full border border-[#9747FF] border-dashed p-[15px] items-center justify-around flex flex-row mt-[30px]">
									{
										weekDates.map((date, index) => (
											<WeekDayButton
												localeDayInitial={date.localeDayInitial}
												day={date.day}
												onClick={(isClicked) => {
													handleWeekDayClick(index)
												}}
												active={activeStates[index]}
											/>
										))
									}
								</View>
							)}
							{showCalendar && (
								<Calendar
									className="h-fit w-96"
									onDayPress={day => {
										// let dayItem: Date = new Date(day.dateString)
										// setDateSelected(day.dateString)
										}}
									markedDates={{
										// [dateSelected]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
									}}
								/>
							)}
							<TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px]"></TouchableOpacity>
						</View>
					</View>
					<ScrollView className="max-h-[390px] w-full pl-[10px] pr-[10px] mt-[30px]">
						{
							(
								!isCourtAvailabilityLoading &&
								!isCourtAvailabilityError &&
								shownAvailabilities
							) && shownAvailabilities.map(availability => {
								if (!availability.attributes) return null

								const startsAt = availability.attributes.startsAt.split(':');
								const endsAt = availability.attributes.endsAt.split(':');

								if (shownAvailabilities.length > 0)
									return (
										<CourtAvailibility
											startsAt={`${startsAt[0]}:${startsAt[1]}`}
											endsAt={`${endsAt[0]}:${endsAt[1]}`}
											price={availability.attributes.value}
											busy={Boolean(!availability.attributes.status)}
										/>
									)
							})
						}
						{/*<CourtAvailibility startsAt="16:00" endsAt="17:00" price={190.90} busy={true} />*/}
						{/*<CourtAvailibility startsAt="17:00" endsAt="18:00" price={190.90} busy={false} />*/}
						{/*<CourtAvailibility startsAt="19:00" endsAt="20:00" price={190.90} busy={false} />*/}
						{/*<CourtAvailibility startsAt="20:00" endsAt="21:00" price={190.90} busy={false} />*/}
						{/*<CourtAvailibility startsAt="21:00" endsAt="22:00" price={190.90} busy={true} />*/}
						{/*<CourtAvailibility startsAt="22:00" endsAt="23:00" price={190.90} busy={false} />*/}
						{/*<CourtAvailibility startsAt="23:00" endsAt="00:00" price={190.90} busy={false} />*/}
					</ScrollView>
					<View className="h-fit w-full p-[15px] mt-[30px]">
						<TouchableOpacity className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'>
							<Text className='text-white'>RESERVAR</Text>
						</TouchableOpacity>
					</View>
					<BottomBlackMenu />
				</ScrollView>
			}
		</SafeAreaView>
	)
}