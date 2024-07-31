import * as z  from "zod";

// values
let values = [
    {
        name: "email",
        placeholder: "name@domain.com"
    },
    {
        name: "password",
        placeholder: "************",
        type: "password"
    }
]

let defaultValues = {
    email: "",
    password: ""
}

// auth schemas
const loginFormSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})
});

type LoginFormValues = z.infer<typeof loginFormSchema>; 


export {values, loginFormSchema, defaultValues}
export type {LoginFormValues}