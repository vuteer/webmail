import { create } from 'zustand';
import { AppointmentType } from "@/types"; 

type AppointmentStateType = {
    appointments: AppointmentType[];
    count: number; 
    addAppointments: (appointments: AppointmentType[]) => void; 
    addAppointment: (appointment: AppointmentType) => void; 
};

export const appointmentStateStore = create<AppointmentStateType>((set, get) => ({
    appointments: [],
    count: 0, 
    addAppointment: (appointment: AppointmentType) => {
        let appointments = get().appointments; 
        let currCount = get().count; 

        set({appointments: [appointment, ...appointments.filter(app => app.id !== appointment.id)]}); 
        set({count: currCount + 1});
    },
    addAppointments: (appointments: AppointmentType[]) => {
        set({appointments});
        set({count: appointments.length})
    }
}))