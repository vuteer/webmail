"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorageFileType } from "@/types";
import { useState } from "react";
import { deleteFolder } from "@/lib/api-calls/files";
import { useQueryState } from "nuqs";
import { createToast } from "@/utils/toast";
import { fileStateStore } from "@/stores/files";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  file: StorageFileType;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
}

export function DeleteModal({
  open,
  onClose,
  file,
  setFiles,
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const { triggerQuotaCheck } = fileStateStore();

  const [dir] = useQueryState("dir");
  const handleDelete = async () => {
    // Implement delete logic here
    setLoading(true);
    const filePathArr = file.path.split("/").filter(Boolean);
    const res = await deleteFolder(
      `${dir || ""}/${filePathArr[filePathArr.length - 1]}`,
    );
    if (res) {
      createToast("Success", "Deletion was successfull", "success");
      setFiles((prevFiles) => prevFiles.filter((f) => f.path !== file.path));
      await triggerQuotaCheck();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {file.isDirectory ? "Delete Folder?" : "Delete File?"}
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. All contents inside folders will also be
          deleted.
        </p>

        <DialogFooter className="grid grid-cols-2 gap-1">
          <Button
            variant="secondary"
            onClick={onClose}
            size="sm"
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            size="sm"
            className="w-full"
            disabled={loading}
          >
            Delet{loading ? "ing..." : "e"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteMultipleProps {
  selectedFiles: StorageFileType[];
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  open: boolean;
  onClose: () => void;
}

export const DeleteMultipleModal = ({
  open,
  onClose,
  selectedFiles,
  setFiles,
  setSelectedFiles,
}: DeleteMultipleProps) => {
  const [loading, setLoading] = useState(false);
  const { triggerQuotaCheck } = fileStateStore();
  const total = selectedFiles.length;
  let count = 0;
  const [dir] = useQueryState("dir");
  const handleDelete = async () => {
    // Implement delete logic here
    setLoading(true);
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const filePathArr = file.path.split("/").filter(Boolean);
      const res = await deleteFolder(
        `${dir || ""}/${filePathArr[filePathArr.length - 1]}`,
      );
      if (res) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.path !== file.path));
        setSelectedFiles((prevFiles) =>
          prevFiles.filter((f) => f.path !== file.path),
        );
        await triggerQuotaCheck();
        count = count + 1;
      } else {
        createToast("Error", `Deletion failed for ${file.name}`, "danger");
      }
      if (count === total) {
        createToast("Success", "Deletion was successfull", "success");
        onClose();
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Multiple Files/Folders</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. All contents inside folders will also be
          deleted.
        </p>

        <DialogFooter className="grid grid-cols-2 gap-1">
          <Button
            variant="secondary"
            onClick={onClose}
            size="sm"
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            size="sm"
            className="w-full"
            disabled={loading}
          >
            Delet{loading ? "ing..." : "e"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
