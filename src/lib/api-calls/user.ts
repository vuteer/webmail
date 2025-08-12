import { getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get user
export const getUser = async (log?: boolean) => {
  let res = await getDoc(`/users`, log);
  return res?.data || false;
};

// finalize user setup
export const finalizeUserSetup = async (data: any) => {
  let res = await postDoc("/users/finalize/setup", data, true);
  return res?.status === "success" || false;
};

// TO BE SETUP
export const updateUser = async (data: any) => {
  let res = await patchDoc(`/users/details`, data, true);
  return res?.status === "success" || false;
};

export const updatePassword = async (data: any) => {
  let res = await patchDoc(`/users/password`, data, true);
  return res?.status === "success" || false;
};

export const updateUserPassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  let res = await patchDoc(`/users/update/password/first-time`, data, true);

  if (res.status === "fail") {
    throw Error(res.message);
  }
  return true;
};
