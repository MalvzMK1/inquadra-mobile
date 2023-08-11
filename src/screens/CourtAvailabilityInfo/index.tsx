import {View, Text, ImageBackground, SafeAreaView, ScrollView, ActivityIndicator} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useState } from 'react'
import WeekDayButton from "../../components/WeekDays"
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import {Calendar, DateData} from 'react-native-calendars'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {addDays, format} from 'date-fns'
import useCourtAvailability from "../../hooks/useCourtAvailability";
import { getWeekDays } from "../../utils/getWeekDates"

interface ICourtAvailabilityInfoProps extends NativeStackScreenProps<RootStackParamList, 'CourtAvailabilityInfo'> {}

export default function CourtAvailabilityInfo({navigation, route}: ICourtAvailabilityInfoProps) {
	const {
		data: courtAvailability,
		loading: isCourtAvailabilityLoading,
		error: isCourtAvailabilityError
	} = useCourtAvailability(route.params.courtId)

	const [activeStates, setActiveStates] = useState(Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false))
	const [showCalendar, setShowCalendar] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedWeekDate, setSelectedWeekDate] = useState<WeekDays>()
	const [shownAvailabilities, setShownAvailabilities] = useState<GraphQLCourtAvailability[]>([])

	const weekDates: FormatedWeekDates[] = getWeekDays(selectedDate)

	function handleWeekDayClick(index: number) {
		const availabilities = courtAvailability?.court.data.attributes.court_availabilities.data

		const newActiveStates = Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false);
		newActiveStates[index] = true;
		setActiveStates(newActiveStates);

		setSelectedWeekDate(weekDates[index].dayName as unknown as WeekDays)
		if (availabilities)
			setShownAvailabilities(availabilities.filter(availabilitie =>
				availabilitie.attributes.weekDay === weekDates[index].dayName as unknown as WeekDays
			))
	}

	function handleCalendarClick(data: DateData) {
		const date = new Date(data.dateString)
		const weekDay = format(addDays(date, 1), 'eeee')

		setSelectedDate(date)
		setSelectedWeekDate(weekDay as WeekDays)
	}

	return (
		<SafeAreaView className="flex flex-col justify-between h-full">
			{isCourtAvailabilityLoading ? <ActivityIndicator size='large' color='#F5620F' /> :
				<ScrollView className='h-screen flex flex-col flex-1'>
					<ImageBackground className="h-[215px] w-full" source={{
						uri: route.params.courtImage
					}} />

					<View className="h-fit mt-2.5">
						<View className="h-fit items-center">
							<Text className="text-xl font-black">{route.params.courtName}</Text>
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
									current={new Date().toDateString()}
									onDayPress={handleCalendarClick}
									markedDates={{
										[selectedDate.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
										// '2023-08-02': { selected: true, disableTouchEvent: true, selectedColor: 'orange' }
									}}
								/>
							)}
							<TouchableOpacity
								onPress={() => setShowCalendar(!showCalendar)}
								className="bg-[#959595] h-[4px] w-[30px] mt-[10px] rounded-[5px]"
							/>
						</View>
					</View>
					<ScrollView className="h-full w-full pl-[10px] pr-[10px] mt-[30px] flex">
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
					</ScrollView>
					<View className="h-fit w-full p-[15px] mt-[30px]">
						<TouchableOpacity
							className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'
							onPress={() => navigation.navigate('ReservationPaymentSign', {
								courtName: route.params.courtName,
								courtImage: route.params.courtImage,
								courtId: route.params.courtId,
								userId: route.params.userId
							})}
						>
							<Text className='text-white'>RESERVAR</Text>
						</TouchableOpacity>
					</View>
					<BottomBlackMenu />
				</ScrollView>
			}
		</SafeAreaView>
	)
}