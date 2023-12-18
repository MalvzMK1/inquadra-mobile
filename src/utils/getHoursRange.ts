import {addHours, sub} from "date-fns";

export default function getHoursRange(startDate: string, startHour: string, endDate: string, endHour: string) {
	const hours: string[] = [];

	console.log({startHour, endHour, true: false})

	const initialHour = new Date(`${startDate}T${startHour}`);
	const endDateTime = new Date(`${endDate}T${endHour}`);

	const formatedInitialHour = sub(initialHour, {
		hours: 3,
	});

	const formatedEndHour = sub(endDateTime, {
		hours: 3,
	});

	const startDay = Number(startDate.split('-')[2]);
	const endDay = Number(endDate.split('-')[2]);

	console.log(startDay, endDay);

	for (let i = startDay; i <= endDay; i++) {
		while (formatedInitialHour <= formatedEndHour) {
			hours.push(
				new Date(formatedInitialHour)
					.toISOString()
					.split("T")[1]
					.replace("Z", ""),
			);
			formatedInitialHour.setMinutes(formatedInitialHour.getMinutes() + 60);
		}
	}

	return hours;
}