// file endpoints
import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 

// get files 
export const getFiles = async (folder?: string) => {
    let res = await getDoc(`/files${folder && "?folder=" + folder}`, true);
    return res?.data || false;
}