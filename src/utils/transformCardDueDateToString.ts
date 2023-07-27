export function transformCardDueDateToString(inputText: string): Date {
	const [month, year] = inputText.split('/').map((part) => parseInt(part, 10));

	if (isNaN(month) || isNaN(year)) {
		throw new Error("Invalid input date format. Expected format: MM/YY");
	}

	const fullYear = 2000 + year;

	const transformedDate = new Date(fullYear, month - 1);

	if (isNaN(transformedDate.getTime())) {
		throw new Error("Invalid date.");
	}

	return transformedDate;
}
