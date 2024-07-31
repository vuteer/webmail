import {getDoc, patchDoc, postDoc} from '@/utils/api-calls';

// get user
export const getUser = async (log = true) => {
    let res = await getDoc(`/users`, log) ;
    return res?.data || false
}

// finalize user setup
export const finalizeUserSetup = async (data) => {
    let res = await postDoc("/users/finalize/setup", data, true); 
    return res?.status === "success" || false; 
}



// TO BE SETUP
export const updateUser = async (data) => {
    let res = await patchDoc(`/users?type=details`, data, true);
    return res?.status === 'success' || false; 
}

export const updatePassword = async (data) => {
    let res = await patchDoc(`/users?type=password`, data, true);
    return res?.status === 'success' || false; 
}
