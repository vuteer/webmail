

export type EventType = {
    id: string; 
    title: string; 
    date: Date; 
    time: string; 
    group: boolean; 
    list?: string[]; 
    updatedAt?: Date;
    createdBy: string; 
}