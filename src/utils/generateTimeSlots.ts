export function generateTimeList() {
  const timeList = [];
  let hour = 0;
  let minute = 0;

  while (hour <= 23) {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    timeList.push(`${formattedHour}:${formattedMinute}`);

    minute += 30;
    if (minute >= 60) {
      hour++;
      minute = 0;
    }
  }

  return timeList;
}