import * as z from "zod";

// values
let values = [
    {
        name: "to",
        placeholder: "mail@domain.com"
    },
    {
        name: "subject",
        placeholder: "Mail subject"
    },
    {
        name: "cc",
        placeholder: "mail@domain.com",
        subtitle: "Separate with commas  if there are multiple"
    },
    {
        name: "text",
        placeholder: "Type your message here",
        textarea: true
    },
]; 

let defaultValues = {
    to: "",
    subject: "",
    cc: "",
    text: ""
}

const newMailFormSchema = z.object({
    to: z.string().min(1, {message: "Mail must have a to value."}),
    subject: z.string().min(1, {message: "Mail must have a subject valuen."}),
    cc: z.string(),
    text: z.string().min(1, {message: "Mail must have a message."}),
});

export default values; 
type NewMailFormValues = z.infer<typeof newMailFormSchema>; 
export {newMailFormSchema, defaultValues};
export type {NewMailFormValues};