import { deleteDoc, getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get mail numbers
export const getCalendars = async () => {
  let res = await getDoc(`/calendar`, true);
  return res?.data || false;
};
