"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FilePreviewWithUploadStatus,
  FileUpload,
} from "@/components/ui/upload-files";
import { uploadFile } from "@/lib/api-calls/files";
import { fileStateStore } from "@/stores/files";
import { StorageFileType } from "@/types";
import { createToast } from "@/utils/toast";
import { useQueryState } from "nuqs";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  toDir?: string;
}

export const UploadFilesModal = ({
  open,
  onClose,
  setFiles,
  toDir,
}: UploadModalProps) => {
  const [dir] = useQueryState("dir");
  const { triggerQuotaCheck } = fileStateStore();
  const handleUpload = async (
    files: FilePreviewWithUploadStatus[],
    setUploadFiles: React.Dispatch<
      React.SetStateAction<FilePreviewWithUploadStatus[]>
    >,
  ) => {
    const updated = [];
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].uploadStatus === "uploading" ||
        files[i].uploadStatus === "success"
      )
        continue;
      const file = files[i].file as File;
      const directory = `${toDir || dir || "/"}`;
      const path = `${directory}${directory.endsWith("/") ? "" : "/"}${file.name}`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      setUploadFiles((prevFiles) =>
        prevFiles.map((f) => {
          if (f.id === files[i].id) {
            return { ...f, uploadStatus: "uploading" };
          }
          return f;
        }),
      );

      const res = await uploadFile(formData);
      if (res) {
        const fl: StorageFileType = {
          isDirectory: false,
          lastModified: new Date(),
          name: file.name,
          path: res,
          size: file.size,
        };

        setUploadFiles((prevFiles) =>
          prevFiles.map((f) => {
            if (f.id === files[i].id) {
              return { ...f, uploadStatus: "success" };
            }
            return f;
          }),
        );
        updated.push({ ...files[i], uploadStatus: "success" });
        setFiles((prev) => [fl, ...prev]);
      } else {
        setUploadFiles((prevFiles) =>
          prevFiles.map((f) => {
            if (f.id === files[i].id) {
              return { ...f, uploadStatus: "error" };
            }
            return f;
          }),
        );
      }
    }

    const allUploaded = updated.every(
      (file) => file.uploadStatus === "success",
    );

    if (allUploaded) {
      createToast("File Upload", "All files uploaded successfully", "success");
    }

    await triggerQuotaCheck();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
        </DialogHeader>
        <FileUpload onUpload={handleUpload} />
      </DialogContent>
    </Dialog>
  );
};
