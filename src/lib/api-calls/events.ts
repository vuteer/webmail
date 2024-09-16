// events api

import {getDoc, postDoc, deleteDoc, patchDoc} from "@/utils/api-calls"; 

export const createEvent = async (data: any) => {
    let res = await postDoc(`/events`, data, true); 
    return res?.data?.doc; 
};

export const getEvents = async (query: string) => {
    let res = await getDoc(`/events?${query}`, true); 
    return res?.data || false; 
}