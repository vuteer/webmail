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

export const getRecentEvents = async () => {
    let res = await getDoc("/events/recent", true); 
    return res?.data?.docs || false; 
};

export const updateEvent = async (eventId: string, data: any) => {
    let res = await patchDoc(`/events/${eventId}`, data, true); 
    return res?.status === "success"; 
};

export const cancelEvent = async (eventId: string) => {
    let res = await patchDoc(`/events/cancel/${eventId}`, {}, true)
    return res?.status === "success"; 
}