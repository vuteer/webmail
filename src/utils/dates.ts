// formatting dates to user friendly values; 

import {format, formatRelative, formatDistance} from 'date-fns'; 

export const formatDateToString = (date: Date | string) => {
  return format(new Date(date), "MMM dd, yyyy")
}

export const formatDateRelative = (date: Date | string) => `${format(new Date(date), "MMM dd, yyyy - H:mm:ss a")}`

export const formatDateDistance = (date: Date | string) => formatDistance(new Date(date), new Date(), { addSuffix: true })


export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const getCurrentMonth = (num: number) => {
  if (num > 12) return null;
  return months[num];
};
let today = new Date();
export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};
export const currentMonthDays = getDaysInMonth(
  today.getFullYear(),
  today.getMonth()
);
