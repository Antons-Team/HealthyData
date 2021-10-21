export const renderName: (name: string) => string = function (
  name: string,
): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const displayTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const am = hours >= 12 ? 'PM' : 'AM';
  hours %= 12;
  hours = hours ? hours : 12;
  const hoursStr = hours < 10 ? '0' + hours : hours;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hoursStr}:${minutesStr} ${am}`;
};

export const displayDate = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const monthStr = month < 10 ? '0' + month : month;
  const dayStr = day < 10 ? '0' + day : day;

  return `${dayStr}/${monthStr}/${year}`;
};