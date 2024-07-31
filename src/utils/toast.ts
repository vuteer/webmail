// create a toast notification using the sonner toast function
import { toast } from 'sonner';

type toastMessage = "error" | "success"; 

export const createToast = (type: toastMessage, message: string) => {

    try {
        toast[type](message); 
    } catch (err) {}
}
