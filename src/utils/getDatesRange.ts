export default function getDatesRange(initialDate: string, endDate: string) {
	try {
		const dates: string[] = [];

		const initial = new Date(initialDate);

		if (endDate == "") {
			dates.push(new Date(initial).toISOString().split("T")[0]);
			return dates;
		} else {
			const end = new Date(endDate);

			while (initial <= end) {
				dates.push(new Date(initial).toISOString().split("T")[0]);
				initial.setDate(initial.getDate() + 1);
			}

			return dates;
		}
	} catch(error) {
		throw new Error(String(error));
	}
}
