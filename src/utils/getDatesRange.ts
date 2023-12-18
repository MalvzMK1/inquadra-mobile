export default function getDatesRange(initialDate: string, endDate: string) {
	const dates: string[] = [];

	let separatedInitialDate = initialDate.split("/");
	const formatedInitialDate = `${separatedInitialDate[2]}-${separatedInitialDate[1]}-${separatedInitialDate[0]}`;
	const initial = new Date(formatedInitialDate);

	if (endDate == "") {
		dates.push(new Date(initial).toISOString().split("T")[0]);
		return dates;
	} else {
		let separatedEndDate = endDate.split("/");
		const formatedEndDate = `${separatedEndDate[2]}-${separatedEndDate[1]}-${separatedEndDate[0]}`;
		const end = new Date(formatedEndDate);

		while (initial <= end) {
			dates.push(new Date(initial).toISOString().split("T")[0]);
			initial.setDate(initial.getDate() + 1);
		}

		return dates;
	}
}
