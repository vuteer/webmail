// file endpoints
import { FileType } from "@/types";
import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 

// get files 
export const getFiles = async (folder?: string, q?: string) => {
    let url = `/files?`;
    if (folder)  url = url + `folder=${folder}&`; 
    if (q) url = url + `q=${q}`; 

    let res = await getDoc(url, true);
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

//  delete file
export const deleteFile = async (fileId: string) => {
    let res = await deleteDoc(`/files/${fileId}`, true); 
    return res?.status === "success" || false; 
};

// share file
export const shareFile = async (fileId: string, data: {visibility: FileType, shared?: string[]}) => {
    let res = await patchDoc(`/files/shared/${fileId}`, data, true); 
    return res?.status === "success" || false; 
}

// update file 
export const renameFile = async (fileId: string, title: string) => {
    let res = await patchDoc(`/files/${fileId}`, {title}, true); 
    return res?.status === "success"; 
}