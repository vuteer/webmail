// quota - free, quota, total, used
// adjustStorage (size - )
// uploadFile
//

import { QuotaType } from "@/types";
import { create } from "zustand";

type FileStateType = {
  total: number;
  used: number;
  adjustStorage: (size: number, key: string) => void;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  editFile: (path: string, newContent: string) => Promise<void>;
};

export const fileStateStore = create<FileStateType>((set, get) => ({
  total: 0,
  used: 0,
  adjustStorage: (size: number, key: string) => {
    set({ [key]: size });
  },
  uploadFile: async (file: File) => {},
  deleteFile: async (path: string) => {},
  editFile: async (path: string, newContent: string) => {},
}));
