import {login, forgotPassword} from "../api-calls"; 
import {createToast} from "@/utils/toast";
// import { validatePhone } from "@/utils/validation";
import { signInFunctionParams } from "../authTypes";

const handleSubmit = async (
    data: any, screen: string, setLoading: React.Dispatch<boolean>,
    push: (path: string) => void, refresh: () => void, token: string, 
    setMessage: React.Dispatch<string>, signIn: (signInConfig: signInFunctionParams) => void,
    admin?: boolean
) => {
            let res; 
    
            setLoading(true); 
    
            if (screen === 'login') {
                res = await login(data); 
                if (res) {
                    signIn({
                        token: res.token, 
                        expiresIn: 60 * 60 * 1000, 
                        tokenType: 'Bearer',
                        authState: res.user, 
                        // refreshToken: res.session, 
                        // refreshTokenExpireIn: 60 * 60 * 1000,
                    }); 
                    createToast("success", "Login successful");
                    push("/?sec=inbox")
                     
                    refresh();
                }
            }   else if (screen === 'forgot') {
                // hanndle forgot password from backend first
                res = await forgotPassword({email: data.email});
                if (res) {
                    createToast("success", "Password sent to your phone!"); 
                    push("/auth/login")
                }
                 
            }
    
            setLoading(false); 

}

export {
    handleSubmit
}