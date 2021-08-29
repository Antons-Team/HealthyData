export const addDays = function(days: number, date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};