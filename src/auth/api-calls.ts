import { postDoc, patchDoc} from '@/utils/api-calls';

export const login = async (data: {email: string, password: string}) => {
  const res = await postDoc (`/auth/login`, data, true);
  if (res?.status === "success") {
    let user = res.data; 
    let token = res.token; 
    return {user, token}; 
  }  
  return null; 
};
 

 export const forgotPassword = async (data: {email: string}) => {
  const res = await patchDoc(`/auth/password/forgot`, data, true);
  if (res?.status === "success") return true; 
  return false; 
 }
