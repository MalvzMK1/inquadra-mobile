function validateBRDate(date: string, splitter: '-' | '/' = '-'): boolean {
	const splittedDate = date.split(splitter)

	return (
		splittedDate.length === 3 &&
		splittedDate[2].length === 4 &&
		splittedDate[1].length === 2 &&
		splittedDate[0].length === 2 &&
		Number(splittedDate[0]) >= 1 &&
		Number(splittedDate[0]) <= 31 &&
		Number(splittedDate[1]) >= 1 &&
		Number(splittedDate[1]) <= 12
	)
}

export default function parseBRDateToEUADate(date: string): string {
	if (!validateBRDate(date)) throw new Error('Por favor, forneça uma data no formato brasileiro');

	const dateToBeParsed = date;
	let splitter: '-' | '/' | undefined = undefined;

	if (dateToBeParsed.includes('-')) splitter = '-';
	else if (dateToBeParsed.includes('/')) splitter = '/';

	if (splitter) {
		const splittedDate = dateToBeParsed.split(splitter);

		if (splittedDate.length === 3) {
			const parsedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`

			return parsedDate;
		} else throw new Error('A data precisa estar formatada corretamente\nFormat. DD-MM-YYYY');
	} else throw new Error('A data precisa ser separada com "-" ou com "/"');
}
