import parse from "html-react-parser";
import { create } from "zustand";
import { getMails } from "@/lib/api-calls/mails";
import { MailType, ThreadType } from "@/types";

type MailStoreState = {
  mails: MailType[];
  mailsLoading: boolean;
  fetchThreads: (threadId: string, page: number, sec: string) => Promise<void>;
  deletedMails: string[];
  newMails: MailType[];
  addDeletedThreads: (threadId: string) => void;
  addNewThread: (mail: MailType) => void;
};

export const useMailStoreState = create<MailStoreState>((set, get) => ({
  mails: [],
  mailsLoading: false,
  fetchThreads: async (threadId: string, page: number, sec: string) => {
    set({ mailsLoading: true });

    let res = await getMails(threadId, page, sec);
    if (res) {
      let docs = res.docs.map((doc: any) => ({
        ...doc,
        html: doc.html ? parse(`${doc.html}`) : null,
      }));
      set({ mails: docs });
    }
    set({ mailsLoading: false });
  },
  deletedMails: [],
  newMails: [],
  addDeletedThreads: (threadId: string) => {
    let mails = get().deletedMails;
    if (!mails.includes(threadId)) mails.push(threadId);
    set({ deletedMails: mails });
    setTimeout(() => {
      set({ deletedMails: mails.filter((ml) => ml !== threadId) });
    }, 2000);
  },
  addNewThread: (mail: MailType) => {
    let mails = get().newMails;
    let check = mails.filter((ml) => ml.id === mail.id);
    if (check.length === 0) {
      set({ newMails: [...mails, mail] });

      setTimeout(() => {
        set({ newMails: mails });
      }, 1000);
    }
  },
}));
