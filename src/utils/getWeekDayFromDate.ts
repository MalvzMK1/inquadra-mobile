import {EWeekDays} from "../graphql/mutations/availabilityByWeekDay";
import {format, parseISO} from "date-fns";
import {enUS} from "date-fns/locale";

export default function getWeekDayByDateISOString(dateISOString: string): EWeekDays {
	const [date] = dateISOString.split("T");
	const dateParsed = parseISO(date);

	const weekDay = format(dateParsed, "EEEE", {locale: enUS});

	return weekDay as unknown as EWeekDays;
}
