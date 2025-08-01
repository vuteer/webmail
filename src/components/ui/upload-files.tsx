"use client";

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileUpIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";

import {
  FileWithPreview,
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createToast } from "@/utils/toast";

export type FilePreviewWithUploadStatus = FileWithPreview & {
  uploadStatus: "pending" | "uploading" | "success" | "error";
};
export function FileUpload({
  onUpload,
}: {
  onUpload: (
    files: FilePreviewWithUploadStatus[],
    setUploadFiles: React.Dispatch<
      React.SetStateAction<FilePreviewWithUploadStatus[]>
    >,
  ) => Promise<void>;
}) {
  const maxSize = 100 * 1024 * 1024; // 10MB default
  const maxFiles = 10;
  const [loading, setLoading] = useState(false);

  const [filesPreviewWithUploadStatus, setFilesPreviewWithUploadStatus] =
    useState<FilePreviewWithUploadStatus[]>([]);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles: [],
  });

  useEffect(() => {
    if (files.length > 0) {
      let updatedFiles: FilePreviewWithUploadStatus[] = [];

      // update new files to upload
      for (let i = 0; i < files.length; i++) {
        let curr = files[i];

        // check if file is withStatus then leave it
        const notInPreview = filesPreviewWithUploadStatus.find(
          (fl) => fl.id === curr.id,
        );
        if (!notInPreview) {
          updatedFiles.push({
            ...curr,
            uploadStatus: "pending",
          });
        } else {
          updatedFiles.push(notInPreview);
        }
      }

      // check files that have been removed
      for (let i = 0; i < filesPreviewWithUploadStatus.length; i++) {
        let curr = filesPreviewWithUploadStatus[i];

        // check if file has been removed from files
        const inFiles = files.find((fl) => fl.id === curr.id);
        if (!inFiles) {
          updatedFiles = updatedFiles.filter((fl) => fl.id !== curr.id);
        }
      }

      setFilesPreviewWithUploadStatus(updatedFiles);
    }
  }, [files]);

  const allUploaded = filesPreviewWithUploadStatus.every(
    (file) => file.uploadStatus === "success",
  );
  const handleUpload = async () => {
    if (allUploaded) {
      createToast("File Upload", "Nothing to upload", "danger");
      return;
    }
    setLoading(true);
    await onUpload(
      filesPreviewWithUploadStatus,
      setFilesPreviewWithUploadStatus,
    );

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
          disabled={loading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileUpIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload files</p>
          <p className="text-muted-foreground mb-2 text-xs">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            <span>All files</span>
            <span>∙</span>
            <span>Max {maxFiles} files</span>
            <span>∙</span>
            <span>Up to {formatBytes(maxSize)}</span>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {filesPreviewWithUploadStatus.length > 0 && (
        <div className={cn("space-y-2")}>
          {filesPreviewWithUploadStatus.map((file) => (
            <div
              key={file.id}
              className={cn(
                "bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3",
                file.uploadStatus === "uploading"
                  ? "border-yellow-500"
                  : file.uploadStatus === "success"
                    ? "border-green-500"
                    : file.uploadStatus === "error"
                      ? "border-red-500"
                      : "",
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                  {getFileIcon(file)}
                </div>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[13px] font-medium">
                    {file.file instanceof File
                      ? file.file.name
                      : file.file.name}
                  </p>
                  <p className="flex gap-4 text-muted-foreground text-xs">
                    <span>
                      {formatBytes(
                        file.file instanceof File
                          ? file.file.size
                          : file.file.size,
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-muted-foreground text-xs",
                        file.uploadStatus === "uploading"
                          ? "text-yellow-500"
                          : file.uploadStatus === "success"
                            ? "text-green-500"
                            : file.uploadStatus === "error"
                              ? "text-red-500"
                              : "",
                      )}
                    >
                      {file.uploadStatus === "uploading"
                        ? "Uploading..."
                        : file.uploadStatus === "success"
                          ? "Uploaded"
                          : file.uploadStatus === "error"
                            ? "Error"
                            : ""}
                    </span>
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
                disabled={loading}
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {filesPreviewWithUploadStatus.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                disabled={loading}
                size="sm"
                variant="outline"
                onClick={clearFiles}
              >
                Remove files
              </Button>
              <Button disabled={loading} size="sm" onClick={handleUpload}>
                Upload files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const getFileIcon = (file: {
  file: File | { type: string; name: string };
}) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type;
  const fileName = file.file instanceof File ? file.file.name : file.file.name;

  if (
    fileType.includes("pdf") ||
    fileName.endsWith(".pdf") ||
    fileType.includes("word") ||
    fileName.endsWith(".doc") ||
    fileName.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("zip") ||
    fileType.includes("archive") ||
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />;
  } else if (
    fileType.includes("excel") ||
    fileName.endsWith(".xls") ||
    fileName.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />;
  } else if (fileType.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />;
  } else if (fileType.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />;
  }
  return <FileIcon className="size-4 opacity-60" />;
};
