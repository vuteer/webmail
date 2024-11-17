import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 

// search contact for prediction 
export const searchContact = async (q: string) => {
    let res = await getDoc(`/contacts/search?q=${q}`, true); 
    return res?.data || false; 
}
// get user contacts
export const getContacts = async (type: string, page?: string, limit?: string, q?: string) => {
    let url = `/contacts?`; 
    if (page) url = url + `page=${page}&`;
    if (limit) url = url + `limit=${limit}&`; 
    if (type) url = url + `type=${type}&`; 
    if (q) url = url + `q=${q}`; 

    let res = await getDoc(url);
    return res?.data || false; 
};

// save contact 
export const saveContact = async (data: any) => {
    let res = await postDoc(`/contacts`, data, true); 
    return res?.data?.doc || false; 
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