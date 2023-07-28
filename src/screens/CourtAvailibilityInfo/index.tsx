import {View, Text, ImageBackground, SafeAreaView, Image, ScrollView, ActivityIndicator} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useState } from 'react'
import WeekDays from "../../components/WeekDays"
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import { Calendar } from 'react-native-calendars'
import useCourtById from "../../hooks/useCourtById";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {addDays, format, getDaysInMonth} from 'date-fns'

type FormatedWeekDates = {
	dayName: string,
	day: string
}

function getWeekDays(date: Date): Array<FormatedWeekDates> {
	const daysOfWeek: Array<FormatedWeekDates> = []

	for (let i = 0; i < 7; i++) {
		const weekDate = addDays(date, i);
		const dayName = format(weekDate, 'eee').toLowerCase()[0];
		// console.log({date, dayName, daysOfWeek})
		daysOfWeek[i] = {
			dayName,
			day: format(weekDate, 'dd')
		};
	}

	return daysOfWeek
}

const dayInitial = [
	"D",
	"S",
	"T",
	"Q",
	"Q",
	"S",
	"S",
]

// const getWeekDates = (date: Date) => {
// 	const selectedDate = new Date(date);
// 	const dayOfWeek = selectedDate.getDay();
// 	const startDate = new Date(selectedDate);
// 	startDate.setDate(selectedDate.getDate() - dayOfWeek);
// 	const weekDates: Date[] = [startDate];
//
// 	for (let i = 1; i < 7; i++) {
// 		const nextDay = new Date(startDate);
// 		nextDay.setDate(startDate.getDate() + i);
// 		weekDates.push(nextDay);
// 	}
//
// 	let formatedWeekDates: FormatedWeekDates[] = []
//
// 	weekDates.forEach(item => {
// 		let dateItem: string = item.toISOString().split("-")[2].split("T")[0].toString()
//
// 		formatedWeekDates.push({
// 			dateItem
// 		})
// 	})
//
// 	return formatedWeekDates;
// };

interface ICourtAvailibilityInfoProps extends NativeStackScreenProps<RootStackParamList, 'CourtAvailibilityInfo'> {}

export default function CourtAvailibilityInfo({navigation, route}: ICourtAvailibilityInfoProps) {
	const [showCalendar, setShowCalendar] = useState(false)
	const [dateSelected, setDateSelected] = useState(new Date())

	const {data, loading, error} = useCourtById(route.params.courtId)

	const weekDates: FormatedWeekDates[] = getWeekDays(dateSelected)

	// if (!loading)
	// 	console.log({
	// 		dado_rota: route.params.courtImage,
	// 		dado_graphql: data?.court.data.attributes.photo.data[0].attributes.url
	// 	})

	return (
		<SafeAreaView className="flex flex-col justify-between h-full">
			{loading ? <ActivityIndicator size='large' color='#F5620F' /> :
				<View>
					<View className="h-[215px] w-full">
						<ImageBackground className="flex-1 flex flex-col" source={{
							uri: route.params.courtImage
							// uri: route.params.courtImage
						}}>
							{/*<TouchableOpacity className="mt-[50px] ml-[20px]" onPress={() => navigation.goBack()}>*/}
							{/*	<Image source={{*/}
							{/*		uri: HOST_API + data?.court.data*/}
							{/*	}}*/}
							{/*	/>*/}
							{/*</TouchableOpacity>*/}
						</ImageBackground>
					</View>

					<View className="h-fit mt-[10px]">
						<View className="h-fit items-center">
							<Text className="text-[20px] font-black">{route.params.courtName}</Text>
							{!showCalendar && (
								<View className="h-fit w-full border border-[#9747FF] border-dashed p-[15px] items-center justify-around flex flex-row mt-[30px]">
									<WeekDays dayInitial={dayInitial[0]} day={weekDates[6].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[1]} day={weekDates[0].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[2]} day={weekDates[1].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[3]} day={weekDates[2].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[4]} day={weekDates[3].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[5]} day={weekDates[4].dateItem}></WeekDays>
									<WeekDays dayInitial={dayInitial[6]} day={weekDates[5].dateItem}></WeekDays>
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
						<CourtAvailibility startsAt="16:00" endsAt="17:00" price={190.90} busy={true} />
						<CourtAvailibility startsAt="17:00" endsAt="18:00" price={190.90} busy={false} />
						<CourtAvailibility startsAt="19:00" endsAt="20:00" price={190.90} busy={false} />
						<CourtAvailibility startsAt="20:00" endsAt="21:00" price={190.90} busy={false} />
						<CourtAvailibility startsAt="21:00" endsAt="22:00" price={190.90} busy={true} />
						<CourtAvailibility startsAt="22:00" endsAt="23:00" price={190.90} busy={false} />
						<CourtAvailibility startsAt="23:00" endsAt="00:00" price={190.90} busy={false} />
					</ScrollView>
					<View className="h-fit w-full p-[15px] mt-[30px]">
						<TouchableOpacity className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'>
							<Text className='text-white'>RESERVAR</Text>
						</TouchableOpacity>
					</View>
					<BottomBlackMenu />
				</View>
			}
		</SafeAreaView>
	)
}