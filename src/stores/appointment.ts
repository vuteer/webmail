import { create } from 'zustand';
import { AppointmentType } from "@/types"; 

type AppointmentStateType = {
    appointments: AppointmentType[];
    addAppointments: (appointments: AppointmentType[]) => void; 
    addAppointment: (appointment: AppointmentType) => void; 
};

export const appointmentStateStore = create<AppointmentStateType>((set, get) => ({
    appointments: [],
    addAppointment: (appointment: AppointmentType) => {},
    addAppointments: (appointments: AppointmentType[]) => {}
}))