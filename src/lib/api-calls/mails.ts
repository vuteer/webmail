import { deleteDoc, getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get mail numbers
export const getNumbers = async () => {
  let res = await getDoc(`/mails/numbers/state`, true);
  return res?.data || false;
};

// get mails
export const getThreads = async (
  section: string,
  page: number,
  queryStr?: string,
) => {
  let res = await getDoc(
    `/mails/${section}?page=${page || 0}&${queryStr ? queryStr : ""}`,
    true,
  );
  return res?.data?.docs || false;
};

// get mail & thread
export const getThread = async (id: string) => {
  let res = await getDoc(`/mails/${id}`, true);
  return res?.data || false;
};

// get thread mails
export const getMails = async (
  threadId: string,
  page: number,
  section: string,
) => {
  let res = await getDoc(
    `/mails/${threadId}/thread?page=${page}&section=${section}`,
    true,
  );

  return res?.data || false;
};

// update mail flags
export const updateMailFlags = async (
  messageId: string,
  folder: string,
  flag: string,
  action: string,
) => {
  let res = await patchDoc(
    `/mails/${messageId}/${folder}?flag=${flag}&action=${action}`,
    {},
    true,
  );
  return res?.success;
};

//toggle archive and trash
export const toggleLocation = async (
  messageId: string,
  folder: string,
  location: string,
  action: string,
) => {
  let res = await patchDoc(
    `/mails/${messageId}/${folder}/${location}?action=${action}`,
    {},
    true,
  );

  return res?.success;
};

export const sendMail = async (data: any) => {
  const res = await postDoc("/mails", data, true);

  console.log(res);
  return res?.data?.doc || false;
};

// old
// update mail
export const updateThread = async (threadId: string, data: any) => {
  let res = await patchDoc(`/mails/${threadId}`, data, true);
  return res?.status === "success" || false;
};

// delete mail
export const deleteThread = async (threadId: string) => {
  let res = await deleteDoc(`/mails/${threadId}`, true);
  return res?.status === "success" || false;
};

// send mail & save draft
export const sendMail2 = async (data: any) => {
  let res = await postDoc(`/mails`, data, true);
  console.log(res);
  return res?.data?.doc || false;
};

// send draft
export const sendDraft = async (mailId: string) => {
  let res = await postDoc(`/mails/draft/${mailId}`, {}, true);
  return res?.status === "success";
};

// forward mails
export const forwardMail = async (mailId: string, emails: string[]) => {
  let res = await postDoc(`/mails/forward/${mailId}`, { emails }, true);
  return res?.status === "success";
};

// search and sort by unread/recent
export const searchThroughMail = async (
  q: string,
  sortBy: string,
  section: string,
  page?: number,
) => {
  let res = await postDoc(
    `/mails/search?page=${page}&type=${section}`,
    { q, sortBy },
    true,
  );
  return res?.data || false;
};

// delete selected
export const deleteSelected = async (selected: string[], section?: string) => {
  let res = await postDoc(
    `/mails/delete${section ? `?section=${section}` : ""}`,
    { selected },
    true,
  );
  return res?.status === "success";
};

//delete a single mail in a thread
export const deleteOne = async (mailId: string) => {
  let res = await deleteDoc(`/mails/delete/${mailId}`, true);
  return res?.status === "success";
};

// mark as read
export const markAsRead = async (all?: boolean, selected?: string[]) => {
  let res = await patchDoc(
    `/mails/read/update${all ? "?all=1" : ""}`,
    { selected: selected || null },
    true,
  );
  return res?.status === "success";
};

// sending

// Appointments -
// — notifications
// — notify others when near
// — total number

// Events
// — notify others on creation and on near
// — total

// Files
// — file sharing
// — upon deleting, delete everywhere
// — grid

// Profile
// Settings - mail signatures

// State numbers
