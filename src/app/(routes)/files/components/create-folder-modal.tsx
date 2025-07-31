"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // optional for feedback
import { AppInput } from "@/components";
import { useQueryState } from "nuqs";
import { createFolder, updateFolder } from "@/lib/api-calls/files";
import { StorageFileType } from "@/types";
import { createToast } from "@/utils/toast";

interface CreateFolderModalProps {
  open: boolean;
  onClose: () => void;
  setFiles: React.Dispatch<React.SetStateAction<StorageFileType[]>>;
  file?: StorageFileType;
}

export function CreateFolderModal({
  open,
  onClose,
  setFiles,
  file,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dir] = useQueryState("dir");

  useEffect(() => {
    if (file) {
      setFolderName(file.name);
    }
  }, [file]);

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      toast.error("Folder name cannot be empty.");
      return;
    }

    if (file && file.name === folderName.trim()) {
      createToast("User Action", "Nothing to update.", "danger");
      return;
    }
    setLoading(true);
    try {
      const res = file
        ? await updateFolder({
            currentPath: file.path,
            newPath: `${dir || "/"}/${folderName.trim()}`,
          })
        : await createFolder({
            name: folderName.trim(),
            path: dir || "/",
          });

      if (res) {
        createToast(
          "User Action",
          file
            ? "Folder updated successfully."
            : "Folder created successfully.",
          "success",
        );
        const dir: StorageFileType = {
          path: res.url,
          isDirectory: true,
          name: folderName.trim(),
          size: 0,
          lastModified: new Date(),
        };
        if (!file) {
          setFiles((prevFiles) => [...prevFiles, dir]);
        } else {
          setFiles((prevFiles: StorageFileType[]) => {
            return prevFiles.map((item) => {
              if (item.path === file.path) {
                return dir;
              }
              return item;
            });
          });
        }
        onClose();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleChange = () => {
    if (open) {
      onClose();
      setFolderName("");
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {file
              ? file.isDirectory
                ? "Rename Folder"
                : "Rename File"
              : "Create New Folder"}
          </DialogTitle>
        </DialogHeader>
        {dir && (
          <p className="text-sm text-muted-foreground">
            Inside: <span className="font-mono">{dir}</span>
          </p>
        )}
        <AppInput
          placeholder="Folder name"
          value={folderName}
          setValue={setFolderName}
          disabled={loading}
        />
        <DialogFooter className="grid grid-cols-2 gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            size="sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? file
                ? "Updating..."
                : "Creating..."
              : file
                ? "Update"
                : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
