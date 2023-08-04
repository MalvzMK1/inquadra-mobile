import {addDays, format} from 'date-fns'
import {ptBR} from 'date-fns/locale'

export function getWeekDays(date: Date, weeksOffset: number = 0): Array<FormatedWeekDates> {
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