"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/upload-files";
import { StorageFileType } from "@/types";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
}

export const UploadFilesModal = ({
  open,
  onClose,
  setFiles,
}: UploadModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
        </DialogHeader>
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
};
