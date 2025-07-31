// file endpoints
import { FileType } from "@/types";
import { getDoc, postDoc, deleteDoc, patchDoc } from "@/utils/api-calls";
import { createToast } from "@/utils/toast";
import envs from "@/config/env";
// get base files
export const getBaseFiles = async () => {
  let res = await getDoc(`/files`, true);
  return res?.data?.docs || [];
};

export const getFilesInFolder = async (path: string) => {
  let res = await getDoc(`/files/list?dir=${encodeURIComponent(path)}`, true);
  return res?.data?.files || [];
};

export const getQuotas = async () => {
  let res = await getDoc(`/files/quotas`, true);
  return res?.data || false;
};

export const createFolder = async (data: { name: string; path: string }) => {
  const res = await postDoc(`/files`, data, true);
  if (!res.success) {
    createToast("Error", res.message || "Failed to create folder", "danger");
  }
  return res?.data || false;
};

export const updateFolder = async (data: {
  currentPath: string;
  newPath: string;
}) => {
  const res = await patchDoc(`/files`, data, true);
  if (!res.success) {
    createToast("Error", res.message || "Failed to update folder", "danger");
  }
  return res?.data || false;
};

// delete folder
//
export const deleteFolder = async (path: string) => {
  const res = await deleteDoc(`/files/?dir=${encodeURIComponent(path)}`, true);

  if (!res.success) {
    createToast("Error", res.message || "Failed to delete folder", "danger");
  }
  return res?.success || false;
};

// download file
//
export const downloadFile = async (path: string) => {
  const res = await fetch(
    `${envs.api_url}/files/download?dir=${encodeURIComponent(path)}`,
    {
      credentials: "include",
    },
  );
  try {
    const blob = await res.blob();
    const filenameArr = path.split("/").filter(Boolean);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filenameArr[filenameArr.length - 1];
    link.click();
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error(error);
    createToast("Error", "Failed to download file", "danger");
    return false;
  }
};
