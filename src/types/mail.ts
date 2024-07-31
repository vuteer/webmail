// mail type

export type ContactType = {
    id: string; 
    avatar: string;
    name: string; 
    saved: boolean; 
    email: string; 
}
export type FileType = "audio" | "document" | "other" | "PDF" | "image" | "video" | "excel"| "CSV" | "zip" | "folder"; 
export type AttachmentType = {
    id: string; 
    title: string; 
    size: number; 
    type: FileType; 
    visibility?: "public" | "pulic"; 
    createdAt: Date;
}

export type MailType = {
    messageId: string; 
    id: string; 
    text: string; 
    html?: string; 
    info: ThreadInfoType; 
    createdAt: Date; 
    attachments?: AttachmentType[]; 
}
export type ThreadType =  {
    id: string; 
    from: ContactType;
    subject: string; 
    attachments?: number; 
    last_message?: MailType; 
    createdAt: Date; 
    unread: number; 
    info?: ThreadInfoType; 
 
}

export type ThreadInfoType = {
    archived: boolean; 
    important: boolean; 
    junk: boolean; 
    starred: boolean; 
    flag: boolean; 
    trashed: boolean; 
    forwarded?: boolean; 
    draft?: boolean;
    sent?: boolean; 
    read?: boolean; 
}