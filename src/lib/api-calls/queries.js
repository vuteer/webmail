
import { getDoc, postDoc } from '@/utils/api-calls';

// get user queries
export const getUserQueries = async (page) => {
    let res = await getDoc(`/query?page=${page || 0}`, true); 
    return res?.data || false; 
}

// make query
export const makeQuery = async (data) => {
    let res = await postDoc(`/query/${data.reference}`, data, true);
    return res?.data || false; 
}


// get query items

export const getQueryItems = async (ref, page) => {
    let res = await getDoc(`/query/list/${ref}?page=${page}`, true); 
    return res?.data || false; 
}