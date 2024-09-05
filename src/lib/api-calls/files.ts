// file endpoints
import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 

// get files 
export const getFiles = async (folder?: string) => {
    let res = await getDoc(`/files${folder && "?folder=" + folder}`, true);
    return res?.data || false;
}

export const getFile = async (fileId: string) => {
    let res = await getDoc(`/files/${fileId}`, true); 
    return res?.data || false; 
}

// create folder
export const createFolder = async (title: string, folder?: string) => {
    let res = await postDoc(`/files/folder`, {title, folder}, true);
    return res?.data || false
}