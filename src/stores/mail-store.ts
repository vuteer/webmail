
import { MailType } from '@/types';
import { create } from 'zustand';

type MailStoreState = {
    deletedMails: string[]; 
    newMails: MailType[]; 
    addDeletedThreads: (threadId: string) => void; 
    addNewThread: (mail: MailType) => void; 
};

export const useMailStoreState = create<MailStoreState>((set, get) => ({
    deletedMails: [],
    newMails: [],
    addDeletedThreads: (threadId: string) => {
        let mails = get().deletedMails; 
        if (!mails.includes(threadId)) mails.push(threadId); 
        set({deletedMails: mails}); 
        setTimeout(() => {
            set({deletedMails: mails.filter(ml => ml !== threadId)}); 
        }, 2000)
    },
    addNewThread: (mail: MailType) => {
        let mails = get().newMails; 
        let check = mails.filter(ml => ml.id === mail.id);
        if (check.length === 0) {
            set({newMails: [...mails, mail]}); 

            setTimeout(() => {
                set({newMails: mails})
            }, 1000)
        }
    }
}))