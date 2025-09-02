import { getThreads } from "@/lib/api-calls/threads";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type MailAddress = {
  address: string;
  name: string;
};

export type ThreadType = {
  uid: number;
  _id: string;
  subject: string;
  from: MailAddress;
  to: MailAddress[];
  date: string;
  messageId: string;
  flags: string[];
  hasAttachment: boolean;
  trashed: boolean;
  unreadCount?: number;
};

type ThreadStore = {
  threads: ThreadType[];
  threadsCount: number;
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
    threadsCount: 0,
    threadsLoading: true,
    moreLoading: false,
    setThreads: (threads) =>
      set((state) => {
        state.threads = threads;
      }),

    updateThread: (messageId, updates) =>
      set((state) => {
        console.log(messageId, updates);
        const thread = state.threads.find((t) => t._id === messageId);
        if (thread) {
          Object.assign(thread, updates);
        }
      }),

    removeThread: (messageId) =>
      set((state) => {
        state.threads = state.threads.filter((t) => t._id !== messageId);
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
        const result = await getThreads(title, status, page);

        if (result) {
          set((state) => {
            state.threadsCount = result.total;
          });
          if (!page || page === 0) {
            set((state) => {
              state.threads = result.docs;
            });
          } else {
            set((state) => {
              const merged = [...state.threads, ...result.docs];
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
