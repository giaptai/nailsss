import dayjs from "dayjs";

export const formatDateToFormatString = (datetime: string, format: string) => {
	const formated = dayjs(datetime).format(format);
	return formated;
};
export const currentDateTimeInFormat = (format: string) => {
	return dayjs().format(format);
};
export const addHoursToDate = (currentDate: string, hoursToAdd: number) => {
	hoursToAdd = hoursToAdd || 0;
	const futureOfDate = new Date(currentDate);
	futureOfDate.setHours(futureOfDate.getHours() + hoursToAdd);
	return futureOfDate;
};
export const addMinutesToDate = (currentDate: string, minutesToAdd: number) => {
	minutesToAdd = minutesToAdd || 0;
	const futureOfDate = new Date(currentDate);
	//console.log("Begin: ",futureOfDate)
	futureOfDate.setMinutes(futureOfDate.getMinutes() + minutesToAdd);
	//console.log("After:",futureOfDate)
	return futureOfDate;
};
export const parseDateToParams = (date: Date) => {
	//console.log(date)
	const currentLocalTime = date.toLocaleString();
	//console.log("currentLocalTime",currentLocalTime)
	const timeInArray = currentLocalTime.split(" ");
	const currentTimeShift = timeInArray[2] ?? "";
	const currentTimeString = timeInArray[1];
	const currentDate = timeInArray[0];
	const currentHourShift = currentTimeString.split(":")[0].padStart(2, "0") + ":00" + currentTimeShift.toLowerCase();
	return {
		timeShift: currentTimeShift,
		dateString: currentDate,
		startOfDate: new Date(currentDate),
		hourShift: currentHourShift,
		hourString: currentTimeString.split(":").splice(0, 2).join(":") + currentTimeShift.toLowerCase(),
	};
};
