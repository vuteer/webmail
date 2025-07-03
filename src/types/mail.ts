// mail type

export type ContactType = {
  name: string;
  address: string;
  image?: string;
  avatar?: string;
};
export type FileType =
  | "audio"
  | "document"
  | "other"
  | "PDF"
  | "image"
  | "video"
  | "excel"
  | "CSV"
  | "zip"
  | "folder";
export type VisibilityType = "public" | "organization" | "private" | "limited";

export type AttachmentType = {
  id: string;
  title: string;
  size: number;
  type: FileType;
  visibility?: VisibilityType;
  sharedWith?: string[];
  createdAt: Date;
};

export type MailType = {
  messageId: string;
  id: string;
  text: string;
  html?: string;
  info: ThreadInfoType;
  createdAt: Date;
  attachments?: AttachmentType[];
};
export type ThreadType = {
  id: string;
  from: ContactType;
  to: ContactType;
  subject: string;
  attachments?: number;
  flags: string[];
  labels?: string[];
  text?: string;
  html?: string;
  cc?: ContactType[];
  bcc?: ContactType[];
  messageId: string;
  date: string;
  inReplyTo?: string;
  replyTo?: string;
  mailedBy?: string;
  signedBy?: string;
  security?: string;
};

export type ThreadInfoType = {
  archived: boolean;
  important: boolean;
  junk: boolean;
  starred: boolean;
  flag: boolean;
  trashed: boolean;
  forwarded?: boolean;
  draft?: boolean;
  sent?: boolean;
  read?: boolean;
};
