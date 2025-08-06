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
  moreLoading: boolean;
  setMoreLoading: () => void;
  setThreads: (threads: ThreadType[]) => void;
  updateThread: (messageId: string, updates: Partial<ThreadType>) => void;
  removeThread: (messageId: string) => void;
  clearThreads: () => void;
  fetchThreads: (
    title: string,
    page: number,
    status?: string,
    refreshing?: boolean,
    notificationTrigger?: boolean,
  ) => Promise<void>;
  appendThread: (thread: ThreadType) => void;
};

export const useThreadStore = create<ThreadStore>()(
  immer((set) => ({
    threads: [],
    threadsLoading: true,
    moreLoading: false,
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
    setMoreLoading: () =>
      set((state) => {
        state.moreLoading = !state.moreLoading;
      }),
    fetchThreads: async (
      title,
      page,
      status,
      refreshing,
      notificationTrigger,
    ) => {
      try {
        if ((!page || page === 0 || refreshing) && !notificationTrigger) {
          set((state) => {
            state.threadsLoading = true;
          });
        }
        const result = await getThreads(title, page, status);
        // Assume the API returns: { success: true, data: { docs: ThreadType[] } }

        if (result) {
          if (!page || page === 0) {
            set((state) => {
              state.threads = result;
            });
          } else {
            set((state) => {
              const merged = [...state.threads, ...result];
              const unique = Array.from(
                new Map(merged.map((item) => [item.messageId, item])).values(),
              );
              state.threads = unique;
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch threads:", error);
      } finally {
        setTimeout(() => {
          set((state) => {
            state.threadsLoading = false;
          });
          set((state) => {
            state.moreLoading = false;
          });
        }, 1500);
      }
    },
    appendThread: (thread) =>
      set((state) => {
        state.threads.unshift(thread);
      }),
  })),
);
