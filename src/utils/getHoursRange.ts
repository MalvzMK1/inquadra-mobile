import {sub} from "date-fns";

export default function getHoursRange(startHour: string, endHour: string) {
	const hours: string[] = [];

	const initialHour = new Date(`2023-09-12T${startHour}`);
	const formatedInitialHour = sub(initialHour, {
		hours: 3,
	});

	const end = new Date(`2023-09-12T${endHour}`);
	const formatedEndHour = sub(end, {
		hours: 3,
	});

	while (formatedInitialHour <= formatedEndHour) {
		hours.push(
			new Date(formatedInitialHour)
				.toISOString()
				.split("T")[1]
				.replace("Z", ""),
		);
		formatedInitialHour.setMinutes(formatedInitialHour.getMinutes() + 60);
	}

	return hours;
}