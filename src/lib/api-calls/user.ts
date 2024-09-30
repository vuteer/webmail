import {getDoc, patchDoc, postDoc} from '@/utils/api-calls';

// get user
export const getUser = async (log?: boolean) => {
    let res = await getDoc(`/users`, log) ;
    return res?.data || false
}

// finalize user setup
export const finalizeUserSetup = async (data: any) => {
    let res = await postDoc("/users/finalize/setup", data, true); 
    return res?.status === "success" || false; 
}

// get user settings page 
export const getUserSettings = async () => {
    let res = await getDoc("/users/settings", true); 
    return res?.data || false; 
}

//update user settinngs 
export const updateUserSettings = async (field: "notifications_preferences" | "security_preferences", data: any) => {
    let res = await patchDoc(`/users/settings/${field}`, data, true);
    return res?.status === "success";
}

// TO BE SETUP
export const updateUser = async (data: any) => {
    let res = await patchDoc(`/users/details`, data, true);
    return res?.status === 'success' || false; 
}

export const updatePassword = async (data: any) => {
    let res = await patchDoc(`/users/password`, data, true);
    return res?.status === 'success' || false; 
}
