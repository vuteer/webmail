// events api

import { getDoc, postDoc, deleteDoc, patchDoc } from "@/utils/api-calls";

export const createEvent = async (data: any) => {
  let res = await postDoc(`/events`, data, true);
  return res?.data || false;
};

export const getEvents = async (query?: string) => {
  let res = await getDoc(`/events?${query ? query : ""}`, true);
  return res?.data || false;
};

export const getUpcomingEvents = async () => {
  let res = await getDoc("/events/upcoming", true);

  return res?.data?.docs || false;
};

export const updateEvent = async (
  eventURL: string,
  calendarId: string,
  data: any,
) => {
  let res = await patchDoc(
    `/events/${eventURL}?calendarId=${calendarId}`,
    data,
    true,
  );
  return res?.success ? res.data : false;
};

export const deleteEvent = async (eventId: string) => {
  let res = await deleteDoc(`/events/${eventId}`, true);
  return res?.success;
};
