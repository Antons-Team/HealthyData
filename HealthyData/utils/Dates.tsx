export const addDays = function (days: number, date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const compareByTime = (time1: Date, time2: Date): number => {
  if (time1.getHours() != time2.getHours()) {
    return time1.getHours() - time2.getHours();
  }
  return time1.getMinutes() - time2.getMinutes();
};

export const daysOfTheWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

export const compareByDate = (date1: Date, date2: Date): number => {
  if (date1.getFullYear() != date2.getFullYear()) {
    return date1.getFullYear() - date2.getFullYear();
  } else if (date1.getMonth() != date2.getMonth()) {
    return date1.getMonth() - date2.getMonth();
  } else {
    return date1.getDate() - date2.getDate();
  }
};