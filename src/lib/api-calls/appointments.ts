import { getDoc, postDoc, patchDoc } from "@/utils/api-calls";

// get week appointments

export const getWeekAppointments = async (week: number, year: number) => {
    let res = await getDoc(`/appointments/week?w=${week}&y=${year}`, true); 
    return res?.data || false; 
};

// create appointment 
export const createAppointment = async (data: any) => {
    let res = await postDoc(`/appointments`, data, true); 
    return res?.data.doc || false; 
};

// get single appointment 
export const getAppoitment = async (appointmentId: string) => {
    let res = await getDoc(`/appointments/${appointmentId}`, true); 
    return res?.data || false; 
};

// update appointment
export const updateAppointment = async (appointmentId: string, data: any) => {
    let res = await patchDoc(`/appointments/${appointmentId}`, data, true); 
    return res?.status === "success"; 
};

// cancel and appointment 
export const cancelAppointment = async (appointmentId: string) => {
    let res = await patchDoc(`/appointments/${appointmentId}`, {}, true);
    return res?.status === "success"; 
}
