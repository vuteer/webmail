import * as z  from "zod";

// auth schemas
const loginFormSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
});

const signUpFormSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}),
    name: z.string().min(1, {message: "You have to enter a name"}),
    // phone: z.string().min(10, {message: "Enter valid phone number"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    passwordConfirm: z.string().min(6, {message: "Re-enter the password!"})
});
const resetFormSchema = z.object({
    password: z.string().min(1, {message: "Password is required"}),
    passwordConfirm: z.string().min(1, {message: "Password is required"}),
    
});
const forgotPasswordFormSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}),
});

const activateFormSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}),
});

const getSchema: (screen: string) => any = (screen) => {
    let formSchema = screen === 'login' ? loginFormSchema: 
        screen === 'register' ? signUpFormSchema:
        screen === 'reset' ? resetFormSchema: 
        screen === 'forgot' ? forgotPasswordFormSchema:
        activateFormSchema; 
    
    return formSchema; 
};

const getValues: (screen: string) => any = screen => {
    let values;

    if (screen === 'login') values = {email: "", password: ""};
    if (screen === 'register') values = {email: "", name: "", phone: "", password: "", passwordConfirm: ""};
    if (screen === 'reset') values = {password: "",passwordConfirm: ""};

    if (screen === 'forgot') values = {email: ""};
    if (screen === 'welcome') values = {email: ""};

    return values; 

}

export {
    getValues,
    getSchema
}