export function transformDate(date: Date): string {
	let localeDate: string = date.toLocaleDateString('en-us');
	return `${localeDate.split('/')[2]}-${localeDate.split('/')[0]}-${localeDate.split('/')[1]}`
	// YYYY-MM-DD
}
