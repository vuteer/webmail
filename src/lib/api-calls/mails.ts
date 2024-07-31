
import { deleteDoc, getDoc, patchDoc, postDoc } from '@/utils/api-calls';

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


// send mail & draft 
export const sendMail = async (data: any) => {
  let res = await postDoc(`/mails`, data, true); 
  
  return res?.data?.doc || false; 
}

// search and sort by unread/recent
export const searchThroughMail = async (q: string, sortBy: string, section: string, page?: string) => {
  let res = await postDoc(`/mails/search?page=${page}&type=${section}`, {q, sortBy}, true);
  return res?.data || false; 
}

// delete selected 
export const deleteSelected = async (selected: string[]) => {
  let res = await postDoc(`/mails/delete`, {selected}, true);
  return res?.status === "success" || false; 
}

// mark as read
export const markAsRead = async (all?: boolean, selected?: string[]) => {
  let res = await patchDoc(`/mails/read/update${all ? "?all=1": ""}`, {selected: selected || null}, true);
  return res?.status === "success" || false; 
}






// send new mail
// export const sendNewMail = async (data, draft = false) => {
//   let res = await postDoc(`/mail/${draft ? "draft": "new"}`, data, true);
//   return res.data?.mailId || false;
// }


// send reply mail
// export const sendMail = async (data, draft = false) => {
//   let res = await postDoc(`/mail${draft ? "/draft": ""}`, data, true);
//   return res?.status === "success" || false;
// }

// forward mail
// export const forwardMail = async (id, data) => {
//   let res = await postDoc(`/mail/forward/${id}`, data, true);

//   return res?.status === "success" || false;
// }


// mark all as read
// export const markAllAsRead = async () => {
//   let res = await patchDoc('/mail/read/all', {}, true); 
//   return res?.status === "success" || false; 
// }

// clearing drafts, archived, junk, important, trashed
// export const updateThreadsClearing = async (type) => {
//   let res = await patchDoc(`/mail/update/${type}`, {}, true); 
//   return res?.status === "success" || false; 
// }


// search for mail 
// export const searchThroughMail = async (q) => {
//   let res = await postDoc(`/mail/search/items`, {q}, true); 
//   return res?.data || false; 
// }