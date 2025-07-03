import { create } from "zustand";

type MailNumbers = {
  unread: number;
  inbox: number;
  drafts: number;
  junk: number;
  addToNumber: (category: MailCategory) => void;
  lessFromNumber: (category: MailCategory, value: number) => void;
  setInitialNumbers: (
    inbox: number,
    junk: number,
    drafts: number,
    unread: number,
  ) => void;
};

export type MailCategory = "inbox" | "drafts" | "junk" | "unread";

export const useMailNumbersStore = create<MailNumbers>((set, get) => ({
  unread: 0,
  inbox: 0,
  drafts: 0,
  junk: 0,
  setInitialNumbers: (
    inbox: number,
    junk: number,
    drafts: number,
    unread: number,
  ) => {
    set({ inbox });
    set({ unread });
    set({ drafts });
    set({ junk });
  },
  addToNumber: (category: MailCategory) => {
    const state = get();

    const mail =
      category === "inbox"
        ? state.inbox
        : category === "drafts"
          ? state.drafts
          : state.junk;
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
          : state.junk;
    let count = mail - value;
    if (count < 0) count = 0;
    set({ [category]: count });
  },
}));
