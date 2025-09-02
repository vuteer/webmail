import { deleteDoc, getDoc, patchDoc, postDoc } from "@/utils/api-calls";

// get threads
export const getThreads = async (
  folder: string,
  unread?: string,
  page?: number,
) => {
  const url = `/threads/${folder}?${unread ? "unread=true&" : ""}${page ? `page=${page}&` : ""}`;
  const res = await getDoc(url, true);
  return res.data || false;
};

// update thread
export const updateThreadApi = async (
  threadId: string,
  data: Record<string, any>,
) => {
  let res = await patchDoc(`/threads/${threadId}`, data, true);
  return res?.success;
};

export const handleReadThread = async (threadId: string) => {
  let res = await patchDoc(`/threads/${threadId}/read`, {}, true);

  return res?.success;
};

export const handleDeleteThread = async (threadId: string) => {
  let res = await deleteDoc(`/threads/${threadId}`, true);
  console.log(res);
  return res?.success;
};
