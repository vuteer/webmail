

export type EventType = {
    id: string; 
    title: string; 
    date: Date; 
    group: boolean; 
    target?: string[]; 
    updatedAt?: Date;
    createdBy: string; 
}