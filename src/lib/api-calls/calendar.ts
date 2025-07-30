import { deleteDoc, getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get mail numbers
export const getCalendars = async () => {
  let res = await getDoc(`/calendar`, true);
  return res?.data || false;
};

// make calendar
export const makeCalendar = async (cal: {
  name: string;
  description: string;
  color: string;
}) => {
  let res = await postDoc(`/calendar`, cal);
  return res?.data || false;
};

// delete calendar
export const deleteCalendar = async (last_url: string) => {
  let res = await deleteDoc(`/calendar/${last_url}`);

  return res?.data?.url || false;
};

// update calendar
export const updateCalendar = async (
  last_url: string,
  data: { name?: string; color?: string; description?: string },
) => {
  let res = await patchDoc(`/calendar/${last_url}`, data);

  return res?.success;
};

// upda
