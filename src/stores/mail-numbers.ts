import { getNumbers } from "@/lib/api-calls/mails";
import { create } from "zustand";

type MailNumbers = {
  unread: number;
  inbox: number;
  drafts: number;
  outbox: number;
  sent: number;
  archive: number;
  junk: number;
  trash: number;
  addToNumber: (category: MailCategory) => void;
  lessFromNumber: (category: MailCategory, value: number) => void;
  setInitialNumbers: () => Promise<void>;
};

export type MailCategory = "inbox" | "drafts" | "junk" | "unread";

export const useMailNumbersStore = create<MailNumbers>((set, get) => ({
  unread: 0,
  inbox: 0,
  drafts: 0,
  outbox: 0,
  sent: 0,
  archive: 0,
  junk: 0,
  trash: 0,
  setInitialNumbers: async () => {
    let res = await getNumbers();
    set({ unread: res.inbox?.unread || 0 });
    set({ inbox: res.inbox?.total });
    set({ drafts: res.drafts?.total });
    set({ outbox: res.outbox?.total });
    set({ sent: res.sent?.total });
    set({ archive: res.archive?.total });
    set({ junk: res.junk?.total });
    set({ trash: res.trash?.total });
  },
  addToNumber: (category: MailCategory) => {
    const state = get();

    const mail =
      category === "inbox"
        ? state.inbox
        : category === "drafts"
          ? state.drafts
          : 1;
    let count = mail + 1;
    set({ [category]: count });
  },
  lessFromNumber: (category: MailCategory, value: number) => {
    const state = get();

    const mail =
      category === "inbox"
        ? state.inbox
        : category === "drafts"
          ? state.drafts
          : 1;
    let count = mail - value;
    if (count < 0) count = 0;
    set({ [category]: count });
  },
}));
