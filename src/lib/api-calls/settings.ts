import { getDoc, patchDoc } from "@/utils/api-calls";

// get user settings page
export const getUserSettings = async () => {
  let res = await getDoc("/settings", true);
  return res?.data || false;
};

//update user settinngs
export const updateUserSettings = async (
  // field: "notifications_preferences" | "security_preferences",
  data: any,
) => {
  let res = await patchDoc(`/settings`, data, true);
  return res?.status === "success";
};
