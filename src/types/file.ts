export type QuotaType = {
  total: number;
  used: number;
};

export type StorageFileType = {
  isDirectory: boolean;
  lastModified: Date;
  name: string;
  path: string;
  size: number;
};
