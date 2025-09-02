import { deleteDoc, getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get mail numbers
export const getNumbers = async () => {
  let res = await getDoc(`/mails/numbers/state`, true);
  return res?.data || false;
};

// get mails
export const getMails = async (
  threadId: string,
  folder: string,
  page?: number,
) => {
  let res = await getDoc(
    `/mails/${threadId}/${folder}/list?page=${page || 0}`,
    true,
  );
  return res?.data || false;
};

// get mail & thread
export const getThread = async (id: string) => {
  let res = await getDoc(`/mails/${id}`, true);
  return res?.data || false;
};

export const sendMail = async (data: any) => {
  const res = await postDoc("/mails", data, true);
  return res?.data || false;
};

// draft
export const createDraft = async (data: any) => {
  const res = await postDoc("/mails/draft", data, true);
  return res?.data?.doc || false;
};

// search for mail
export const searchMail = async (q: string, folder: string) => {
  const res = await getDoc(`/mails/search/list?q=${q}&folder=${folder}`);
  return res?.data || [];
};

// mark all as read
export const markAllAsRead = async () => {
  const res = await patchDoc("/mails/update/mark/all/read", {}, true);
  return res?.success;
};

// delete mails
export const deleteMails = async (folder: string, data: any) => {
  const res = await postDoc(`/mails/delete/${folder}`, data, true);
  return res?.success;
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
