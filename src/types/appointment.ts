export type WithType = {
    name: string; 
    phone?: string; 
    email?: string; 
}; 

export type AppointmentStatusType = "active" | "cancelled"; 

export type AppointmentType = {
    id: string;
    title: string; 
    time: string; 
    date: Date; 
    createdAt: Date;
    with: WithType[];
    status: AppointmentStatusType; 
    google_meet?: string; 
    google_meet_password?: string;
    zoom_url?: string;
    zoom_password?: string;
}