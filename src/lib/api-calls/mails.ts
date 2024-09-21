
import { deleteDoc, getDoc, patchDoc, postDoc } from '@/utils/api-calls';


// get mail numbers
export const getNumbers = async () => {
  let res = await getDoc(`/mails/numbers/state`, true); 
  return res?.data?.state; 
}

// get mails
export const getThreads = async (section: string, page: string, queryStr?: string) => {
  let res = await getDoc(`/mails?type=${section}&page=${page || 0}&${queryStr ? queryStr : ""}`, true);
  return res?.data || false;
}

// get mail & thread
export const getThread = async (id: string) => {
  let res = await getDoc(`/mails/${id}`, true);
  return res?.data || false;
}

// get thread mails
export const getMails = async (threadId: string, page: string) => {
  let res = await getDoc(`/mails/list/${threadId}?page=${page}`, true);
 
  return res?.data || false; 
}

// update mail
export const updateThread = async (threadId: string, data: any) => {
  let res = await patchDoc(`/mails/${threadId}`, data, true);
  return res?.status === "success" || false;
}

// delete mail 
export const deleteThread = async (threadId: string) => {
  let res = await deleteDoc(`/mails/${threadId}`, true); 
  return res?.status === "success" || false; 
}


// send mail & save draft 
export const sendMail = async (data: any) => {
  let res = await postDoc(`/mails`, data, true); 
  return res?.data?.doc || false; 
}

// send draft
export const sendDraft = async (mailId: string) => {
  let res = await postDoc(`/mails/draft/${mailId}`, {}, true); 
  return res?.status === "success"; 
}

// forward mails 
export const forwardMail = async (mailId: string, emails: string[]) => {
  let res = await postDoc(`/mails/forward/${mailId}`, {emails}, true); 
  return res?.status === "success"; 
}

// search and sort by unread/recent
export const searchThroughMail = async (q: string, sortBy: string, section: string, page?: string) => {
  let res = await postDoc(`/mails/search?page=${page}&type=${section}`, {q, sortBy}, true);
  return res?.data || false; 
}

// delete selected 
export const deleteSelected = async (selected: string[]) => {
  let res = await postDoc(`/mails/delete`, {selected}, true);
  return res?.status === "success"; 
}

//delete a single mail in a thread
export const deleteOne = async (mailId: string) => {
  let res = await deleteDoc(`/mails/delete/${mailId}`, true);
  return res?.status === "success";
}

// mark as read
export const markAsRead = async (all?: boolean, selected?: string[]) => {
  let res = await patchDoc(`/mails/read/update${all ? "?all=1": ""}`, {selected: selected || null}, true);
  return res?.status === "success"; 
}