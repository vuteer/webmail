import {getDoc, postDoc, patchDoc} from '@/utils/api-calls';

export const login = async (data) => {
    const res = await postDoc (`/auth/login`, data, true);
    if (res?.status === "success") {
      let user = res.data; 
      let token = res.token; 
      return {user, token}; 
    }  
    return null; 
};

// export const registerUser = async (data) => {
//     const res = await postDoc (`/auth/register`, data, true);
//     return res?.status === "success" || false; 
// };

// export const activateUser = async (token) => {
//   const res = await getDoc(`/auth/activate?token=${token}`)
//   return res;  
// }
// export const requestActivationToken = async (email) => {
//   const res = await postDoc(`/auth/request-token`, {email}, true); 
//   return res?.status === 'success'|| false;  
// }

// export const requestPasswordToken = async (data) => {
//   const res = await patchDoc(`/auth/password?type=forgot`, data, true); 
//   if (res?.status === 'success')  return res.message; 
//   return false; 
// }

// export const resetPassword = async (data, token) => {
//   const res = await patchDoc(`/auth/password?type=reset&token=${token}`, data, true); 
//   if (res?.status === "success") return res.message; 
//   return false; 
// }
