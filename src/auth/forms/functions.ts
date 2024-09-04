import {login, resetPassword, requestPasswordToken} from "../api-calls"; 
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
            } else if (screen === 'reset') {
                if (data.password !== data.passwordConfirm) {
                    createToast("error", "Passwords do not match.");
                    setLoading(false); 
                    return; 
                }
                res = await resetPassword(data, token, admin); 
                if (res) {
                    createToast("success", res); 
                    push("/auth/login"); 
                }; 
            }  else if (screen === 'forgot') {
                res = await requestPasswordToken(data, admin)
                if (res) createToast('success', res);
            }
    
            setLoading(false); 

}

export {
    // handleActivation,
    handleSubmit
}