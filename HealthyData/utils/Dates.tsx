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
