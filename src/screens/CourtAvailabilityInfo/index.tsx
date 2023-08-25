import { View, Text, ImageBackground, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import React, { useState, useEffect } from 'react'
import WeekDayButton from "../../components/WeekDays"
import CourtAvailibility from "../../components/CourtAvailibility"
import BottomBlackMenu from "../../components/BottomBlackMenu"
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars'
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDays, format } from 'date-fns'
import useCourtAvailability from "../../hooks/useCourtAvailability";
import FilterDate from "../../components/FilterDateCourtAvailability"
import { useFocusEffect } from "@react-navigation/native"

interface ICourtAvailabilityInfoProps extends NativeStackScreenProps<RootStackParamList, 'CourtAvailabilityInfo'> { }

LocaleConfig.locales['pt-br'] = {
	monthNames: [
		'Janeiro',
		'Fevereiro',
		'Março',
		'Abril',
		'Maio',
		'Junho',
		'Julho',
		'Agosto',
		'Setembro',
		'Outubro',
		'Novembro',
		'Dezembro'
	],
	monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
	dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
	today: 'Hoje'
};

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];




export default function CourtAvailabilityInfo({ navigation, route }: ICourtAvailabilityInfoProps) {
	const {
		data: courtAvailability,
		loading: isCourtAvailabilityLoading,
		error: isCourtAvailabilityError
	} = useCourtAvailability(route.params.courtId)

	const [activeStates, setActiveStates] = useState(Array(courtAvailability?.court.data.attributes.court_availabilities.data.length).fill(false))
	const [dateSelector, setDateSelector] = useState(`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`)
	const [selectedWeekDate, setSelectedWeekDate] = useState<string>()
	const [availabilities, setAvailabilities] = useState<Array<{
		startsAt: string,
		endsAt: string,
		price: number,
		busy: boolean,
		weekDays: string,
		scheduling: string
	}>>([])
	const [showCalendar, setShowCalendar] = useState(false)
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedWeekDateByDays, setSelectedWeekDateByDay] = useState<number>(new Date().getDay())

	LocaleConfig.defaultLocale = 'pt-br';

	useFocusEffect(
		React.useCallback(() => {
			setAvailabilities([])
			if (!isCourtAvailabilityLoading && !isCourtAvailabilityError) {

				const courtsAvailable = courtAvailability?.court.data.attributes.court_availabilities.data.map((availability) => {
					// availability.attributes.schedulings.data.map((item) => {
						// return item
						console.log(availability.attributes.schedulings.data[0]);
						
						return {
							startsAt: availability.attributes.startsAt,
							endsAt: availability.attributes.endsAt,
							price: availability.attributes.value,
							busy: availability.attributes.status,
							weekDays: availability.attributes.weekDay,
							// scheduling: item ? item.attributes.date : ""
						}
					// })
				})

				if (courtAvailability) {
					setAvailabilities(prevState => [...prevState, ...courtsAvailable])
				}

			}
		}, [isCourtAvailabilityLoading, isCourtAvailabilityError])
	)

	function handleCalendarClick(data: DateData) {
		const date = new Date(data.dateString)
		setSelectedWeekDateByDay(date.getDay())
		const dayOfWeek = date.getDay();
		const dayName = dayNames[dayOfWeek];

		setSelectedWeekDate(dayName)
		setSelectedDate(date)
		setDateSelector(`${String(date.getDate() + 1).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`)
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
									<FilterDate dateSelector={dateSelector} setDateSelector={setDateSelector} />
								</View>
							)}
							{showCalendar && (
								<Calendar
									className="h-fit w-96"
									current={new Date().toISOString().split('T')[0]}
									onDayPress={handleCalendarClick}
									minDate={new Date().toISOString()}
									markedDates={{
										[selectedDate.toISOString().split('T')[0]]: { selected: true, disableTouchEvent: true, selectedColor: '#FF6112' }
									}}
									theme={{
										arrowColor: "#FF6112",
										todayTextColor: "#FF6112"
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

							availabilities.length > 0 ? (
								availabilities.map((item) => {
									const startsAt = item.startsAt.split(':');
									const endsAt = item.endsAt.split(':');


									if (selectedWeekDate == item.weekDays) {
										return <CourtAvailibility
											startsAt={`${startsAt[0]}:${startsAt[1]}`}
											endsAt={`${endsAt[0]}:${endsAt[1]}`}
											price={item.price}
											busy={!item.busy}
										/>
									}
								})

							)
								:
								<Text className="text-xl font-black text-center">No momento não é possivel Alugar essa quadra</Text>
						}
					</ScrollView>
					<View className="h-fit w-full p-[15px] mt-[30px]">
						<TouchableOpacity
							className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'
						// onPress={() => navigation.navigate('ReservationPaymentSign', {
						// 	courtName: route.params.courtName,
						// 	courtImage: route.params.courtImage,
						// 	courtId: route.params.courtId,
						// 	userId: route.params.userId
						// })}
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