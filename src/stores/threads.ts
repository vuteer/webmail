import { getThreads } from "@/lib/api-calls/mails";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type MailAddress = {
  address: string;
  name: string;
};

export type ThreadType = {
  uid: number;
  id: string;
  subject: string;
  from: MailAddress;
  to: MailAddress[];
  date: string;
  messageId: string;
  flags: string[];
  hasAttachment: boolean;
  trashed: boolean;
};

type ThreadStore = {
  threads: ThreadType[];
  threadsLoading: boolean;
  setThreads: (threads: ThreadType[]) => void;
  updateThread: (messageId: string, updates: Partial<ThreadType>) => void;
  removeThread: (messageId: string) => void;
  clearThreads: () => void;
  fetchThreads: (title: string, page: number) => Promise<void>;
};

export const useThreadStore = create<ThreadStore>()(
  immer((set) => ({
    threads: [],
    threadsLoading: true,

    setThreads: (threads) =>
      set((state) => {
        state.threads = threads;
      }),

    updateThread: (messageId, updates) =>
      set((state) => {
        const thread = state.threads.find((t) => t.messageId === messageId);
        if (thread) {
          Object.assign(thread, updates);
        }
      }),

    removeThread: (messageId) =>
      set((state) => {
        state.threads = state.threads.filter((t) => t.messageId !== messageId);
      }),

    clearThreads: () =>
      set((state) => {
        state.threads = [];
      }),

    fetchThreads: async (title, page) => {
      try {
        set((state) => {
          state.threadsLoading = true;
        });
        const result = await getThreads(title, page);
        // Assume the API returns: { success: true, data: { docs: ThreadType[] } }
        if (result) {
          set((state) => {
            state.threads = result;
          });
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      } finally {
        set((state) => {
          state.threadsLoading = false;
        });
      }
    },
  })),
);
