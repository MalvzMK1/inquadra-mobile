// This function will transform the date from MM/YY to MM/YYYY

export function transformCardExpirationDate(expirationDate: string): string {
	const splittedDate = expirationDate.split('/');

	if (splittedDate.length === 2) {
		const [month, year] = splittedDate;

		if (month.length === 2 && year.length === 2) {
			const completeYear = '20' + year; // Assumindo que o ano é sempre em 2 dígitos e representando o século atual.
			return month + '/' + completeYear;
		}
	} else {
		throw new Error('A data não está no formato esperado: MM/YY')
	}
}