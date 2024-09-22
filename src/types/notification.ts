type NotificationType = {
    id: string; 
    from: string; 
    thread: string; 
    subject: string; 
    createdAt: Date; 
    new: boolean; 
    messageId: string; 
    text: string; 
    type: "mail" | "event" | "appointment"; 
}

export default NotificationType