import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 


// search contact 
export const searchContact = async (q: string, page?: string, limit?: string) => {
    let res = await getDoc(`/contacts/search?q=${q}&page=${page || 0}&limit=${5}`, true); 
    return res?.data || false; 
}

// get user contacts
export const getContacts = async (page?: string, limit?: string) => {
    let res = await getDoc(`/contacts?page=${page || 0}&limit=${limit || 30}`);
    return res?.data || false; 
};

// save contact 
export const saveContact = async (data: any) => {
    let res = await postDoc(`/contacts`, data, true); 
    return res?.status === "success" || false; 
}; 

// update contact 
export const updateContact = async (contactId: string, data: any) => {
    let res = await patchDoc(`/contacts/${contactId}`, data, true); 
    return res?.status === "success" || false; 
};


// delete contact
export const deleteContact = async (contactId: string) => {
    let res = await deleteDoc(`/contacts/${contactId}`, true); 
    return res?.status === "success" || false; 
}