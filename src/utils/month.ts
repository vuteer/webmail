import dayjs from "dayjs";

export function getMonth(month = dayjs().month(), year?: number) {
  month = Math.floor(month);
  year = year || dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}; 

export function getYear(year = dayjs().year()) {
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(getMonth(i, year))
  }
  return months; 
}