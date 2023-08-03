export function getWeekDates(date: Date) {
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - dayOfWeek);
    const weekDates: Date[] = [startDate];

    for (let i = 1; i < 7; i++) {
        const nextDay = new Date(startDate);
        nextDay.setDate(startDate.getDate() + i);
        weekDates.push(nextDay);
    }

    let formatedWeekDates: FormatedWeekDates[] = []

    weekDates.forEach(item => {
        let dateItem: string = item.toISOString().split("-")[2].split("T")[0].toString()

        formatedWeekDates.push({
            dateItem
        })
    })

    return formatedWeekDates;
};