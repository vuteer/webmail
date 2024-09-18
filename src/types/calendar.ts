

export type EventType = {
    id: string; 
    title: string; 
    date: Date; 
    time: string; 
    status: "active" | "cancelled"; 
    group: boolean; 
    list?: string[]; 
    updatedAt?: Date;
    createdBy: string; 
}