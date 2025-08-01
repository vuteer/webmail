// quota - free, quota, total, used
// adjustStorage (size - )
// uploadFile
//

import { getQuotas } from "@/lib/api-calls/files";
import { QuotaType } from "@/types";
import { create } from "zustand";

type FileStateType = {
  total: number;
  used: number;
  adjustStorage: (size: number, key: string) => void;
  triggerQuotaCheck: () => Promise<void>;
};

export const fileStateStore = create<FileStateType>((set, get) => ({
  total: 0,
  used: 0,
  adjustStorage: (size: number, key: string) => {
    set({ [key]: size });
  },
  triggerQuotaCheck: async () => {
    const res = await getQuotas();

    if (res.quota) {
      set({ used: res.quota.used });
      set({ total: res.quota.quota });
    }
  },
}));
