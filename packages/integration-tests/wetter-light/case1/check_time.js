export function getMonthFromString(input) {
	return /\.(\d{1,2})\s/.exec(input)[1] - 1;
}

export function getDayFromString(input) {
	return /\s(\d{1,2})\./.exec(input)[1];
}

export function getHourFromString(input) {
	return /\s(\d{1,2}):/.exec(input)[1];
}

export function getMinuteFromString(input) {
	return /:(\d{1,2})$/.exec(input)[1];
}

export function isUpdateTimeBelowThresholdinMinutes(input, threshold) {
	Logger.logInfo("!!!!!!!!INPUT: " + input);
	var currentTime = new Date();
	var updateTime = new Date();

	var updateMonth = getMonthFromString(input);
	Logger.logInfo(updateMonth);
	var updateDay = getDayFromString(input);
	Logger.logInfo(updateDay);

	var updateHour = getHourFromString(input);
	Logger.logInfo(updateHour);
	var updateMinute = getMinuteFromString(input);
	Logger.logInfo(updateMinute);

	updateTime.setMonth(updateMonth);
	updateTime.setDate(updateDay);
	updateTime.setHours(updateHour);
	updateTime.setMinutes(updateMinute);

	Logger.logInfo(currentTime);
	Logger.logInfo(updateTime);

	var diff = (currentTime - updateTime) / (1000 * 60);
	Logger.logInfo("Time since last update: " + diff + " minutes.");

	if (diff > threshold) {
		throw new Error("No update for over " + threshold + " minutes. Got " + diff);
	}
}